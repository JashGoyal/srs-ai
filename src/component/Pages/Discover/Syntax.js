import React from "react";

export default function Syntax() {
  return (
    <div className="min-h-screen flex items-start justify-center rounded-md bg-gray-400 p-6 gap-4">

      <div className="flex gap-4">

        <div className="bg-white w-[150mm] h-[220mm] shadow-xl rounded-md p-4 flex flex-col gap-3 page">
          <header className="border-b border-gray-300 pb-1">
            <h1 className="text-lg font-bold text-gray-900">
              Software Requirements Specification (SRS)
            </h1>
            <p className="text-xs text-gray-600">IEEE-style structure — blueprint for the software system</p>
          </header>
          <main className="flex-1 text-gray-800 text-xs leading-snug overflow-hidden flex flex-col gap-2">
            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">1. Introduction</h2>
              <ul className="ml-3 space-y-1">
                <li><strong>1.1 Purpose:</strong> Define purpose of the SRS and intended audience.</li>
                <li><strong>1.2 Scope:</strong> Outline product goals, features, and boundaries.</li>
                <li><strong>1.3 Definitions, Acronyms, Abbreviations:</strong> Key terms.</li>
                <li><strong>1.4 References:</strong> List external docs/standards.</li>
                <li><strong>1.5 Overview:</strong> Describe structure of this SRS.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">2. Overall Description</h2>
              <ul className="ml-3 space-y-1">
                <li><strong>2.1 Product Perspective:</strong> Relation to other systems.</li>
                <li><strong>2.2 Product Functions:</strong> Summary of main functions.</li>
                <li><strong>2.3 User Characteristics:</strong> Expected skills/knowledge of users.</li>
                <li><strong>2.4 Constraints:</strong> Technical, business, or regulatory limits.</li>
                <li><strong>2.5 Assumptions and Dependencies:</strong> External factors relied upon.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">3. System Features</h2>
              <div className="ml-3 mt-1">
                <h3><strong>3.1 User Authentication</strong></h3>
                <ul className="list-disc list-inside ml-3">
                  <li>Inputs: Email, password</li>
                  <li>Processing: Validate credentials, create session</li>
                  <li>Outputs: Authenticated session</li>
                </ul>
              </div>
              <div className="ml-3 mt-1">
                <h3><strong>3.2 Task Management</strong></h3>
                <ul className="list-disc list-inside ml-3">
                  <li>Inputs: Task title, description</li>
                  <li>Processing: Store and update tasks</li>
                  <li>Outputs: Task list, notifications</li>
                </ul>
              </div>
            </section>

              <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">4. External Interface Requirements</h2>
              <ul className="list-disc list-inside ml-3 space-y-1">
                <li>User Interfaces</li>
                <li>Hardware Interfaces</li>
                <li>Software Interfaces</li>
                <li>Communication Interfaces</li>
              </ul>
            </section>
            
          </main>
          <footer className="border-t border-gray-300 pt-1 text-right text-xs text-gray-500">
             Page 1 of 2
          </footer>
        </div>

        <div className="bg-white w-[150mm] h-[220mm] shadow-xl rounded-md p-4 flex flex-col gap-3 page">
          <header className="border-b border-gray-300 pb-1">
            <h1 className="text-lg font-bold text-gray-900">Software Requirements Specification (SRS)</h1>
            <p className="text-xs text-gray-600">Continuation</p>
          </header>
          <main className="flex-1 text-gray-800 text-xs leading-snug overflow-hidden flex flex-col gap-2">

            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">5. Non-Functional Requirements</h2>
              <ul className="list-disc list-inside ml-3 space-y-1">
                <li>Performance Requirements</li>
                <li>Safety Requirements</li>
                <li>Security Requirements</li>
                <li>Software Quality Attributes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">6. Other Requirements</h2>
              <p>Additional requirements not covered elsewhere.</p>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-blue-700 mb-1">7. Appendices</h2>
              <p>Supporting information such as glossaries, diagrams, and references.</p>
            </section>
          </main>
          <footer className="border-t border-gray-300 pt-1 text-right text-xs text-gray-500">
             Page 2 of 2
          </footer>
        </div>
      </div>

      <style>{`
        @media print {
          .page {
            page-break-after: always;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
