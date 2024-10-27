"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// firebase components/functions
import { deleteLog, getLogs } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";
import useSignatureStore from "@/store/SignatureStore";

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
import useUser from "@/hooks/UseUser";

type Props = {
  columns: GridColDef[];
  rows: LogDetails[];
  trialId: string;
};

const LogTable = (props: Props) => {
  const { user } = useUser();
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteLogRow, setDeleteLogRow] = useState<boolean>(false);
  const [setAlert] = useAlertStore((state) => [state.setAlert]);
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const setSelectedRow = useSignatureStore((state) => state.setSelectedRow);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  useEffect(() => {
    if (props.rows) {
      setLogs(props.rows);
    }
  }, [props]);

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

        getLogs(props.trialId).then((response) => setLogs(response.data));
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

  const MonitorNameColumn: GridColDef = {
    field: "monitorName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Monitor Name",
    flex: 1,
    renderCell: (params) => {
      const { row } = params;
      if (row.monitorName) {
        return <span>{row.monitorName}</span>;
      } else {
        return <span>No Monitor name available</span>;
      }
    },
  };

  const SignatureColumn: GridColDef = {
    field: "signature",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Signature",
    flex: 1,
    renderCell: (params) => {
      const { row } = params;
      const isBase64Image = row.signature.startsWith("data:image");
  
      return (
        <button
          onClick={() => setSelectedRow(row, true)}
          className="h-[50px] w-fit flex items-center text-center"
        >
          {isBase64Image ? (
            <Image
              width={200}
              height={200}
              src={row.signature}
              alt="User Signature"
              style={{
                width: "150px",
                height: "60px",
              }}
            />
          ) : (
            <p>{row.signature || "No signature available"}</p>
          )}
        </button>
      );
    },
  }; 

  const ActionColumn: GridColDef = {
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
              isProgressActive ? "-translate-x-10" : "translate-x-0"
            } transition duration-300 ease-in-out`}
          >
            <Tooltip title="Delete Log">
              <button
                type="button"
                onClick={() => handleSetDelete(id)}
                className="transition-transform duration-300 hover:scale-110"
              >
                <FaFileCircleMinus className="text-2xl text-[#cf3030]" />
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
                  <MdDelete className="text-2xl text-[#7d1f2e]" />
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
                  <IoClose className="text-2xl" />
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
      <DataGrid<LogDetails>
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4"
        rows={logs}
        columns={[
          MonitorNameColumn,
          SignatureColumn,
          props.columns[0],
          ...props.columns.slice(1),
          ...(isAdmin ? [ActionColumn] : []),
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        pageSizeOptions={[10]}
        disableMultipleRowSelection
        disableColumnMenu
      />
    </div>
  );
};

export default LogTable;
