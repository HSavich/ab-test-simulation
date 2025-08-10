import "./App.css";
import React, { useRef } from "react";
import Sidebar from "./components/Sidebar";
import ExperimentChart from "./components/ExperimentChart";

const App = () => {
  const chartRef = useRef(null);

  const handleGo = () => {
    console.log("Handling go");
    chartRef.current?.startSimulation();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#dddddd]">
      <Sidebar onGo={handleGo} />
      <div className="my-40 flex-1 p-4">
        <ExperimentChart chartRef={chartRef} />
      </div>
    </div>
  );
};

export default App;
