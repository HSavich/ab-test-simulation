import React from "react";
import TrafficOptions from "./TrafficOptions";
import EffectOptions from "./EffectOptions";
import AnalysisOptions from "./AnalysisOptions";

const Sidebar = () => {
  return (
    <div className="relative h-screen w-70 bg-yellow-800 text-center text-4xl text-white">
      <div className="h-full bg-[#44332a] pt-8 text-lg text-black">
        <TrafficOptions />
        <EffectOptions />
        <AnalysisOptions />
      </div>
      <div className="absolute bottom-0 h-24 w-full bg-gray-600">
        <button className="mt-4 h-16 w-56 cursor-pointer rounded-3xl border-4 border-gray-700 bg-[#d8eed8] text-black active:translate-y-0.5 active:bg-[#bbbbbb]">
          Go
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
