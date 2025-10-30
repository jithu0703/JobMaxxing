import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("authToken");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message || "Loading..."}</h2>
      <button
        onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          borderRadius: "8px",
          border: "none",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
