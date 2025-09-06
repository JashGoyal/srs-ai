import React, { useEffect } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-[100] 
        transition-transform duration-500 ease-out
        animate-slideDown
        ${colors[type] || colors.info}
      `}
    >
      {message}
    </div>
  );
};

export default Toast;
