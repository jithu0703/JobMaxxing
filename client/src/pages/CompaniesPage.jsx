import React, { useState, useEffect } from "react";
import axios from "axios";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // id of company editing or null
  const [form, setForm] = useState({ company_name: "" });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && Array.isArray(res.data.companies)) {
        setCompanies(res.data.companies);
        setError(null);
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
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ company_name: "" });
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
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/companies/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/companies", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      cancelEdit();
      fetchCompanies();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          (editing ? "Failed to update company." : "Failed to add company.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this company?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete company.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="companies-page">
        <div>{JSON.stringify(companies)}</div>
      <h1>Companies Management (Admin)</h1>

      <div className="company-form">
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          disabled={loading}
        />
        <button onClick={handleSave} disabled={loading}>
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button onClick={cancelEdit} disabled={loading}>
            Cancel
          </button>
        )}
      </div>

      <ul className="company-list">
        {companies.map((company) => (
          <li key={company.company_id} className="company-item">
            {editing === company.company_id ? (
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                disabled={loading}
              />
            ) : (
              <span>{company.company_name}</span>
            )}
            {editing === company.company_id ? null : (
              <>
                <button onClick={() => startEdit(company)} disabled={loading}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company.company_id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompaniesPage;
