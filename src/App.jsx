import "./App.css";
import React, { useRef } from "react";
import Sidebar from "./components/Sidebar";
import ExperimentChart from "./components/ExperimentChart";

const App = () => {
  const chartRef = useRef(null);

  const handleGo = () => {
    // tell the chart to (re)start the simulation
    chartRef.current?.startSimulation();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-900">
      {/* Sidebar on the left */}
      <Sidebar onGo={handleGo} />

      {/* Main content with chart */}
      <div className="my-40 flex-1 p-4">
        <ExperimentChart ref={chartRef} />
      </div>
    </div>
  );
};

export default App;
