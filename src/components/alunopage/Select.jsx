import React from "react";
import "../styles/Select.css";

function Select({ label, value, onChange, options, ...rest }) {
  return (
    <div className="select-group">
      {label && <label className="select-label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="select-field"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
