import React from "react";
import "../styles/Button.css";
function Button({
  children,
  onClick,
  variant = "default",
  className = "",
  loading,
  icon,
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <span className="loader" />
      ) : icon ? (
        <i className={`icon-${icon}`} />
      ) : null}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
}

export default Button;
