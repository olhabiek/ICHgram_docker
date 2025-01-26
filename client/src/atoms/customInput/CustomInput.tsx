import React, { CSSProperties } from "react";
import s from "./customInput.module.css";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  errorMessage?: string;
  type?: "text" | "password" | "email";
  className?: string;
  style?: CSSProperties;
  showError?: boolean;
}

const CustomInput: React.FC<InputProps> = ({
  placeholder = "",
  value = "",
  onChange,
  icon,
  errorMessage,
  type = "text",
  className = "",
  style = {},
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  const inputClass = `${s.inputContainer} ${
    errorMessage ? s.error : ""
  } ${className}`;

  return (
    <div className={inputClass}>
      {icon && <span className={s.icon}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={s.input}
        style={style}
      />
      {errorMessage && <div className={s.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export default CustomInput;
