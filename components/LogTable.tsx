"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// firebase components/functions
import { deleteLog, getLogs } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";

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
  trialId: string;
};

const LogTable = (props: Props) => {
  const { user } = useAuth();
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteLogRow, setDeleteLogRow] = useState<boolean>(false);
  const [setAlert] = useAlertStore((state) => [state.setAlert]);
  const [logs, setLogs] = useState<LogDetails[]>([])

  useEffect(() => {
    if (props.rows) {
      setLogs(props.rows)
    }
  }, [props])

  useEffect(() => {
    console.log("logs: ", logs)
  }, [logs])

  const handleSetDelete = (id: number) => {
    setActiveRowId(id);
    setDeleteLogRow(true);
  };

  const handleDeleteLog = (logId: string) => {
    deleteLog(logId).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "Log was deleted successfully.",
        };

        getLogs(props.trialId).then(response => setLogs(response.data))
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

  const monitorNameColumn: GridColDef = {
    field: "monitorName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Monitor Name",
    flex: 1,
    renderCell: (params) => {
      const {row} = params
      if (row.monitorName) {
        return <span>{row.monitorName}</span>;
      } else {
        return <span>No Monitor name available</span>;
      }
    },
  };

  const signatureColumn: GridColDef = {
    field: "signature",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Signature",
    flex: 1,
    renderCell: (params) => {
      const { row } = params;
      return (
        <div className="h-[40px] w-fit flex items-center text-center">
          {row.signature ? (
            <Image
              width={400}
              height={400}
              src={row.signature}
              alt="User Signature"
              style={{
                maxWidth: "150px",
                maxHeight: "80px",
                objectFit: "contain",
                margin: "0 -20px"
              }}
            />
          ) : (
            <div>No signature available</div>
          )}
        </div>
      );
    },
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Action",
    headerAlign: "left",
    flex: 0.6,
    renderCell: (params) => {
      const { id } = params.row;
      const isProgressActive = id === activeRowId;

      return (
        <div className="h-full w-full flex items-center justify-center 2xl:justify-start">
          <div
            className={`flex gap-3 ${
              isProgressActive ? "-translate-x-8" : "translate-x-0"
            } transition duration-300 ease-in-out`}
          >
            <Tooltip title="Delete Log">
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
  <div className="w-full flex items-center">
    <DataGrid
      className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4"
      rows={props.rows}
      columns={[
        monitorNameColumn,
        signatureColumn,
        props.columns[0],
        ...props.columns.slice(1),
        actionColumn,
      ]}
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
