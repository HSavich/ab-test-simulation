import "./App.css";
import React, { useRef } from "react";
import Sidebar from "./components/Sidebar";
import Simulation from "./components/Simulation";

const App = () => {
  const expOptions = useRef({
    dau: 1000,
    dauStd: 100,
    baseCtr: 0.5,
    lift: 0.05,
    treatProp: 0.5,
    expLen: 7 * 24,
  });
  const simRef = useRef(null);

  const handleGo = () => {
    simRef.current?.startSimulation();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#dddddd]">
      <Sidebar onGo={handleGo} expOptions={expOptions} />
      <div className="my-40 flex-1 p-4">
        <Simulation simRef={simRef} expOptions={expOptions} />
      </div>
    </div>
  );
};

export default App;
