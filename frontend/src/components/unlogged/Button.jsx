import React from "react";
import { Link } from "react-router-dom";

function Button({ children, variant = "solid", to }) {
  const baseClasses = "px-5 py-2 my-auto text-white border border-solid transition-transform duration-300 ease-in-out hover:scale-110";
  const variants = {
    solid: "bg-black border-white hover:bg-gray-700",
    outline: "bg-transparent border-white text-white hover:bg-white hover:text-black",
    primary: "bg-blue-500 border-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 border-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 border-red-500 hover:bg-red-600",
  };

  // If the `to` prop is provided, render a Link; otherwise, render a button
  return to ? (
    <Link to={to} className={`${baseClasses} ${variants[variant] || variants.solid}`}>
      {children}
    </Link>
  ) : (
    <button className={`${baseClasses} ${variants[variant] || variants.solid}`}>
      {children}
    </button>
  );
}

export default Button;

