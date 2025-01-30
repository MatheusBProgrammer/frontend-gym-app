import React from "react";
import "../styles/Input.css";

const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      {type === "textarea" ? (
        <textarea {...props} />
      ) : (
        <input type={type} {...props} />
      )}
    </div>
  );
};

export default Input;
