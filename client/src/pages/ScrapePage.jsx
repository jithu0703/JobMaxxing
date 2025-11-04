import AdminRoute from "../components/AdminRoute";
import { useState } from "react";
import axios from "axios";
import "../styles/ScrapePage.css";

const SCRAPE_SOURCES = [
  { key: "python", label: "Python Jobs" },
  { key: "webdev", label: "Web-Dev Jobs" },
  { key: "internships", label: "InternShips" },
];

function ScrapeOptionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeSource, setActiveSource] = useState(null);

  async function handleScrape(source) {
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveSource(source);

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(`http://localhost:5000/scrape/${source}`, null, {
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

        <div className="btn-group">
          {SCRAPE_SOURCES.map((src) => (
            <>
            <button
              key={src.key}
              className="btn btn-primary btn-lg"
              onClick={() => handleScrape(src.key)}
              disabled={loading && activeSource === src.key}
            >
              {loading && activeSource === src.key
                ? `Scraping ${src.label} ...`
                : `Scrape ${src.label}`}
            </button>
            <br></br>
            <br></br>
            <br></br>
            </>
          ))}
        </div>

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
