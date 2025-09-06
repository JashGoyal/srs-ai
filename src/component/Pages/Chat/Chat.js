import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, updateMessage } from "../../../redux/features/Chatslice";
import Toast from "../../Toast";
import { useLocation } from "react-router-dom";

export default function Chat() {
    const messages = useSelector((state) => state.chat.messages);
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false); // NEW
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const location = useLocation();
    const messageFromPrevious = location.state?.message;

    useEffect(() => {
        if (messageFromPrevious) {
            dispatch(addMessage({ sender: "user", text: messageFromPrevious, replied: false }));
        }
    }, [messageFromPrevious, dispatch]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const container = messagesEndRef.current.parentNode;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const unRepliedMessages = messages.filter(
            (msg) => msg.sender === "user" && !msg.replied
        );

        if (unRepliedMessages.length === 0) {
            setLoading(false); 
            return;
        }

        unRepliedMessages.forEach((msg) => {
            setLoading(true); 
            setTimeout(() => {
                dispatch(
                    addMessage({
                        sender: "ai",
                        text: ` ${msg.text}`,
                    })
                );
                dispatch(updateMessage({ ...msg, replied: true }));
                setLoading(false);
            }, 1000);
        });
    }, [messages, dispatch]);

    const sendMessage = (text) => {
        if (!text.trim()) {
            setToast({ message: "❌ Cannot send empty message", type: "warning" });
            return;
        }
        if (loading) {
            setToast({ message: "⏳ Wait for AI response", type: "info" });
            return;
        }

        dispatch(addMessage({ sender: "user", text, replied: false }));
        setInputValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
        scrollToBottom();
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white pt-24 items-center">

            <div
                className="flex-1 overflow-y-auto scrollbar-dark p-6 flex flex-col gap-3 w-full max-w-2xl"
                style={{ paddingBottom: '200px' }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[70%] px-4 py-2 rounded-2xl break-words
                            ${msg.sender === "user"
                                ? "self-end [&::first-letter]:uppercase bg-white text-black text-right"
                                : "self-start [&::first-letter]:uppercase text-white text-left"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={2000}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="fixed bottom-6 w-full flex justify-center z-50">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex justify-center w-full max-w-2xl"
                >
                    <div className="relative bg-gray-800/90 backdrop-blur-md text-neon rounded-3xl border border-gray-600 shadow-lg flex items-center px-4 py-2 w-full">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onInput={handleInput}
                            placeholder="Type your message..."
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="bg-transparent w-full resize-none overflow-y-hidden pl-4 pr-10 py-2 text-white placeholder-neon outline-none rounded-3xl"
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
        </div>
    );
}
