import React from "react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div
      className="bg-gray-800/90 backdrop-blur-md text-neon rounded-3xl border border-gray-600 shadow-lg flex items-center px-4 py-2 cursor-text w-[500px]"
      style={{ minHeight: "40px" }}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent w-full outline-none text-white placeholder-neon rounded-3xl px-2 py-1"
        style={{ fontSize: "1rem" }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 text-gray-400 ml-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 10a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
        />
      </svg>
    </div>
  );
}
