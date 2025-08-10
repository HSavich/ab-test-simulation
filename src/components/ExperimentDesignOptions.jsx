import React, { useState } from "react";

const ExperimentDesignOptions = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div
        className="h-10 cursor-pointer border-2 border-slate-500 bg-[#998877]"
        onClick={() => setOpen(!open)}
      >
        ExperimentDesign
      </div>
      {open && <div className="h-48 cursor-pointer bg-[#c1bbbb]">OPTIONS</div>}
    </>
  );
};

export default ExperimentDesignOptions;
