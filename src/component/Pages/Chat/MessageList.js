import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, updateMessage } from "../../../redux/features/Chatslice";
import { generateSrs } from "../../../redux/features/srsSlice";
import { saveSrs, resetStatus } from "../../../redux/features/srsSaveSlice";
import Toast from "../../Toast";
import ReactMarkdown from "react-markdown";
import { fetchSrsHistory } from "../../../redux/features/GetHistory";

function formatProjectToText(project) {
    if (!project || !project.sections) return "";

    let result = project.title ? "In " + project.format + "\n\n" + project.title + "\n\n" : "";

    project.sections.forEach((section) => {
        if (section.heading) {
            result += `**${section.heading.toUpperCase()}**\n`;
        }
        section.content.forEach((content) => {
            if (content.subheading) {
                result += "\n" + content.subheading + "\n";
            }
            if (content.text) {
                result += content.text + "\n";
            }
        });
        result += "\n";
    });

    return result.trim();
}

export default function MessageList() {
    const messages = useSelector((state) => state.chat.messages);
    const dispatch = useDispatch();
    const [selectedFormat, setSelectedFormat] = useState("IEEE830");
    const srsSaveState = useSelector((state) => state.srsSave);
    const [inputValue, setInputValue] = useState("");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasSentMessage, setHasSentMessage] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const isTypingRef = useRef(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const noMessages = messages.length === 0;
    const processedUserMessageIds = useRef(new Set());
    const [saveButtonsMap, setSaveButtonsMap] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const formatOptions = [
        {
            value: "IEEE830",
            short: "IEEE 830",
            full: "IEEE 830 Software Requirements Specification ⭐ Recommended",
        },
        {
            value: "IEEE29148",
            short: "IEEE 29148",
            full: "IEEE 29148 System and Software Requirements Specification",
        },
        {
            value: "Volere",
            short: "Volere",
            full: "Volere Requirements Specification",
        },
        {
            value: "Agile",
            short: "Agile",
            full: "Agile User Story Based Requirements",
        },
        {
            value: "ISO",
            short: "ISO",
            full: "ISO/IEC/IEEE Standard Requirements Specification",
        },
        {
            value: "FURPS",
            short: "FURPS",
            full: "FURPS Model Requirements Specification",
        },
        {
            value: "CMMI",
            short: "CMMI",
            full: "CMMI Requirements Management",
        },
        {
            value: "BRD",
            short: "BRD",
            full: "Business Requirements Document (BRD)",
        },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const typeMessage = (fullText, messageId) => {
        return new Promise((resolve) => {
            let index = 0;
            const totalDuration = 30;
            const minDelay = 2;
            const delay = Math.max(totalDuration / fullText.length, minDelay);

            dispatch(updateMessage({ id: messageId, loading: false }));

            const interval = setInterval(() => {
                if (index < fullText.length) {
                    const partialText = fullText.slice(0, index + 1);
                    dispatch(updateMessage({ id: messageId, text: partialText }));
                    index++;
                } else {
                    clearInterval(interval);
                    dispatch(updateMessage({ id: messageId, loading: false }));
                    resolve();
                }
            }, delay);
        });
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            const container = messagesEndRef.current.parentNode;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        const handleUnrepliedMessages = async () => {
            const unRepliedMessages = messages.filter(
                (msg) =>
                    msg.sender === "user" &&
                    !msg.replied &&
                    !processedUserMessageIds.current.has(msg.id)
            );

            if (unRepliedMessages.length === 0) {
                if (isTypingRef.current) {
                    isTypingRef.current = false;
                    setIsTyping(false);
                }
                setLoading(false);
                return;
            }

            setLoading(true);
            isTypingRef.current = true;
            setIsTyping(true);

            for (const msg of unRepliedMessages) {
                processedUserMessageIds.current.add(msg.id);

                const tempAiId = `ai-loading-${Date.now()}`;
                dispatch(
                    addMessage({
                        sender: "ai",
                        text: "",
                        replied: true,
                        id: tempAiId,
                        loading: true,
                    })
                );

                try {
                    const response = await dispatch(generateSrs({ prompt: msg.text, format: msg.format || "IEEE830" })).unwrap();
                    const isError = response?.status === "error";

                    let aiText = "";
                    let srsJson = null;

                    if (isError) {
                        aiText = response?.srsData?.error || "Unknown error occurred";
                    } else {
                        try {
                            srsJson = JSON.parse(response?.srsData?.aiResponse);
                            const formattedText = formatProjectToText(srsJson);

                            aiText =
                                `Here is the SRS for ${msg.text}\n\n` +
                                `_____________________________________________________________\n\n` +
                                formattedText +
                                `\n\n_____________________________________________________________` +
                                `\n\nIf you want to save this SRS, click the save icon.`;
                        } catch {
                            aiText = response?.srsData?.aiResponse || "⚠️ No AI response";
                        }
                    }

                    const aiMessageId = `ai-${Date.now()}`;

                    dispatch(updateMessage({ id: tempAiId, text: "", loading: false }));

                    dispatch(
                        addMessage({
                            sender: "ai",
                            text: "",
                            replied: true,
                            id: aiMessageId,
                            loading: true,
                        })
                    );

                    await new Promise((res) => setTimeout(res, 1000));
                    await typeMessage(aiText, aiMessageId);

                    dispatch(updateMessage({ id: msg.id, replied: true }));

                    if (srsJson) {
                        setSaveButtonsMap((prev) => ({
                            ...prev,
                            [aiMessageId]: { topic: msg.text, srsJson },
                        }));
                    }
                } catch (error) {
                    setToast({
                        message: error?.message || "Failed to get AI response",
                        type: "error",
                    });
                }
            }

            setLoading(false);
            isTypingRef.current = false;
            setIsTyping(false);
        };

        handleUnrepliedMessages();
    }, [messages, dispatch]);

    const handleSave = async (aiMessageId) => {
        const data = saveButtonsMap[aiMessageId];
        if (!data) {
            setToast({ message: "No SRS data found to save.", type: "error" });
            return;
        }

        try {
            await dispatch(saveSrs(data.srsJson)).unwrap();
            await dispatch(fetchSrsHistory());

            setToast({ message: "✅ SRS saved successfully!", type: "success" });
            dispatch(resetStatus());
        } catch (error) {
            setToast({
                message: error || "Failed to save SRS.",
                type: "error",
            });
        }
    };

    const sendMessage = (text) => {
        if (!text.trim()) {
            setToast({ message: "❌ Cannot send empty message", type: "warning" });
            return;
        }
        if (isTypingRef.current) {
            setToast({ message: "⏳ Wait for AI response", type: "info" });
            return;
        }

        dispatch(addMessage({ sender: "user", text, replied: false, format: selectedFormat }));
        setInputValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setHasSentMessage(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleInput = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";

        const maxHeight = 200;
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight <= maxHeight) {
            textarea.style.overflowY = "hidden";
            textarea.style.height = scrollHeight + "px";
        } else {
            textarea.style.overflowY = "auto";
            textarea.style.height = maxHeight + "px";
        }
    };

    const inputForm = (
        <form
            onSubmit={handleSubmit}
            className="relative flex justify-center w-full max-w-2xl"
        >
            <div className="relative bg-gray-800/90 backdrop-blur-md text-neon rounded-3xl border border-gray-600 shadow-lg flex items-center px-4 py-2 w-full">
                <div className="relative mr-3" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-sm px-3 py-2 rounded-md shadow-sm transition duration-200 w-full"
                    >
                        <span className="truncate text-left">
                            {
                                formatOptions.find((f) => f.value === selectedFormat)[
                                isDropdownOpen ? "full" : "short"
                                ]
                            }
                        </span>
                        <svg
                            className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <ul className="absolute bottom-full mb-1 w-[300px] left-0 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                            {formatOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => {
                                        setSelectedFormat(option.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-700 transition duration-150 ${option.value === selectedFormat ? "bg-gray-700 font-semibold" : ""
                                        }`}
                                >
                                    {option.full}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onInput={handleInput}
                    placeholder="Type your Topic..."
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    className="bg-transparent w-full resize-none max-h-[200px] overflow-y-auto pl-4 pr-10 py-2 text-white placeholder-neon outline-none rounded-3xl scrollbar-dark"
                    disabled={loading}
                />

                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300"
                    aria-label="Send"
                    disabled={loading}
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
    );

    return (
        <div
            className={`flex flex-col h-screen bg-black text-white transition-all duration-500
      ${noMessages ? "justify-center" : "pt-4"}`}
        >
            {noMessages && (
                <div className="flex flex-col items-center justify-center flex-grow px-4">
                    <h1
                        className={`text-4xl font-bold text-white mb-6 text-center
                                  transition-opacity duration-[2000ms] ease-in-out
                                  ${hasSentMessage ? "opacity-0" : "opacity-100"}`}
                    >
                        Generate your SRS
                    </h1>

                    <div
                        className={`w-full max-w-2xl mx-auto px-4 flex justify-center
              transition-transform duration-[5000ms] ease-in-out
              ${hasSentMessage
                                ? "fixed bottom-6 left-1/2 transform -translate-x-1/2 translate-y-0"
                                : "relative translate-x-0 translate-y-0"}
  `}
                    >
                        {inputForm}
                    </div>
                </div>
            )}

            {!noMessages && (
                <>
                    <div
                        className="overflow-y-auto scrollbar-dark p-6 flex flex-col gap-3 w-full mx-auto"
                        style={{ paddingBottom: "200px" }}
                    >
                        <div className="w-full max-w-2xl mx-auto px-4 flex flex-col gap-2">
                            {messages.map((msg, idx) => {
                                const showSaveButton =
                                    msg.sender === "ai" &&
                                    !msg.loading &&
                                    saveButtonsMap[msg.id] !== undefined;

                                return (
                                    <div
                                        key={msg.id || idx}
                                        className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-2xl break-words whitespace-pre-wrap relative
                                                    ${msg.sender === "user"
                                                    ? "bg-white text-black text-right max-w-[60%] ml-auto"
                                                    : "bg-black text-white text-left w-full"
                                                }`}
                                        >
                                            {msg.loading ? (
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: "0ms" }}
                                                    />
                                                    <span
                                                        className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: "100ms" }}
                                                    />
                                                    <span
                                                        className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                                                        style={{ animationDelay: "200ms" }}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <ReactMarkdown
                                                        components={{
                                                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                    {showSaveButton && (
                                                        <button
                                                            onClick={() => handleSave(msg.id)}
                                                            title="Save this SRS"
                                                            disabled={srsSaveState.loading}
                                                            className="absolute bottom-2 right-2 p-1 rounded hover:bg-gray-700 transition"
                                                            aria-label="Save SRS"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-50">
                        <div className="w-full max-w-2xl">
                            {inputForm}
                        </div>
                    </div>

                </>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
