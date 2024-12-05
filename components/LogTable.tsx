"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// firebase components/functions
import { deleteLog, getLogs, updateLogSignature } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";
import useSignatureStore from "@/store/SignatureStore";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";
import Tooltip from "@mui/material/Tooltip";

// custom hooks
import useUser from "@/hooks/UseUser";

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
  const { user } = useUser();
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteLogRow, setDeleteLogRow] = useState<boolean>(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(false);
  const setSelectedRow = useSignatureStore((state) => state.setSelectedRow);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string | number, string>
  >({});
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    const anySelected = Object.values(selectedOptions).some(
      (value) => value !== ""
    );
    setShowConfirmation(anySelected);
  }, [selectedOptions]);

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

  const handleAmmendSignature = async () => {
    closeAlert();
    // Iterate over all selected options (now using for...of instead of forEach)
    for (const [rowId, selectedOption] of Object.entries(selectedOptions)) {
      // Logic based on the selected option for each row
      const signature =
        selectedOption === "esignature"
          ? user?.signature
          : "E-signatures are not permitted";

      if (user?.userId && signature) {
        updateLogSignature(rowId, signature)
          .then((response) => {
            if (response.success) {
              setAlert(
                {
                  title: "Success!",
                  content: "Signature updated successfully.",
                },
                AlertType.Success
              );
            } else {
              setAlert(
                {
                  title: "Error!",
                  content: "Could not update signature. Please try again.",
                },
                AlertType.Error
              );
            }
          })
          .catch((error) => {
            setAlert(
              {
                title: "Error!",
                content: `An error occurred while updating the signature. ${error}`,
              },
              AlertType.Error
            );
          });
      }
    }

    setShowConfirmation(false);
    setTimeout(() => window.location.reload(), 2000);
  };

  const MonitorNameColumn: GridColDef = {
    field: "monitorName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Monitor Name",
    flex: 1,
    renderCell: (params) => {
      const { row } = params;
      if (row.monitorName) {
        return (
          <div className="relative">
            <Tooltip title={row.ammended ? "amended" : ""}>
              <span>{row.monitorName}</span>
            </Tooltip>
          </div>
        );
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

      const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
        rowId: string | number
      ) => {
        setSelectedOptions((prev) => ({
          ...prev,
          [rowId]: event.target.value,
        }));
      };

      return (
        <>
          {row.signature === "Must be done by monitor" &&
          row.monitorName === `${user?.fName} ${user?.lName}` ? (
            <select
              value={selectedOptions[row.id] || ""}
              onChange={(event) => handleSelectChange(event, row.id)}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline animate-pulse"
            >
              <option value="">Select an option</option>
              <option value="esignature">E-signature</option>
              <option value="notPermitted">
                E-signatures are not permitted
              </option>
            </select>
          ) : (
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
          )}
        </>
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
                <FaFileCircleMinus className="text-2xl text-[#cf3030] ${}" />
              </button>
            </Tooltip>

            {isProgressActive && deleteLogRow ? (
              <div className="gap-3 flex">
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
            ) : null}
          </div>
        </div>
      );
    },
  };

  const getRowClassName = (params: any) => {
    if (params.row.ammended) {
      return "text-gray-500";
    }
    return "";
  };

  const noRowsColumn: GridColDef = {
    field: "noRows",
    headerName: "No rows available",
    flex: 1,
    sortable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    headerClassName: "text-blue-500 uppercase bg-blue-50"
  };

  const fallbackRow: DBLog  = {
    id: "1",
    trialId: "14543",
    monitorName: "N/A",
    signature: "N/A",
    typeOfVisit: "Remote",
    purposeOfVisit: "SIV",
    dateOfVisit: "N/A",
  };

  return (
    <div className="w-full flex items-center">
      <DataGrid<LogDetails>
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4"
        rows={logs.length > 0 ? logs : [{ ...fallbackRow }]}
        columns={logs.length > 0 ? [
          MonitorNameColumn,
          SignatureColumn,
          props.columns[0],
          ...props.columns.slice(1),
          ...(isAdmin ? [ActionColumn] : []),
        ] : [noRowsColumn]}
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
        getRowClassName={getRowClassName}
      />
      {showConfirmation && selectedOptions && (
        <div className="fixed bottom-4 left-1/2 h-fit w-[28rem] flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setShowConfirmation(false);
              setSelectedOptions({});
            }}
            className="h-12 w-36 text-white font-semibold bg-red-600 shadow-lg hover:bg-red-700 hover:scale-95"
          >
            cancel
          </button>
          <button
            onClick={handleAmmendSignature}
            className="h-12 w-36 text-white font-semibold bg-blue-600 shadow-lg hover:bg-blue-700 hover:scale-95"
          >
            confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default LogTable;
