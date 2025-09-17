import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, updateMessage } from "../../../redux/features/Chatslice";
import { generateSrs } from "../../../redux/features/srsSlice";
import Toast from "../../Toast";

export default function MessageList() {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [project, setProject] = useState(null); // Holds parsed JSON SRS

  const isTypingRef = useRef(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const noMessages = messages.length === 0;
  const processedUserMessageIds = useRef(new Set());

  const typeMessage = (fullText, messageId) => {
    return new Promise((resolve) => {
      let index = 0;
      const totalDuration = 2000;
      const minDelay = 100;
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

        try {
          const response = await dispatch(generateSrs(msg.text)).unwrap();

          const isError = response?.status === "error";
          const aiText = isError
            ? `${response?.srsData?.error || "Unknown error occurred"}`
            : response?.srsData?.aiResponse || "⚠️ No AI response";

          // Parse JSON SRS and save to state
          try {
            const parsed = JSON.parse(aiText);
            setProject(parsed);
          } catch (e) {
            setToast({
              message: "❌ Invalid JSON received from AI",
              type: "error",
            });
          }

          const aiMessageId = `ai-${Date.now()}`;

          dispatch(
            addMessage({
              sender: "ai",
              text: "",
              replied: true,
              id: aiMessageId,
              loading: true,
            })
          );

          await new Promise((res) => setTimeout(res, 1500));
          await typeMessage(aiText, aiMessageId);

          dispatch(updateMessage({ id: msg.id, replied: true }));
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

  const sendMessage = (text) => {
    if (!text.trim()) {
      setToast({ message: "❌ Cannot send empty message", type: "warning" });
      return;
    }
    if (isTypingRef.current) {
      setToast({ message: "⏳ Wait for AI response", type: "info" });
      return;
    }

    dispatch(addMessage({ sender: "user", text, replied: false }));
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setHasSentMessage(true);
    setProject(null); // Clear previous project on new message
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
        />

        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300"
          aria-label="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-800"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
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
            className={`w-full max-w-2xl flex justify-center
              transition-transform duration-[5000ms] ease-in-out
              ${
                hasSentMessage
                  ? "fixed bottom-6 left-1/2 transform -translate-x-1/2 translate-y-0"
                  : "relative translate-x-0 translate-y-0"
              }
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
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl break-words whitespace-pre-wrap
                      ${
                        msg.sender === "user"
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
                      msg.text
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div
            className="w-full max-w-2xl px-4 flex justify-center z-50 fixed bottom-6 left-1/2 transform -translate-x-1/2"
          >
            {inputForm}
          </div>
        </>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Render parsed JSON SRS */}
      {project && (
        <main
          id="project-content"
          className="relative flex-1 p-6 overflow-y-auto scroll-smooth bg-white text-black rounded-lg shadow-md max-w-4xl mx-auto mt-6"
        >
          <button
            onClick={() => setProject(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            aria-label="Close SRS view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

          {project.sections.map((section, i) => (
            <section id={`section-${i}`} key={i} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{section.heading}</h3>
              {section.content.map((c, j) => (
                <div key={j} className="mb-2">
                  {c.subheading && (
                    <p className="text-sm font-medium text-gray-600">{c.subheading}</p>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.text}</p>
                </div>
              ))}
            </section>
          ))}
        </main>
      )}
    </div>
  );
}
