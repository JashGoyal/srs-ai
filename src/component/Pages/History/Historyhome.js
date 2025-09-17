import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSrsHistory } from "../../../redux/features/GetHistory";
import { deleteSrsById } from "../../../redux/features/deleteSrsSlice.js";
import HistoryCard from "./Historycard";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Toast from "../../Toast.js";
import Loader from "../../Loader.js";


export default function HistoryHome() {
  const dispatch = useDispatch();
  const { items: srsList, loading, error } = useSelector((state) => state.srsHistory);
  const { successMessage, errorMessage } = useSelector((state) => state.deleteSrs);

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
      message: "Are you sure you want to delete this SRS document? ",
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
    <div className="min-h-screen bg-black p-8">
      {loading && <Loader />}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {srsList.map((doc, index) => {
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
