import React, { useState } from "react";

const TrafficOptions = ({ expOptions }) => {
  const [open, setOpen] = useState(true);

  const handleDauChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    if (expOptions?.current) {
      expOptions.current.dau = value; // write to the ref-backed object
    }
  };
  const handleDauStdChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    if (expOptions?.current) {
      expOptions.current.dauStd = value; // write to the ref-backed object
    }
  };

  return (
    <>
      <div
        className="flex h-10 cursor-pointer items-center justify-center border-2 border-slate-500 bg-[#998877] text-center"
        onClick={() => setOpen(!open)}
      >
        Traffic
      </div>
      {open && (
        <div className="space-y-2 bg-[#c1bbbb] p-4 text-sm">
          <label className="block font-semibold">
            Daily Traffic:
            <input
              type="number"
              min={0}
              className="ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.dau ?? 0}
              onChange={handleDauChange}
            />
          </label>
          <label className="block font-semibold">
            Daily Traffic Standard Deviation:
            <input
              type="number"
              min={0}
              className="ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.dauStd ?? 0}
              onChange={handleDauStdChange}
            />
          </label>
        </div>
      )}
    </>
  );
};

export default TrafficOptions;
