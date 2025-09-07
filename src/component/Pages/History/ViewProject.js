import React, { useState, useEffect, useRef } from "react";

export default function ViewProject({ project, setShow }) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
        setActiveSection(project.sections.length - 1);
        return;
      }

      let closestIndex = 0;
      let minDistance = Infinity;

      project.sections.forEach((_, i) => {
        const el = document.getElementById(`section-${i}`);
        if (el) {
          const distance = Math.abs(
            el.getBoundingClientRect().top - container.getBoundingClientRect().top
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
      });

      setActiveSection(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [project.sections]);

  const scrollToSection = (i) => {
    const el = document.getElementById(`section-${i}`);
    if (el) {
      isScrollingRef.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(i);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex relative">
        
        <aside className="w-1/4 bg-gray-300 border-r p-4 overflow-y-auto rounded-l-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{project.title}</h2>
          <ul className="space-y-2 text-sm">
            {project.sections.map((section, i) => (
              <li
                key={i}
                className={`cursor-pointer ${
                  activeSection === i
                    ? "text-gray-900 font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => scrollToSection(i)}
              >
                {section.heading}
              </li>
            ))}
          </ul>
        </aside>

        <main
          ref={containerRef}
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
                  <p className="text-sm font-medium text-gray-600">{c.subheading}</p>
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
