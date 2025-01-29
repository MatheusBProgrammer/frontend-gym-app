// src/components/AuthInput.jsx
import React from "react";

function AuthInput({ label, type, value, onChange, required }) {
  return (
    <div style={styles.inputContainer}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#6A5638", // cor marrom claro/dourado para texto
    fontSize: "0.9rem",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
};

export default AuthInput;
