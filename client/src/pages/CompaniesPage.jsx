import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CompaniesPage.css"; // Import your CSS or use styled-components

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ company_name: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  async function fetchCompanies() {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const res = await axios.get("http://localhost:5000/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data.companies)) {
        setCompanies(res.data.companies);
        if (res.data.companies.length === 0) {
          setSuccessMessage("No companies found. Add a new company.");
        }
      } else {
        setError("Invalid server response.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load companies.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(company) {
    setForm({ ...company });
    setEditing(company.company_id);
    setSuccessMessage("");
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ company_name: "" });
    setSuccessMessage("");
    setError(null);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (!form.company_name.trim()) {
      alert("Company name cannot be empty");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/companies/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Company updated successfully.");
      } else {
        await axios.post("http://localhost:5000/companies", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage("Company added successfully.");
      }
      cancelEdit();
      fetchCompanies();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editing ? "Failed to update company." : "Failed to add company.")
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await axios.delete(`http://localhost:5000/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Company deleted successfully.");
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete company.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="companies-page">
      <h1>Companies Management (Admin)</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="company-form">
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          disabled={loading}
          className="input-field"
        />
        <button onClick={handleSave} disabled={loading} className="btn btn-primary">
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button onClick={cancelEdit} disabled={loading} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>

      {loading && <div className="loading">Loading companies...</div>}

      <ul className="company-list">
        {companies.map((company) => (
          <li key={company.company_id} className="company-item">
            {editing === company.company_id ? (
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              />
            ) : (
              <span>{company.company_name}</span>
            )}
            {editing === company.company_id ? null : (
              <div className="action-buttons">
                <button onClick={() => startEdit(company)} disabled={loading} className="btn btn-edit">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company.company_id)}
                  disabled={loading}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompaniesPage;
