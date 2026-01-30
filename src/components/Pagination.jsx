// src/components/Pagination.jsx
import React from "react";

function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const goPrev = () => {
    if (currentPage > 0) onChange(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages - 1) onChange(currentPage + 1);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <button onClick={goPrev} disabled={currentPage === 0}>
        Previous
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button onClick={goNext} disabled={currentPage >= totalPages - 1}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
