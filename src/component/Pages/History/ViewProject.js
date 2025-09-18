import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function ViewProject({ project, setShow }) {
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(0);

  // Scroll to section
  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(index);
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(project.title || "Untitled Project", 10, 10);

    let y = 20;
    project.sections?.forEach((section) => {
      doc.setFontSize(14);
      doc.text(section.heading, 10, y);
      y += 8;

      section.content?.forEach((c) => {
        doc.setFontSize(12);
        doc.text(`${c.subheading}: ${c.text}`, 12, y);
        y += 8;
      });

      y += 5;
    });

    doc.save(`${project.title || "SRS"}.pdf`);
  };

  // Handle Delete with confirmation
  const handleDelete = () => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this SRS document?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => {
            if (project.id && project.onDelete) {
              project.onDelete(project.id);
              setShow(false);
            }
          },
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative w-4/5 h-4/5 bg-white rounded-2xl shadow-lg flex overflow-hidden">
        {/* Close Button inside modal */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-4 text-black font-bold text-2xl"
        >
          ✕
        </button>

        {/* Sidebar */}
        <aside className="w-1/4 bg-[#2C2C2C] border-r p-4 overflow-y-auto rounded-l-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{project.title}</h2>
            <ul className="space-y-2 text-sm">
              {project.sections?.map((section, i) => (
                <li
                  key={i}
                  className={`cursor-pointer ${activeSection === i
                      ? "text-white font-bold"
                      : "text-gray-300 hover:text-white"
                    }`}
                  onClick={() => scrollToSection(i)}
                >
                  {section.heading}
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleDownloadPDF}
              className="py-2 px-4 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Download PDF
            </button>

            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete SRS
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{project.title}</h1>

          {project.sections?.map((section, i) => (
            <div
              key={i}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="mb-6"
            >
              <h2 className="text-2xl font-semibold mb-3 text-gray-700">
                {section.heading}
              </h2>
              {section.content?.map((c, j) => (
                <div key={j} className="mb-2">
                  <h3 className="text-lg font-medium text-gray-600">{c.subheading}</h3>
                  <p className="text-gray-500">{c.text}</p>
                </div>
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
