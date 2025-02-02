import React from "react";
import "../styles/Button.css";

const Button = ({ children, variant = "primary", icon, loading, ...props }) => {
  const getIcon = () => {
    const icons = {
      edit: (
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      ),
      delete: (
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      ),
    };
    return icon ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
    ) : null;
  };

  return (
    <button
      className={`button ${variant} ${loading ? "loading" : ""}`}
      disabled={loading}
      {...props}
    >
      {getIcon()}
      {children}
    </button>
  );
};

export default Button;
