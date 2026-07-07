import React, { useState } from "react";
import { BsCaretLeft, BsCaretRight } from "react-icons/bs";

const Pagination = () => {
  // Total number of results
  const totalResults = 63;
  const resultsPerPage = 6;
  // Total pages required
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  // Current active page
  const [currentPage, setCurrentPage] = useState(1);

  // change the page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // get pagination numbers
  const getPaginationNumbers = () => {
    const visiblePages = [];
    const delta = 2; // Number of pages to show around the current page

    // If pages are 7 or less, show all numbers
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Function to add "..." when skipping pages
    const addEllipsis = () => {
      if (visiblePages[visiblePages.length - 1] !== "...") {
        visiblePages.push("...");
      }
    };

    // Loop through total pages
    for (let i = 1; i <= totalPages; i++) {
      // Always show first, last, and nearby pages
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        visiblePages.push(i);
      } else if (visiblePages[visiblePages.length - 1] !== "...") {
        addEllipsis();
      }
    }
    return visiblePages;
  };

  return (
    <div className="flex items-center justify-between space-y-4 p-4">
      <span className="text-neutral-900 font-normal text-sm">
        {totalResults} results
      </span>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <button
          className="px-2 py-1 text-gray-500 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          <BsCaretLeft />
        </button>

        {/* Page number buttons */}
        {getPaginationNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && goToPage(page)}
            className={`px-3 py-1 rounded-full ${
              currentPage === page
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            disabled={page === "..."} // Disable "..." button
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          className="px-2 py-1 text-gray-500 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          <BsCaretRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
