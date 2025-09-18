import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 text-center">
      <svg
        className="w-64 h-64 mb-6"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="
            M 40 0
            H 160
            A 40 40 0 0 1 200 40
            V 160
            A 40 40 0 0 1 160 200
            H 40
            A 40 40 0 0 1 0 160
            V 40
            A 40 40 0 0 1 40 0
            Z
          "
          fill="none"
          stroke="#39FF14"
          strokeWidth="6"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          fontSize="48"
          fontWeight="bold"
          fill="white"
        >
          404
        </text>
      </svg>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Page Not Found
      </h1>

      <p className="text-lg md:text-xl text-[#39FF14]/80 mb-6">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-[#39FF14] text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300"
      >
        Go Home
      </a>
    </div>
  );
}
