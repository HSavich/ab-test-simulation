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

// --- Welch’s t-test p-value for two proportions
function signedPvalWelchProportions(t) {
  const { xC, nC, xT, nT } = t;
  if (nC < 2 || nT < 2) return [1, 1];

  const p1 = xC / nC;
  const p2 = xT / nT;
  const s1 = p1 * (1 - p1);
  const s2 = p2 * (1 - p2);
  const se = Math.sqrt(s1 / nC + s2 / nT);
  if (!isFinite(se) || se === 0) return [1, 1];

  const tstat = (p2 - p1) / se;

  // Welch–Satterthwaite df
  const a = s1 / nC;
  const b = s2 / nT;
  const df = (a + b) ** 2 / ((a * a) / (nC - 1) + (b * b) / (nT - 1));
  if (!isFinite(df) || df <= 0) return [1, 1];

  const p = 1 - jstat.studentt.cdf(Math.abs(tstat), df);
  const sign = p2 > p1 ? 1 : -1;
  return [sign, p];
}

const ExperimentChart = ({ talliesRef, labels, neglogp }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "-log10(p-value)",
        data: neglogp,
        borderColor: "#ff7f0e", // orange line
        backgroundColor: "#ff7f0e",
        borderWidth: 2, // bolder line
        pointRadius: 0,
        tension: 0.25,
      },
    ],
  };

  const useDays = talliesRef.current.hour >= 48;

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
        title: {
          display: true,
          text: useDays ? "Day" : "Hour",
          font: { size: 16, weight: "bold" },
        },
        ticks: {
          autoSkip: useDays ? false : true,
          maxTicksLimit: 12,
          callback: function (value, index) {
            if (!useDays) {
              return this.getLabelForValue(value); // 1 decimal place
            } else {
              const day = this.getLabelForValue(value) / 24;
              if (day % 1 == 0) {
                return day;
              } else {
                return null;
              }
            }
          },
          color: "#333",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "#ccc" },
      },
      y: {
        title: {
          display: true,
          text: "P-value",
          font: { size: 16, weight: "bold" },
        },
        suggestedMin: -4,
        suggestedMax: 4,
        ticks: {
          callback: function (value) {
            const p = Math.pow(10, -Math.abs(value));
            // Format in scientific notation if very small
            return p < 0.001 ? p.toExponential(1) : p.toFixed(3);
          },
          color: "#333",
          font: { size: 14 },
        },
        grid: {
          color: (context) => (context.tick.value === 0 ? "#000" : "#ccc"),
          lineWidth: (context) => (context.tick.value === 0 ? 2 : 1),
        },
      },
    },
  };

  const nT = talliesRef.current.nT;
  const nC = talliesRef.current.nC;
  const xT = talliesRef.current.xT;
  const xC = talliesRef.current.xC;
  const nU = nT + nC;
  const pc_hat = xC / nC;
  const pt_hat = xT / nT;
  const lift_hat = pt_hat / pc_hat - 1;
  const [_, p] = signedPvalWelchProportions({ xC, nC, xT, nT });

  return (
    <div className="h-[calc(100%-2rem)]">
      <Line data={data} options={options} />
    </div>
  );
};

export default ExperimentChart;
