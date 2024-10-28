"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// firestore functions
import { fetchAndPreviewFile } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";

// enums
import { AlertType } from "@/enums";

type Props = {
  columns: GridColDef[];
  rows: string[];
  trialId: string;
};

const RegulatoryDocTable = (props: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const currentPathname = usePathname();
  const [setAlert] = useAlertStore((state) => [state.setAlert]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [docs, setDocs] = useState<
    { id: number; originalId: string; fileName: string }[]
  >([]);

  const formatString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  useEffect(() => {
    if (props.rows) {
      // Structure the rows to have the 'fileName' property
      const newDocs = props.rows.map((doc, index) => ({
        id: index,
        originalId: doc,
        fileName: formatString(doc),
      }));
      setDocs(newDocs);
    }
  }, [props]);

  const handleRowClick = async (params: any) => {
    const regDocId = docs[params.row.id]?.originalId;
    const basePath = `/monitoringLogs/${props.trialId}/regulatoryDocs`;

    if (currentPathname === basePath) {
      if (regDocId) {
        router.push(
          `/monitoringLogs/${props.trialId}/regulatoryDocs/${regDocId}/files`
        );
      }
    } else {
      const folderName = currentPathname.split("/").slice(-2, -1)[0];
      const fileUrl = await fetchAndPreviewFile(
        user?.orgId as string,
        props.trialId,
        folderName,
        regDocId
      );
      if (fileUrl) {
        // Open the file URL in a new tab
        const newTab = window.open(fileUrl, "_blank");

        // Check if the new tab was blocked
        if (newTab) {
          newTab.focus(); // Bring the new tab into focus
        } else {
          alert("Please allow popups for this website to view the file."); // Alert if the popup is blocked
        }
      }
    }
  };

  return (
    <div className="w-full flex items-center">
      <DataGrid
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4 cursor-pointer"
        rows={docs}
        columns={[...props.columns]}
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
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default RegulatoryDocTable;
