import React, { useState } from "react";

const AnalysisOptions = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div
        className="h-10 cursor-pointer border-2 border-slate-500 bg-[#998877] text-center"
        onClick={() => setOpen(!open)}
      >
        Analysis
      </div>
      {open && <div className="h-48 cursor-pointer bg-[#c1bbbb]">OPTIONS</div>}
    </>
  );
};

export default AnalysisOptions;
