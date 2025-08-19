import React, { useRef, useState, useEffect } from "react";
import jstat from "jstat";
import ExperimentChart from "./ExperimentChart";

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

const Simulation = ({ simRef, expOptions }) => {
  const [labels, setLabels] = useState([]);
  const [neglogp, setNeglogp] = useState([]);
  const [running, setRunning] = useState(false);

  const talliesRef = useRef({ xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 });
  const intervalRef = useRef(null);

  // attach startSimulation method to the passed-in ref
  useEffect(() => {
    if (simRef) {
      simRef.current = {
        startSimulation: () => {
          talliesRef.current = { xC: 0, nC: 0, xT: 0, nT: 0, hour: 0 };
          setLabels([]);
          setNeglogp([]);
          setRunning(true);
        },
      };
    }
  }, [simRef]);

  useEffect(() => {
    if (!running) return;
    // clear any previous timer
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }

    const step = () => {
      const t = talliesRef.current;

      if (t.hour >= expOptions.current.expLen) {
        setRunning(false);
        return;
      }

      let nU = Math.round(
        jstat.normal.sample(
          expOptions.current.dau / 24,
          Math.sqrt(expOptions.current.dauStd ** 2 / 24),
        ),
      );
      //hourly users cannot be below zero. We truncate above to
      //keep expected value constant for low nU
      //toDo use negative binomial to fix
      nU = Math.min(Math.max(nU, 0), Math.floor(expOptions.current.dau / 12));

      //calculate novelty/primacy effect
      let novelty =
        1 +
        (expOptions.current.novelty *
          (expOptions.current.noveltyLen - t.hour)) /
          expOptions.current.noveltyLen;
      if (t.hour > expOptions.current.noveltyLen) {
        novelty = 1;
      }

      const nT = binomSample(nU, expOptions.current.treatProp);
      const nC = nU - nT;
      const xC = binomSample(nC, expOptions.current.baseCtr);
      const xT = binomSample(
        nT,
        expOptions.current.baseCtr * (1 + expOptions.current.lift) * novelty,
      );
      t.xC += xC;
      t.nC += nC;
      t.xT += xT;
      t.nT += nT;
      t.hour += 1;

      const [sign, pval] = signedPvalWelchProportions(t);
      const y = sign * -Math.log10(pval);

      setLabels((prev) => [...prev, `${t.hour}`]);
      setNeglogp((prev) => [...prev, y]);

      // schedule next tick: 4/s (250ms) through hour 24, then 8/s through hour 48,
      // then 10/s (100ms)
      const nextDelay = t.hour > 48 ? 100 : t.hour > 24 ? 175 : 250;
      intervalRef.current = setTimeout(step, nextDelay);
    };

    // kick off first tick
    const initialDelay = talliesRef.current.hour < 48 ? 250 : 100;
    intervalRef.current = setTimeout(step, initialDelay);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

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
    <div className="h-full w-full rounded-xl bg-white p-4">
      <ExperimentChart
        talliesRef={talliesRef}
        labels={labels}
        neglogp={neglogp}
      />
      <a className="mr-8">Users = {nU}</a>
      {nU > 0 && (
        <>
          <a className="mr-8">
            Control Clickthrough = {(pc_hat * 100).toFixed(2)}%
          </a>
          <a className="mr-8">
            Treatment Clickthrough = {(pt_hat * 100).toFixed(2)}%
          </a>
          <a className="mr-8">Lift Estimate = {(lift_hat * 100).toFixed(2)}%</a>
          <a className="mr-8">
            P-value = {p < 0.001 ? p.toExponential(1) : p.toFixed(3)}
          </a>
        </>
      )}
    </div>
  );
};

export default Simulation;
