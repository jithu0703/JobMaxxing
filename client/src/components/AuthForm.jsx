import React, { useState } from "react";
import "../styles/AuthForm.css";

const AuthForm = ({ fields, onSubmit, buttonText, title, subtitle, footerContent }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: error.message || "Something went wrong" });
    }
    setLoading(false);
  };

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      onChange: handleChange,
      required: field.required !== false,
      disabled: loading,
      className: `form-input ${errors[field.name] ? "error" : ""}`,
    };

    if (field.type === "select" && field.options) {
      return (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="form-label">
            {field.label || field.placeholder}
            {field.required !== false && <span className="required">*</span>}
          </label>
          <select
            id={field.name}
            {...commonProps}
            value={formData[field.name] || ""}
          >
            <option value="" disabled>
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options.map((option) => (
              <option
                key={typeof option === "string" ? option : option.value}
                value={typeof option === "string" ? option : option.value}
              >
                {typeof option === "string" ? option : option.label}
              </option>
            ))}
          </select>
          {errors[field.name] && (
            <span className="error-message">{errors[field.name]}</span>
          )}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name} className="form-label">
            {field.label || field.placeholder}
            {field.required !== false && <span className="required">*</span>}
          </label>
          <textarea
            id={field.name}
            {...commonProps}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            value={formData[field.name] || ""}
          />
          {errors[field.name] && (
            <span className="error-message">{errors[field.name]}</span>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="form-group">
        <label htmlFor={field.name} className="form-label">
          {field.label || field.placeholder}
          {field.required !== false && <span className="required">*</span>}
        </label>
        <input
          id={field.name}
          type={field.type}
          {...commonProps}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
        />
        {errors[field.name] && (
          <span className="error-message">{errors[field.name]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        {(title || subtitle) && (
          <div className="auth-form-header">
            {title && <h1 className="auth-form-title">{title}</h1>}
            {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map(renderField)}

          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                Please wait...
              </>
            ) : (
              buttonText
            )}
          </button>
        </form>

        {footerContent && (
          <div className="auth-form-footer">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
