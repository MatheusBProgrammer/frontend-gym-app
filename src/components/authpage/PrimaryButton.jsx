// src/components/authpage/PrimaryButton.jsx
import React from "react";

function PrimaryButton({ children, onClick, type = "button", style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: "#3498db",
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "1rem",
        boxShadow: "0 4px 8px rgba(52, 152, 219, 0.3)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(52, 152, 219, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(52, 152, 219, 0.3)";
      }}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
