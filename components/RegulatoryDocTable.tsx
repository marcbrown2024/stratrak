"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// firestore functions
import {
  deleteFile,
  deleteFolder,
  fetchAndPreviewFile,
  getFileMetadata,
} from "@/firebase";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";
import Tooltip from "@mui/material/Tooltip";

// custom hooks
import useUser from "@/hooks/UseUser";

// global store
import { useAlertStore } from "@/store/AlertStore";
import LoadingStore from "@/store/LoadingStore";

// enums
import { AlertType } from "@/enums";

//icons
import { MdDelete } from "react-icons/md";
import { FaFileCircleMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

type Props = {
  columns: GridColDef[];
  rows: string[];
  trialId: string;
  setShowDocument?: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentURL?: React.Dispatch<React.SetStateAction<string>>;
};

const RegulatoryDocTable = (props: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const currentPathname = usePathname();
  const { setLoading } = LoadingStore();
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  const [deleteRow, setDeleteRow] = useState<boolean>(false);
  const [docs, setDocs] = useState<
    {
      id: number;
      originalId: string;
      fileName: string;
      uploadedBy?: string;
      uploadedAt?: string;
    }[]
  >([]);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const folderName = currentPathname.split("/").slice(-2, -1)[0];

  const formatString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };

  const handleSetDelete = (id: number) => {
    setActiveRowId(id);
    setDeleteRow(true);
  };

  const handleDeleteRow = async (id: number) => {
    closeAlert();
    // Check if currentPathname indicates a file or regulatoryDocs folder
    const lastPathSegment = currentPathname.split("/").pop();
    const regDocId = docs[id].originalId;

    try {
      if (lastPathSegment === "files") {
        // Delete a specific file
        const fileDeleted = await deleteFile(
          user?.orgId as string,
          props.trialId,
          folderName,
          regDocId
        );
        if (fileDeleted) {
          setAlert(
            {
              title: "Success!",
              content: `File "${regDocId}" deleted successfully.`,
            },
            AlertType.Success
          );
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setAlert(
            {
              title: "Error!",
              content: `Failed to delete file "${regDocId}".`,
            },
            AlertType.Success
          );
        }
      } else if (lastPathSegment === "regulatoryDocs") {
        // Delete a specific folder
        const folderDeleted = await deleteFolder(
          user?.orgId as string,
          props.trialId,
          regDocId
        );
        if (folderDeleted) {
          setAlert(
            {
              title: "Success!",
              content: `Folder "${regDocId}" deleted successfully.`,
            },
            AlertType.Success
          );
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setAlert(
            {
              title: "Error!",
              content: `Failed to delete folder "${regDocId}".`,
            },
            AlertType.Success
          );
        }
      }
    } catch (error) {
      setAlert(
        {
          title: "Error!",
          content: `An error occurred during the deletion process.`,
        },
        AlertType.Success
      );
    }
  };

  useEffect(() => {
    const shouldSkipMetadataFetch =
      currentPathname.includes(`/monitoringLogs/${props.trialId}`) &&
      currentPathname.endsWith("/files");

    const fetchData = async () => {
      if (props.rows && user) {
        const newDocs = await Promise.all(
          props.rows.map(async (doc, index) => {
            const fileName = doc;
            if (shouldSkipMetadataFetch) {
              const metadata = await getFileMetadata(
                user.orgId,
                props.trialId,
                folderName,
                fileName
              );

              return {
                id: index,
                originalId: fileName,
                fileName: formatString(fileName),
                uploadedBy: metadata?.customMetadata?.uploadedBy || "Unknown",
                uploadedAt:
                  metadata?.customMetadata?.uploadedAt || "Not specified",
              };
            }

            return {
              id: index,
              originalId: fileName,
              fileName: formatString(fileName),
              // uploadedBy: metadata?.customMetadata?.uploadedBy || "Unknown",
              // uploadedAt: metadata?.customMetadata?.uploadedAt || "Not specified",
            };
          })
        );

        setDocs(newDocs);
      }
    };

    fetchData();
  }, [props, user?.orgId, props.trialId, folderName]);

  const handleRowClick = async (originalId: string) => {
    const basePath = `/monitoringLogs/${props.trialId}/regulatoryDocs`;

    if (currentPathname === basePath) {
      if (originalId) {
        router.push(
          `/monitoringLogs/${props.trialId}/regulatoryDocs/${originalId}/files`
        );
      }
    } else {
      const fileUrl = await fetchAndPreviewFile(
        user?.orgId as string,
        props.trialId,
        folderName,
        originalId
      );
      if (fileUrl) {
        props.setShowDocument?.(true);
        props.setDocumentURL?.(fileUrl);
        setLoading(true);
      }
    }
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
              isProgressActive ? "-translate-x-10" : "translate-x-0"
            } transition duration-300 ease-in-out`}
          >
            <Tooltip title="Delete File">
              <button
                type="button"
                onClick={() => handleSetDelete(id)}
                className="transition-transform duration-300 hover:scale-110"
              >
                <FaFileCircleMinus className="text-2xl text-[#cf3030]" />
              </button>
            </Tooltip>

            {isProgressActive && deleteRow ? (
              <div className="gap-3 flex">
                <Tooltip title="Delete">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(id)}
                    className="transition-transform duration-300 hover:scale-110"
                  >
                    <MdDelete className="text-2xl text-[#7d1f2e]" />
                  </button>
                </Tooltip>
                <Tooltip title="Cancel">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteRow(false);
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

  return (
    <div className="w-full flex items-center">
      <DataGrid
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4 cursor-pointer"
        rows={docs}
        columns={[
          ...props.columns,
          ...(user?.isAdmin ? [actionColumn] : []),
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        sortModel={[
          {
            field: "fileName",
            sort: "asc",
          },
        ]}
        slots={{ toolbar: CustomToolbar }}
        pageSizeOptions={[8]}
        disableMultipleRowSelection
        disableColumnMenu
        onCellClick={(params) => {
          const isActionColumn = params.field === "action";
          if (!isActionColumn) {
            handleRowClick(params.row.originalId);
          }
        }}
      />
    </div>
  );
};

export default RegulatoryDocTable;
