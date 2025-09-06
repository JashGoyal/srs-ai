import React, { useState, useEffect } from "react";

export default function ViewProject({ project, setShow }) {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const container = document.getElementById("project-content");

        const handleScroll = () => {
            project.sections.forEach((_, i) => {
                const el = document.getElementById(`section-${i}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    if (
                        rect.top >= containerRect.top &&
                        rect.top <= containerRect.top + containerRect.height / 2
                    ) {
                        setActiveSection(i);
                    }

                    if (i === project.sections.length - 1 && rect.bottom <= containerRect.bottom) {
                        setActiveSection(i);
                    }
                }
            });
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [project.sections]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex relative">
   
                <aside className="w-1/4 bg-gray-50 border-r p-4 overflow-y-auto rounded-l-2xl">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{project.title}</h2>
                    <ul className="space-y-2 text-sm">
                        {project.sections.map((section, i) => (
                            <li
                                key={i}
                                className={`cursor-pointer ${
                                    activeSection === i
                                        ? "text-gray-900 font-bold"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                                onClick={() =>
                                    document.getElementById(`section-${i}`)
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                {section.heading}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main
                    id="project-content"
                    className="flex-1 p-6 overflow-y-auto scroll-smooth"
                >
                    <button
                        onClick={() => setShow(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {project.sections.map((section, i) => (
                        <div id={`section-${i}`} key={i} className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {section.heading}
                            </h3>
                            {section.content.map((c, j) => (
                                <div key={j} className="mb-2">
                                    <p className="text-sm font-medium text-gray-600">
                                        {c.subheading}
                                    </p>
                                    <p className="text-sm text-gray-700">{c.text}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}
