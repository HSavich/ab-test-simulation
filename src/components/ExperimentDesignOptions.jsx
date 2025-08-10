import React, { useState } from "react";

const ExperimentDesignOptions = ({ expOptions }) => {
  const [open, setOpen] = useState(true);

  const handleTreatPropChange = (e) => {
    const treatProp = Math.min(
      Math.max(0, parseFloat(e.target.value, 10) || 0) / 100,
      1,
    );
    if (expOptions?.current) {
      expOptions.current.treatProp = treatProp;
    }
  };
  const handleExpLenChange = (e) => {
    const expLenHours = Math.max(
      Math.round(parseFloat(e.target.value, 10) || 0) * 24,
      1,
    );
    if (expOptions?.current) {
      expOptions.current.expLen = expLenHours;
    }
  };

  return (
    <>
      <div
        className="h-10 cursor-pointer border-2 border-slate-500 bg-[#998877]"
        onClick={() => setOpen(!open)}
      >
        ExperimentDesign
      </div>
      {open && (
        <div className="space-y-2 bg-[#c1bbbb] p-4 text-sm">
          <label className="block font-semibold">
            Experiment Length: <br />
            <input
              type="number"
              min={1}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.expLen / 24 ?? 0}
              onChange={handleExpLenChange}
            />{" "}
            Days
          </label>
          <label className="block font-semibold">
            Treatment Proportion:
            <br />
            <input
              type="number"
              min={0}
              max={100}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.treatProp * 100 ?? 0}
              onChange={handleTreatPropChange}
            />{" "}
            %
          </label>
        </div>
      )}
    </>
  );
};

export default ExperimentDesignOptions;
