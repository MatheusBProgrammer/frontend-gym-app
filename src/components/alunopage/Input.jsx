import React from "react";
import "../styles/Input.css";

function Input({ label, value, onChange, type = "text", ...rest }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          className="input-field"
          {...rest}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="input-field"
          {...rest}
        />
      )}
    </div>
  );
}

export default Input;
