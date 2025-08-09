import React, { useState } from "react";

const EffectOptions = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div
        className="h-10 cursor-pointer border-2 border-slate-500 bg-[#998877]"
        onClick={() => setOpen(!open)}
      >
        Effect
      </div>
      {open && <div className="h-48 cursor-pointer bg-[#c1bbbb]">OPTIONS</div>}
    </>
  );
};

export default EffectOptions;
