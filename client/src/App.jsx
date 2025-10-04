import { useState, useEffect } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobList from "./components/JobList";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobList />} />
      </Routes>
    </>
  );
}

export default App;
