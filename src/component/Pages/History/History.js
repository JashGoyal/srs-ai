import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSrsHistory } from "../../../redux/features/GetHistory";
import { deleteSrsById } from "../../../redux/features/deleteSrsSlice.js";
import HistoryCard from "./Historycard";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Toast from "../../Toast.js";
import Loader from "../../Loader.js";
import SearchBar from "./SearchBar.js";

export default function History() {
  const dispatch = useDispatch();

  const { items: srsList = [], loading, error } = useSelector(
    (state) => state.srsHistory || {}
  );
  const { successMessage, errorMessage } = useSelector(
    (state) => state.deleteSrs || {}
  );

  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });

      const timeout = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

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

  const filteredSrsList = srsList
    .filter((doc) =>
      doc.aiResponse?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      (a.aiResponse?.title || "").localeCompare(b.aiResponse?.title || "")
    );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const onScroll = () => setVisible(window.scrollY > 300);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () =>
      window.scrollTo({ top: 0, behavior: "smooth" });

    if (!visible) return null;

    return (
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          style={{ width: "24px", height: "24px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8 text-center">
        Previously Generated SRS
      </h2>

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by project title..."
      />

      {loading && <Loader />}
      <div className="grid pt-8 gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-7xl w-full justify-items-center mt-6">
        {filteredSrsList.length === 0 && !loading && (
          <p className="text-gray-400 text-center w-full col-span-full">
            No matching SRS history found.
          </p>
        )}

        {filteredSrsList.map((doc, index) => {
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

      <ScrollToTopButton />
    </div>
  );
}
