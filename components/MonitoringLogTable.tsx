"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";

// firebase components/functions
import { deleteTrial, getTrials, updateTrialProgress } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";
import Tooltip from "@mui/material/Tooltip";

// enums
import { AlertType } from "@/enums";

//icons
import { FaFolderOpen } from "react-icons/fa6";
import { MdFolderDelete, MdCancel, MdDelete } from "react-icons/md";
import { TbAdjustmentsCheck } from "react-icons/tb";
import { FaCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import useUser from "@/hooks/UseUser";

type Props = {
  columns: GridColDef[];
  rows: TrialDetails[];
  filter?: string;
  orgId: string;
};

const MonitoringLogTable = (props: Props) => {
  const { user } = useUser();
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteTrialRow, setDeleteTrialRow] = useState<boolean>(false);
  const [changeProgress, setChangeProgress] = useState<boolean>(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredRows, setFilteredRows] = useState<TrialDetails[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>();

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  useEffect(() => {
    if (props.rows.length > 0) {
      setLoading(false);
      setFilteredRows(
        props.filter
          ? props.rows.filter((row) => row.progress === props.filter)
          : props.rows
      );
    }
  }, [props]);

  const handleChangeProgress = (id: number) => {
    setActiveRowId(id);
    setChangeProgress(true);
  };

  const handleSetDelete = (id: number) => {
    setActiveRowId(id);
    setDeleteTrialRow(true);
  };

  const handleDeleteTrial = (id: number) => {
    closeAlert();
    deleteTrial(id.toString()).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "Monitoring log was deleted successfully.",
        };
        alertType = AlertType.Success;
        getTrials(props.orgId).then((response) => {
          if (response.success) {
            setFilteredRows(response.data);
          }
        });
      } else {
        alert = {
          title: "Error!",
          content: "Could not delete monitoring log. Please try again",
        };
        alertType = AlertType.Error;
      }
      setAlert(alert, alertType);
    });
    setActiveRowId(null);
  };

  const handleSetProgress = (id: number, progressStatus: string) => {
    closeAlert();
    updateTrialProgress(id.toString(), progressStatus).then((response) => {
      let alert: AlertBody;
      let alertType: AlertType;

      if (response.success) {
        alert = {
          title: "Success!",
          content: "Monitoring log progress was updated successfully.",
        };
        alertType = AlertType.Success;
        getTrials(props.orgId).then((response) => {
          if (response.success) {
            setFilteredRows(response.data);
          }
        });
      } else {
        alert = {
          title: "Error!",
          content:
            "Could not update monitoring log's progress. Please try again",
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
              isProgressActive ? "-translate-x-28" : "translate-x-0"
            } transition duration-300 ease-in-out`}
          >
            {!isAdmin &&
            (props.filter === "Inactive" || props.filter === "Completed") ? (
              <span>No actions available</span>
            ) : (
              <Tooltip title="Go to logs">
                <Link href={`/monitoringLogs/${id}/logs`} className="flex">
                  <button
                    type="button"
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <FaFolderOpen className="text-2xl text-[#ec8e36]" />
                  </button>
                </Link>
              </Tooltip>
            )}
            {isAdmin && (
              <>
                <Tooltip title="Delete monitoring log">
                  <button
                    type="button"
                    onClick={() => {
                      handleSetDelete(id);
                      setChangeProgress(false);
                    }}
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <MdFolderDelete className="text-2xl text-[#cf3030]" />
                  </button>
                </Tooltip>
                <Tooltip title="Change Progress">
                  <button
                    type="button"
                    onClick={() => {
                      handleChangeProgress(id);
                      setDeleteTrialRow(false);
                    }}
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <TbAdjustmentsCheck className="text-2xl text-[#3591e7]" />
                  </button>
                </Tooltip>
              </>
            )}
            {
              <>
                {/* ----------------------------------------------------------- */}
                <div
                  className={`gap-3 ${
                    isProgressActive && deleteTrialRow ? "flex" : "hidden"
                  }`}
                >
                  <Tooltip title="Delete">
                    <button
                      type="button"
                      onClick={() => handleDeleteTrial(id)}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <MdDelete className="text-2xl text-[#7d1f2e]" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTrialRow(false);
                        setActiveRowId(null);
                      }}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <IoClose className="text-2xl" />
                    </button>
                  </Tooltip>
                </div>
                {/* ----------------------------------------------------------- */}
                <div
                  className={`gap-3 ${
                    isProgressActive && changeProgress ? "flex" : "hidden"
                  }`}
                >
                  <Tooltip title="Inactive">
                    <button
                      type="button"
                      onClick={() => handleSetProgress(id, "Inactive")}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <FaCircle className="text-2xl text-gray-300" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Active">
                    <button
                      type="button"
                      onClick={() => handleSetProgress(id, "Active")}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <FaCircle className="text-2xl text-green-400" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Completed">
                    <button
                      type="button"
                      onClick={() => handleSetProgress(id, "Completed")}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <FaCircle className="text-2xl text-[#1286ff]" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <button
                      type="button"
                      onClick={() => {
                        setChangeProgress(false);
                        setActiveRowId(null);
                      }}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      <MdCancel className="text-[27px] text-red-600" />
                    </button>
                  </Tooltip>
                </div>
              </>
            }
          </div>
        </div>
      );
    },
  };

  return (
    <div className="w-full flex items-center">
      <DataGrid
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4"
        rows={filteredRows}
        columns={[...props.columns, actionColumn]}
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
        autoHeight
      />
    </div>
  );
};

export default MonitoringLogTable;
