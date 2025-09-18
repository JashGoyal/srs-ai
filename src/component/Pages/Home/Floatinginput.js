import { useState, useEffect } from "react";
import Toast from "../../Toast";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/features/Chatslice";
import { useNavigate } from "react-router-dom";

export default function Floatinginput() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowUI(false);
            } else {
                setShowUI(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputValue.trim() === "") {
            setToast({ message: "⚠️ Input field is empty", type: "error" });
            return;
        }

        console.log("Dispatching:", inputValue);

        dispatch(addMessage({ sender: "user", text: inputValue, replied: false }));

        setToast({ message: "✅ Redirecting to chat...", type: "success" });

        const message = inputValue;
        setInputValue("");

        setTimeout(() => {
            navigate("/chat", { state: { message } });
        }, 1000);
    };

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={2500}
                    onClose={() => setToast(null)}
                />
            )}

            <div
                className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center transition-transform duration-500 ${showUI ? "translate-y-0" : "translate-y-32"
                    }`}
            >
                <form onSubmit={handleSubmit} className="relative">
                    <div
                        className={`relative bg-gray-800/90 backdrop-blur-md text-neon rounded-3xl border border-gray-600 shadow-lg transition-all duration-700 ease-in-out transform flex items-center px-4 py-2 cursor-text 
                            ${!(isFocused || inputValue) ? "hover:scale-110" : ""}
                             ${isFocused || inputValue ? "w-[30rem]" : "w-48"}
                              `}
                    >
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onInput={handleInput}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Ask SRSense"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="bg-transparent w-full resize-none overflow-hidden transition-all duration-700 ease-in-out pl-4 pr-10 py-2 text-white placeholder-neon outline-none rounded-3xl"
                        />

                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-800"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.5 18.75 7.5-7.5 7.5 7.5"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m4.5 12.75 7.5-7.5 7.5 7.5"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
