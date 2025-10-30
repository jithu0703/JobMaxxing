import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ScrapePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Starting scraping...");
  const navigate = useNavigate();

  useEffect(() => {
    const scrapeData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/scrape/internshala"); // your Flask endpoint
        if (!response.ok) {
          throw new Error("Failed to scrape");
        }
        const data = await response.json();
        console.log("Scraping result:", data);
        setMessage(`Scraping completed! Fetched ${data.count} items.`);
        
        // Wait 1 second and redirect to home
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error(error);
        setMessage("Error during scraping");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    scrapeData();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading && <h2>{message}</h2>}
      {!loading && <h3>{message}</h3>}
    </div>
  );
};

export default ScrapePage;
