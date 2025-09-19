import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSrsHistory } from "../../../redux/features/GetHistory.js";
import { deleteSrsById } from "../../../redux/features/deleteSrsSlice.js";
import HistoryCard from "./Historycard.js";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Toast from "../../Toast.js";
import Loader from "../../Loader.js";
import { useNavigate } from "react-router-dom";

export default function Historyhome() {
  const dispatch = useDispatch();
  const { items: srsList, loading, error } = useSelector((state) => state.srsHistory);
  const { successMessage, errorMessage } = useSelector((state) => state.deleteSrs);
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchSrsHistory());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setToast({ message: successMessage, type: "success" });
      dispatch(fetchSrsHistory());
    }
    if (errorMessage) {
      setToast({ message: errorMessage, type: "error" });
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this SRS document?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => dispatch(deleteSrsById(id)),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });

      const timeout = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-black mt-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center">

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-5xl sm:text-4xl font-bold text-white mb-8 text-center">
        Previously{" "}
        <span
          onClick={() => navigate("/history")}
          className="text-neon cursor-pointer hover:underline"
          title="Go to History"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/history");
            }
          }}
        >
          Generated
        </span>
        {" "}
        SRS
      </h2>

      {loading && <Loader />}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-7xl w-full justify-items-center">
        {[...srsList]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6)
          .map((doc, index) => {
            const project = {
              ...doc.aiResponse,
              id: doc.id,
            };

            return (
              <HistoryCard
                key={doc.id || index}
                project={project}
                onDelete={() => handleDelete(doc.id)}
                date={doc.createdAt}
              />
            );
          })}
      </div>
    </div>
  );
}
