import "./App.css";
import React, { useRef } from "react";
import Sidebar from "./components/Sidebar";
import ExperimentChart from "./components/ExperimentChart";

const App = () => {
  const expOptions = useRef({
    dau: 1000,
    dauStd: 100,
    baseCtr: 0.5,
    lift: 0.05,
    treatProp: 0.5,
    expLen: 7 * 24,
  });
  const chartRef = useRef(null);

  const handleGo = () => {
    chartRef.current?.startSimulation();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#dddddd]">
      <Sidebar onGo={handleGo} expOptions={expOptions} />
      <div className="my-40 flex-1 p-4">
        <ExperimentChart chartRef={chartRef} expOptions={expOptions} />
      </div>
    </div>
  );
};

export default App;
