import React from "react";
import { useNavigate } from "react-router-dom";
import MessageList from "./MessageList";

export default function Chat() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <button
                onClick={goHome}
                aria-label="Go to Home"
                className="absolute top-4 right-8 z-50 text-white hover:text-gray-400 transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                </svg>
            </button>

            <MessageList />
        </div>
    );
}
