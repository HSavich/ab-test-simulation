import React, { useRef, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import jstat from "jstat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const HOURS = 24 * 7;
const USERS_PER_HOUR = 500;
const CONTROL_P = 0.5;
const TREAT_P = 0.525;
const TICK_MS = 250;

// --- Binomial sampler (exact for small n, normal approx for large n)
function binomSample(n, p) {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  if (n < 50) {
    let k = 0;
    for (let i = 0; i < n; i++) if (Math.random() < p) k++;
    return k;
  }
  const mean = n * p;
  const sd = Math.sqrt(n * p * (1 - p));
  const r = Math.round(jstat.normal.sample(mean, sd));
  return Math.max(0, Math.min(n, r));
}

// --- Welch’s t-test p-value for two proportions
function signedPvalWelchProportions(t) {
  const { xC, nC, xT, nT } = t;
  if (nC < 2 || nT < 2) return 1.0;

  const p1 = xC / nC;
  const p2 = xT / nT;
  const s1 = p1 * (1 - p1);
  const s2 = p2 * (1 - p2);
  const se = Math.sqrt(s1 / nC + s2 / nT);
  if (!isFinite(se) || se === 0) return 1.0;

  const tstat = (p2 - p1) / se;

  // Welch–Satterthwaite df
  const a = s1 / nC;
  const b = s2 / nT;
  const df = (a + b) ** 2 / ((a * a) / (nC - 1) + (b * b) / (nT - 1));
  if (!isFinite(df) || df <= 0) return 1.0;

  const p = 1 - jstat.studentt.cdf(Math.abs(tstat), df);
  const sign = p2 > p1 ? 1 : -1;
  return sign * p;
}

const ExperimentChart = ({ chartRef }) => {
  const [labels, setLabels] = useState([]);
  const [neglogp, setNeglogp] = useState([]);
  const [running, setRunning] = useState(false);

  const talliesRef = useRef({ xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 });
  const intervalRef = useRef(null);

  // attach startSimulation method to the passed-in ref
  useEffect(() => {
    if (chartRef) {
      chartRef.current = {
        startSimulation: () => {
          console.log("Simulation Started");
          talliesRef.current = { xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 };
          setLabels([]);
          setNeglogp([]);
          setRunning(true);
        },
      };
    }
  }, [chartRef]);

  useEffect(() => {
    if (!running) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const t = talliesRef.current;

      if (t.hour >= HOURS) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
        return;
      }

      const nC = Math.floor(USERS_PER_HOUR / 2);
      const nT = USERS_PER_HOUR - nC;

      const xC = binomSample(nC, CONTROL_P);
      const xT = binomSample(nT, TREAT_P);

      t.xC += xC;
      t.nC += nC;
      t.xT += xT;
      t.nT += nT;
      t.hour += 1;

      const pval = signedPvalWelchProportions(t);
      const y = -Math.log10(pval);

      setLabels((prev) => [...prev, `h${t.hour}`]);
      setNeglogp((prev) => [...prev, y]);
    }, TICK_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const data = {
    labels,
    datasets: [
      {
        label: "-log10(p-value)",
        data: neglogp,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
      },
    ],
  };

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: { label: (ctx) => `-log10(p): ${ctx.parsed.y.toFixed(3)}` },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Hours" },
        ticks: { autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        title: { display: true, text: "-log10(p)" },
        suggestedMin: 0,
        suggestedMax: 4,
      },
    },
  };

  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      <div className="mb-2 text-sm text-stone-600">
        Streaming A/B test over 1 week — 50 users/hour, treatment has +5%
        relative lift (0.50 → 0.525).
      </div>
      <div className="h-[calc(100%-2rem)]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ExperimentChart;
