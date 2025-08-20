import React, { useState } from "react";

const AnalysisOptions = ({ anaOptions }) => {
  const [open, setOpen] = useState(true);

  const handleBurnInChange = (e) => {
    const burnInHours = Math.max(
      Math.round(parseFloat(e.target.value, 10) || 0) * 24,
      1,
    );
    if (anaOptions?.current) {
      anaOptions.current.burnIn = burnInHours;
    }
  };

  return (
    <>
      <div
        className="flex h-10 cursor-pointer items-center justify-center border-2 border-slate-500 bg-[#998877] text-center"
        onClick={() => setOpen(!open)}
      >
        Analysis
      </div>
      {open && (
        <div className="h-48 cursor-pointer bg-[#c1bbbb]">
          <label className="block font-semibold">
            Burn-In: <br />
            <input
              type="number"
              min={1}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={anaOptions.current?.burnIn / 24 ?? 0}
              onChange={handleBurnInChange}
            />{" "}
            Days
          </label>
        </div>
      )}
    </>
  );
};

export default AnalysisOptions;
