import AdminRoute from "../components/AdminRoute";
import { useState } from "react";
import axios from "axios";
import "../styles/ScrapePage.css";

function ScrapeOptionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleScrapeInternshala() {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post("http://localhost:5000/scrape/internshala", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to scrape data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminRoute>
      <div className="scrape-options-container container">
        <h1 className="page-title">Scraping Options (Admin Only)</h1>
        <p>Select a source below to start scraping jobs:</p>

        <button
          className="btn btn-primary btn-lg"
          onClick={handleScrapeInternshala}
          disabled={loading}
        >
          {loading ? "Scraping Internshala..." : "Scrape Internshala"}
        </button>

        {result && (
          <div style={{ marginTop: 20, color: "green" }}>
            Scraped {result.scraped_count} jobs successfully.
          </div>
        )}

        {error && (
          <div style={{ marginTop: 20, color: "red" }}>
            Error: {error}
          </div>
        )}
      </div>
    </AdminRoute>
  );
}

export default ScrapeOptionsPage;
