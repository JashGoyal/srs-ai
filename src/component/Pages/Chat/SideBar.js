import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSrsHistory } from "../../../redux/features/GetHistory";
import ViewProject from "../History/ViewProject";

export default function SideBar() {
  const dispatch = useDispatch();
  const { items: srsList = [] } = useSelector((state) => state.srsHistory || {});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [aiid, setaiid] = useState();

  useEffect(() => {
    dispatch(fetchSrsHistory());
  }, [dispatch]);

  const handleOpenProject = (project, id) => {
    setSelectedProject(project);
    setaiid(id);
    setIsOpen(true);
  };

  const reversedSrsList = [...srsList].reverse();

  return (
    <div className="h-screen w-[250px] bg-[#1F1F1F] text-white flex flex-col shadow-lg">
      <div className="p-4 text-2xl font-semibold border-b border-gray-700">
        Saved SRS
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-dark space-y-2">
        {reversedSrsList.length === 0 ? (
          <p className="text-gray-400 text-center">No SRS found</p>
        ) : (
          reversedSrsList.map((doc) => {
            const project = doc.aiResponse;
            return (
              <div
                key={doc.id}
                className="group flex justify-between items-center p-2 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors duration-200"
                title={project?.title || "Untitled"}
                onClick={() => handleOpenProject(project, doc.id)}
              >
                <span className="truncate">{project?.title || "Untitled"}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              </div>
            );
          })
        )}
      </div>

      {isOpen && selectedProject && (
        <ViewProject project={selectedProject} setShow={setIsOpen} id={aiid} />
      )}
    </div>
  );
}
