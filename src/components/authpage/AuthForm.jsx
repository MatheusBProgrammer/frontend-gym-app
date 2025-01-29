// src/components/AuthForm.jsx
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
    backgroundColor: "#FAF8F2", // tom claro que puxa para o bege/dourado
    margin: "40px auto",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #EDE8DA",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#8C6C2C", // tom de dourado mais escuro
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  error: {
    color: "#B53333",
    textAlign: "center",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default AuthForm;
