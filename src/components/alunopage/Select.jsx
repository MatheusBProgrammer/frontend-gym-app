import React from "react";
import "../styles/Select.css";

const Select = ({ label, options, ...props }) => {
  return (
    <div className="select-group">
      {label && <label>{label}</label>}
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
