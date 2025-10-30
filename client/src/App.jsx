import { useState, useEffect } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobList from "./components/JobList";
import Home from "./pages/Home";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import ScrapePage from "./pages/ScrapePage";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scrape/internshala" element={<ScrapePage />} />
      </Routes>
    </>
  );
}

export default App;
