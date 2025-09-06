import React from "react";

export default function SRSOverview() {
  return (
    <div className="bg-black min-h-screen text-gray-200 flex justify-center items-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        {/* What is SRS Section */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-neon mb-4">🔹 What is SRS?</h2>
          <p className="mb-4">
            An <strong>SRS (Software Requirement Specification)</strong> is a
            formal document that describes what a software system should do. It
            is the <span className="text-neon">blueprint of the project</span>—
            prepared before development starts.
          </p>
          <p className="mb-2">It captures:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Functional requirements (what the system should do)</li>
            <li>Non-functional requirements (how well it should do it)</li>
            <li>Constraints (technical, regulatory, environmental)</li>
          </ul>
          <p className="mt-4">
            The SRS is typically prepared by{" "}
            <span className="text-neon">
              Business Analysts, System Analysts, or Project Managers
            </span>{" "}
            after consulting stakeholders.
          </p>
        </div>

        {/* Objectives of SRS Section */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-neon mb-4">🔹 Objectives of SRS</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              Provide a <span className="text-neon">clear understanding</span>{" "}
              between stakeholders and developers.
            </li>
            <li>
              Act as a <span className="text-neon">contract</span> between client
              and development team.
            </li>
            <li>
              Reduce development <span className="text-neon">cost and time</span>{" "}
              by minimizing misunderstandings.
            </li>
            <li>
              Provide a solid basis for{" "}
              <span className="text-neon">design, coding, and testing</span>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
