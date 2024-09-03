"use client";

// react/nextjs components
import React, { useState } from "react";

// firebase components/functions
import { deleteLog } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";
import Tooltip from "@mui/material/Tooltip";

// enums
import { AlertType } from "@/enums";

//icons
import { MdDelete } from "react-icons/md";
import { FaFileCircleMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

type Props = {
  columns: GridColDef[];
  rows: LogDetails[];
};

const LogTable = (props: Props) => {
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteLogRow, setDeleteLogRow] = useState<boolean>(false);
  const [setAlert] = useAlertStore((state) => [state.setAlert]);

  const handleSetDelete = (id: number) => {
    setActiveRowId(id);
    setDeleteLogRow(true);
  };

  const handleDeleteLog = (id: number) => {
    deleteLog(id.toString()).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "Log was deleted successfully.",
        };
        alertType = AlertType.Success;
      } else {
        alert = {
          title: "Error!",
          content: "Could not delete log. Please try again",
        };
        alertType = AlertType.Error;
      }
      setAlert(alert, alertType);
    });
    setActiveRowId(null);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Action",
    headerAlign: "left",
    flex: 1,
    renderCell: (params) => {
      const { id } = params.row;
      const isProgressActive = id === activeRowId;

      return (
        <div className="h-full w-full flex items-center justify-start">
          <div
            className={`flex gap-3 ${
              isProgressActive ? "-translate-x-8" : "translate-x-0"
            } transition duration-300 ease-in-out`}
          >
            <Tooltip title="Delete Trial">
              <button
                type="button"
                onClick={() => handleSetDelete(id)}
                className="transition-transform duration-300 hover:scale-110"
              >
                <FaFileCircleMinus className="text-xl text-[#cf3030]" />
              </button>
            </Tooltip>
            <div
              className={`gap-3 ${
                isProgressActive && deleteLogRow ? "flex" : "hidden"
              }`}
            >
              <Tooltip title="Delete">
                <button
                  type="button"
                  onClick={() => handleDeleteLog(id)}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <MdDelete className="text-xl text-[#7d1f2e]" />
                </button>
              </Tooltip>
              <Tooltip title="Cancel">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteLogRow(false);
                    setActiveRowId(null);
                  }}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <IoClose className="text-xl" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      );
    },
  };
  return (
    <div className="h-fit w-[80rem]">
      <DataGrid
        className="p-6 gap-4"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        pageSizeOptions={[8]}
        disableMultipleRowSelection
        disableColumnMenu
      />
    </div>
  );
};

export default LogTable;
