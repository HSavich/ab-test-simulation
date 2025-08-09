// ExperimentChart.jsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
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

// --- Simulation params
const HOURS = 24 * 7; // 168 hours (1 week)
const USERS_PER_HOUR = 50; // total across both arms
const CONTROL_P = 0.5;
const TREAT_P = 0.525; // 5% lift over control
const TICK_MS = 250; // 4 hours per second (1 hour / 250ms)
const EPS = 1e-300;

// Welch’s t-test p-value comparing two Bernoulli means (proportions)
function welchPValueFromProportions(x1, n1, x2, n2) {
  if (n1 < 2 || n2 < 2) return 1.0;

  const p1 = x1 / n1;
  const p2 = x2 / n2;

  // Bernoulli variance estimate
  const s1 = p1 * (1 - p1);
  const s2 = p2 * (1 - p2);

  const se = Math.sqrt(s1 / n1 + s2 / n2);
  if (!isFinite(se) || se === 0) return 1.0;

  const t = (p1 - p2) / se;

  // Welch–Satterthwaite df
  const a = s1 / n1;
  const b = s2 / n2;
  const df = (a + b) ** 2 / ((a * a) / (n1 - 1) + (b * b) / (n2 - 1));
  if (!isFinite(df) || df <= 0) return 1.0;

  // two-sided p-value using Student-t CDF
  const cdf = jstat.studentt.cdf(Math.abs(t), df);
  const p = 2 * (1 - cdf);

  return Math.min(Math.max(p, EPS), 1);
}

const ExperimentChart = forwardRef((props, ref) => {
  const [labels, setLabels] = useState([]);
  const [neglogp, setNeglogp] = useState([]);
  const [running, setRunning] = useState(false);

  // cumulative tallies
  const talliesRef = useRef({ xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 });
  const intervalRef = useRef(null);

  // expose a start function to parent
  useImperativeHandle(ref, () => ({
    startSimulation() {
      talliesRef.current = { xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 };
      setLabels([]);
      setNeglogp([]);
      setRunning(true);
    },
  }));

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

      // split users 50/50 each hour
      const nC = Math.floor(USERS_PER_HOUR / 2);
      const nT = USERS_PER_HOUR - nC;

      // jstat binomial samples
      const xC = jstat.binomial.sample(nC, CONTROL_P);
      const xT = jstat.binomial.sample(nT, TREAT_P);

      t.xC += xC;
      t.nC += nC;
      t.xT += xT;
      t.nT += nT;
      t.hour += 1;

      const pval = welchPValueFromProportions(t.xC, t.nC, t.xT, t.nT);
      const y = -Math.log10(Math.max(pval, EPS));

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
        callbacks: {
          label: (ctx) => `-log10(p): ${ctx.parsed.y.toFixed(3)}`,
        },
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
        grid: { drawBorder: false },
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
});

export default ExperimentChart;
