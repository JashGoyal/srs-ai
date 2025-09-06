import React from "react";
import data from "../../Data/Samplesrs.json"; 
import HistoryCard from "./Historycard";

export default function Historyhome() {
    const handleViewDetails = (project) => {
    console.log("Selected Project:", project.title);
  };

  return (
    <div className="min-h-screen bg-black p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((project, index) => (
        <HistoryCard
          key={index}
          project={project}
          onClick={handleViewDetails}
        />
      ))}
    </div>
  );
}