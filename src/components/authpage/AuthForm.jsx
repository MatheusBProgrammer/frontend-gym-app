// src/components/authpage/AuthForm.jsx
import React from "react";

function AuthForm({ title, children, onSubmit, error }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={onSubmit} style={styles.form}>
        {children}
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "400px",
    margin: "40px auto",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "bold",
    fontSize: "1.4rem",
    letterSpacing: "1px",
  },
  error: {
    color: "#b53333",
    textAlign: "center",
    marginBottom: "16px",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default AuthForm;
