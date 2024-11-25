"use client";

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";

// global stores
import { useTrialStore } from "@/store/CreateTrialStore";
import { getOptions, updateOptionsField } from "@/firebase";
import { useAlertStore } from "@/store/AlertStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// enums
import { AlertType } from "@/enums";

// icons
import { FaChevronDown } from "react-icons/fa";

type params = {
  rowId: number;
  tablelength: number;
};

const TableRow = ({ rowId, tablelength }: params) => {
  const { user } = useUser();
  const [logs, updateLog] = useTrialStore((state) => [
    state.trials,
    state.updateTrial,
  ]);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  const [options, setOptions] = useState<{
    siteList: string[];
  } | null>(null);
  const [modal, setModal] = useState<{
    isVisible: boolean;
    field: "siteList" | null;
    action: "add" | "remove" | null;
    value: string;
  }>({ isVisible: false, field: null, action: null, value: "" });
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredOptions =
    options?.siteList?.filter((site) =>
      site.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleAddOrRemoveOption = async () => {
    closeAlert();
    let alert: AlertBody;
    let alertType: AlertType;

    if (user && modal.field && modal.value) {
      const response = await updateOptionsField(
        user.orgId,
        modal.field,
        modal.action!,
        modal.value
      );

      if (response.success) {
        setOptions((prev) => {
          if (!prev) return null;

          if (modal.field) {
            const updatedField =
              modal.action === "add"
                ? [...prev[modal.field], modal.value]
                : prev[modal.field].filter((item) => item !== modal.value);

            return { ...prev, [modal.field]: updatedField };
          }

          return prev;
        });

        setModal({ isVisible: false, field: null, action: null, value: "" });
        alert = {
          title: "Success!",
          content: `Option successfully ${
            modal.action === "add" ? "added to" : "removed from"
          } ${formatField(modal.field)}.`,
        };
        alertType = AlertType.Success;
        setAlert(alert, alertType);
      } else {
        alert = {
          title: "Error!",
          content: "There was an error while updating. Please try again.",
        };
        alertType = AlertType.Error;
        setAlert(alert, alertType);
      }
    }
  };

  const formatField = (field: string | null) => {
    if (!field) return ""; // Handle null or empty values
    return field
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space before capital letters
      .replace(/^[a-z]/, (char) => char.toUpperCase()) // Capitalize the first letter
      .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize all words
  };

  useEffect(() => {
    if (user) {
      const fetchOptions = async () => {
        const response = await getOptions(user.orgId);

        if (response.success) {
          setOptions(response.data);
        }
      };

      fetchOptions();
    }
  }, [user?.orgId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Investigator Name */}
      <div className="relative w-1/3 whitespace-nowrap text-sm font-medium text-gray-800">
        <input
          type="text"
          defaultValue={logs[rowId]["investigatorName"]}
          onChange={(e) => updateLog(rowId, "investigatorName", e.target.value)}
          id={`investigatorName-${rowId}`}
          className={`block w-11/12 text-sm text-gray-900 p-2.5 border-b-[1px] border-b-transparent ${rowId === (tablelength-1) ? "rounded-bl-lg" :  ""} focus:outline-0 focus:border-blue-500`}
          placeholder="Enter name..."
        />
      </div>
      {/* Protocol */}
      <div className="w-1/3 flex whitespace-nowrap text-sm text-gray-800">
        <input
          id={`protocol-${rowId}`}
          type="text"
          defaultValue={logs[rowId]["protocol"]}
          onChange={(e) => updateLog(rowId, "protocol", e.target.value)}
          className="block w-11/12 text-sm text-gray-900 p-2.5 border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500"
          placeholder="Enter a protocol..."
        />
      </div>
      {/* Site Visit */}
      <div className="w-1/3 flex whitespace-nowrap text-sm text-gray-800">
        {/* Dropdown Trigger */}
        <div
          onClick={() => setDropdownVisible((prev) => !prev)}
          className="w-[21rem] flex items-center justify-between text-sm text-gray-900 bg-white p-2.5 px-2 border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 hover:cursor-pointer"
        >
          <p>{logs[rowId].siteVisit || " Select a site"}</p>
          <FaChevronDown color="#868686" />
        </div>
        {/* Dropdown Content */}
        {isDropdownVisible && (
          <div
            className="absolute top-28 h-96 w-[21rem] bg-white p-3 rounded-b-md shadow-md z-10"
            ref={dropdownRef}
          >
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm text-gray-900 px-2 py-2 mb-2 border-b focus:outline-none"
            />

            {/* Filtered Options */}
            {filteredOptions.length > 0 &&
              filteredOptions?.map((site, index) => (
                <div
                  key={index}
                  onClick={() => {
                    updateLog(rowId, "siteVisit", site);
                    setDropdownVisible(false);
                  }}
                  className="p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  {site}
                </div>
              ))}
          </div>
        )}

        <div className="flex items-center">
          <button
            onClick={() =>
              setModal({
                isVisible: true,
                field: "siteList",
                action: "add",
                value: "",
              })
            }
            className="text-2xl text-blue-500 hover:text-blue-700 ml-2"
          >
            +
          </button>
          <button
            onClick={() =>
              setModal({
                isVisible: true,
                field: "siteList",
                action: "remove",
                value: logs[rowId]["protocol"],
              })
            }
            className="text-2xl text-red-500 hover:text-red-700 ml-2"
          >
            -
          </button>
        </div>
      </div>
      {/* Modal */}
      {modal.isVisible && (
        <div className="fixed top-0 left-0 h-full w-10/12 flex items-center justify-center bg-white/20 ml-72">
          <div className="w-96 bg-[#b5d5f4] p-6 lg:mr-10 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {modal.action === "add" ? "Add to " : "Remove from "}
              {formatField(modal.field)}
            </h2>
            <input
              type="text"
              value={modal.value}
              onChange={(e) =>
                setModal((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="site"
              className="border rounded p-2 mb-4 w-full"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  setModal({
                    isVisible: false,
                    field: null,
                    action: null,
                    value: "",
                  })
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrRemoveOption}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableRow;
