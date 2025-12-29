/** biome-ignore-all lint/suspicious/noArrayIndexKey: Using array index as key for pagination items is acceptable in this context */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination: React.FC<{
  limit: number;
  offset: number;
  total: number;
}> = ({ limit, offset, total }) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const searchParams = useSearchParams();

  const buildUrl = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("offset", newOffset.toString());
    return `?${params.toString()}`;
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Total number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    total > 0 && (
      <div className="flex justify-center items-center gap-2 my-6">
        {/* Previous Button */}
        <Link
          href={buildUrl(Math.max(0, offset - limit))}
          className={`p-2 rounded-md transition-colors ${
            currentPage === 1
              ? "text-gray-600 pointer-events-none"
              : "text-white hover:bg-gray-800"
          }`}
          aria-disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </Link>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const pageOffset = (pageNumber - 1) * limit;
          const isActive = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={buildUrl(pageOffset)}
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}

        {/* Next Button */}
        <Link
          href={buildUrl(offset + limit)}
          className={`p-2 rounded-md transition-colors ${
            currentPage === totalPages
              ? "text-gray-600 pointer-events-none"
              : "text-white hover:bg-gray-800"
          }`}
          aria-disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </Link>
      </div>
    )
  );
};

export default Pagination;
