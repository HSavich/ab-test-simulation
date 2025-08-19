import React, { useState } from "react";

const EffectOptions = ({ expOptions }) => {
  const [open, setOpen] = useState(true);

  const handleBaseCtrChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value, 10) || 0);
    if (expOptions?.current) {
      expOptions.current.baseCtr = value / 100;
    }
  };
  const handleLiftChange = (e) => {
    const value = parseFloat(e.target.value, 10) || 0;
    if (expOptions?.current) {
      expOptions.current.lift = value / 100;
    }
  };
  const handleNoveltyChange = (e) => {
    const value = parseFloat(e.target.value, 10) || 0;
    if (expOptions?.current) {
      expOptions.current.novelty = value / 100;
    }
  };
  const handleNoveltyLenChange = (e) => {
    const value = parseFloat(e.target.value, 10) || 0;
    if (expOptions?.current) {
      expOptions.current.novelty = value;
    }
  };

  return (
    <>
      <div
        className="flex h-10 cursor-pointer items-center justify-center border-2 border-slate-500 bg-[#998877] text-center"
        onClick={() => setOpen(!open)}
      >
        Effect
      </div>
      {open && (
        <div className="space-y-2 bg-[#c1bbbb] p-4 text-sm">
          <label className="block font-semibold">
            Base Clickthrough: <br />
            <input
              type="number"
              min={0}
              max={100}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.baseCtr * 100 ?? 0}
              onChange={handleBaseCtrChange}
            />{" "}
            %
          </label>
          <label className="block font-semibold">
            Lift:
            <br />
            <input
              type="number"
              min={-100}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.lift * 100 ?? 0}
              onChange={handleLiftChange}
            />{" "}
            %
          </label>
          <label className="block font-semibold">
            Novelty/Primacy Effect:
            <br />
            <input
              type="number"
              min={-100}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.novelty * 100 ?? 0}
              onChange={handleNoveltyChange}
            />{" "}
            %
          </label>
          <label className="block font-semibold">
            Novelty/Primacy Effect Duration:
            <br />
            <input
              type="number"
              min={-100}
              className="mb-1 ml-2 w-28 rounded border border-gray-400 px-1 text-black"
              defaultValue={expOptions.current?.noveltyLen ?? 0}
              onChange={handleNoveltyLenChange}
            />{" "}
            hours
          </label>
        </div>
      )}
    </>
  );
};

export default EffectOptions;
