import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-full">
        <Sidebar />
      </div>
    </>
  );
}

export default App;
