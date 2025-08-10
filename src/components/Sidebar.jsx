import React from "react";
import TrafficOptions from "./TrafficOptions";
import EffectOptions from "./EffectOptions";
import ExperimentDesignOptions from "./ExperimentDesignOptions";
import AnalysisOptions from "./AnalysisOptions";

const Sidebar = ({ onGo, expOptions, setExpOptions }) => {
  return (
    <div className="relative flex h-screen w-70 flex-col bg-yellow-800 text-center text-4xl text-white">
      <div className="flex-1 overflow-y-auto bg-[#44332a] pt-8 text-lg text-black">
        <TrafficOptions expOptions={expOptions} />
        <EffectOptions expOptions={expOptions} />
        <ExperimentDesignOptions expOptions={expOptions} />
        <AnalysisOptions />
      </div>
      <div className="flex h-24 w-full items-center justify-center bg-gray-600">
        <button
          className="h-16 w-56 cursor-pointer rounded-3xl border-4 border-gray-700 bg-[#d8eed8] text-black active:translate-y-0.5 active:bg-[#bbbbbb]"
          onClick={onGo}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
