import { useState, useEffect } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ScrapePage from "./pages/ScrapePage";
import Header from "./components/Header";
import JobsPage from "./pages/Jobs";
import JobPage from "./pages/JobPage";
import CompaniesPage from "./pages/CompaniesPage";
import Profile from "./pages/Profile";

function App() {
  const [count, setCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/job/:jobId" element={<JobPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/scraping" element={<ScrapePage />} /> 
        <Route path="/unauthorized" element={<div>You are not authorized to view this page.</div>} />
     </Routes>
    </>
  );
}

export default App;
