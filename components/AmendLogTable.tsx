// react/nextjs components
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// global components
import AdminPopupStore from "@/store/AdminPopupStore";

// icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

type AmendLogTableProps = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  amendLogs: LogDetails[];
};

const AmendLogTable: React.FC<AmendLogTableProps> = ({
  setCurrentPage,
  currentPage,
  amendLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setIsOpen, isOpen } = AdminPopupStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = amendLogs
    .filter((log) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        (log.adminName ?? "").toLowerCase().includes(searchTerm) ||
        (log.amendedDate ?? "").toLowerCase().includes(searchTerm) ||
        (log.monitorName ?? "").toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const dateA = a.amendedDate ? new Date(a.amendedDate).getTime() : 0;
      const dateB = b.amendedDate ? new Date(b.amendedDate).getTime() : 0;
      return dateB - dateA; // Descending order
    });

  // Total items per page
  const ITEMS_PER_PAGE = 8;

  // Calculate indices for current page items
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Handle page change
  const handlePageChange = (direction: string) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 3 ||
        i > totalPages - 3 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  return (
    <>
      {/* Action buttons */}
      <div className="relative w-[95%] flex items-center justify-between mt-10">
        <div className="text-lg font-semibold">
          Amended Logs
          <span className="text-gray-400 ml-2">{currentItems.length}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-10 w-60 flex items-center gap-3 bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg">
            <div className="h-full w-full flex items-center justify-center gap-2 font-semibold bg-gray-200 px-2 rounded-md shadow-lg">
              <CiSearch size={20} color="black" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="h-10 w-32 text-[15px] bg-gray-300 pb-[3px] pr-[3px] rounded-md shadow-lg hover:scale-95"
          >
            <div className="h-full w-full flex items-center justify-center font-semibold bg-gray-200 rounded-md shadow-lg">
              {isOpen ? (
                "Cancel"
              ) : (
                <div className="flex items-center gap-2">
                  <FaPlus size={14} />
                  Amend Log
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
      <div className="w-[95%] bg-gray-200  pb-[6px] rounded-lg overflow-hidden">
        <div className="h-14 w-full bg-gray-300 pr-2 shadow-lg rounded-t-lg">
          <div className="h-full w-full flex text-[15px] text-left text-nowrap font-semibold bg-gray-200 rounded-t-lg shadow-lg">
            <div className="h-full w-[14%] flex items-center justify-start px-4">
              Amended By
            </div>
            <div className="h-full w-[12%] flex items-center justify-start px-4">
              Signature
            </div>
            <div className="h-full w-[18%] flex items-center justify-start px-4">
              Reason
            </div>
            <div className="h-full w-[16%] flex items-center justify-start px-4">
              Amendment Date
            </div>
            <div className="h-full w-[12%] flex items-center justify-start px-4">
              Monitor Name
            </div>
            <div className="h-full w-[16%] flex items-center justify-start px-4">
              Date of Visit
            </div>
            <div className="h-full w-[12%] flex items-center justify-start px-4">
              Action
            </div>
          </div>
        </div>
        {filteredData.map((item, idx) => (
          <div
            key={idx}
            className="h-16 w-full text-nowrap bg-gray-300 pr-2 shadow-lg"
          >
            <div
              key={item.id}
              className="h-full w-full flex text-sm text-gray-700 text-left bg-gray-100 border-b hover:bg-gray-50 shadow-lg"
            >
              <div className="h-full w-[14%] flex items-center justify-start px-4">
                {item.adminName}
              </div>
              <div className="h-full w-[12%] flex items-center justify-start">
                {item.adminSig?.startsWith("data:image") ? (
                  <Image
                    width={200}
                    height={200}
                    src={item.adminSig}
                    alt="User Signature"
                    style={{
                      width: "150px",
                      height: "60px",
                    }}
                  />
                ) : (
                  <p>{item.adminSig || "No signature available"}</p>
                )}
              </div>
              <div
                className="h-full w-[18%] flex items-center justify-start text-nowrap px-4 overflow-hidden"
                title={item.amendedReason || ""}
              >
                {item.amendedReason
                  ? item.amendedReason.length > 30
                    ? `${item.amendedReason.slice(0, 30)}...`
                    : item.amendedReason
                  : ""}
              </div>

              <div className="h-full w-[16%] flex items-center justify-start text-nowrap px-4 overflow-hidden">
                {item.amendedDate
                  ? new Date(item.amendedDate).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </div>
              <div className="h-full w-[12%] flex items-center justify-start px-4 overflow-hidden">
                {item.monitorName}
              </div>
              <div className="h-full w-[16%] flex items-center justify-start px-4 overflow-hidden">
                {item.dateOfVisit
                  ? new Date(item.dateOfVisit).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </div>
              <div className="h-full w-[12%] flex items-center justify-start px-4 overflow-hidden">
                <Link
                  href={`/monitoringLogs/${item.trialId}/logs`}
                  target="blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-semibold bg-gray-300 px-4 py-1 rounded-md hover:bg-gray-400"
                  title={`/monitoringLogs/${item.trialId}/logs`}
                >
                  View Log
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="w-full bg-gray-300 pr-2 shadow-lg">
          <div className="w-full grid sm:grid-cols-9 text-xs text-gray-500 font-semibold tracking-wide uppercase bg-gray-50 px-4 py-3 border rounded-b-lg shadow-lg">
            <span className="flex items-center col-span-3">
              Showing {startIndex + 1}-{endIndex} of {currentItems.length}
            </span>
            <span className="col-span-2"></span>
            {/* Pagination */}
            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul className="inline-flex items-center">
                  <li>
                    <button
                      className={`px-3 py-1 rounded-md rounded-l-lg focus:outline-none ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 focus:shadow-outline-purple"
                      }`}
                      aria-label="Previous"
                      onClick={() => handlePageChange("previous")}
                      disabled={currentPage === 1}
                    >
                      <FaChevronLeft size={16} />
                    </button>
                  </li>
                  {pageNumbers.map((number, index) => (
                    <li key={index}>
                      {number === "..." ? (
                        <span className="px-3 py-1">...</span>
                      ) : (
                        <button
                          className={`px-3 py-1 rounded-md ${
                            currentPage === number
                              ? "text-white bg-gray-600"
                              : "text-gray-600"
                          } focus:outline-none focus:shadow-outline-purple`}
                          onClick={() =>
                            typeof number === "number" && setCurrentPage(number)
                          }
                        >
                          {number}
                        </button>
                      )}
                    </li>
                  ))}
                  <li>
                    <button
                      className={`px-3 py-1 rounded-md rounded-r-lg focus:outline-none ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 focus:shadow-outline-purple"
                      }`}
                      aria-label="Next"
                      onClick={() => handlePageChange("next")}
                      disabled={currentPage === totalPages}
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmendLogTable;
