"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// firestore functions
import { fetchAndPreviewFile, getFileMetadata } from "@/firebase";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";

// custom hooks
import useUser from "@/hooks/UseUser";

// global store
import LoadingStore from "@/store/LoadingStore";

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
  const [docs, setDocs] = useState<
    {
      id: number;
      originalId: string;
      fileName: string;
      uploadedBy?: string;
      uploadedAt?: string;
    }[]
  >([]);
  const folderName = currentPathname.split("/").slice(-2, -1)[0];

  const formatString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.rows && user) {
        const newDocs = await Promise.all(
          props.rows.map(async (doc, index) => {
            const fileName = doc; // Assuming doc is the file name
            const metadata = await getFileMetadata(
              user.orgId,
              props.trialId,
              folderName,
              fileName
            ); // Get metadata for each file

            return {
              id: index,
              originalId: fileName,
              fileName: formatString(fileName),
              uploadedBy: metadata?.customMetadata?.uploadedBy || "Unknown",
              uploadedAt: metadata?.customMetadata?.uploadedAt || "Not specified",
            };
          })
        );

        setDocs(newDocs);
      }
    };

    fetchData();
  }, [props, user?.orgId, props.trialId, folderName]);

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
      const fileUrl = await fetchAndPreviewFile(
        user?.orgId as string,
        props.trialId,
        folderName,
        regDocId
      );
      if (fileUrl) {
        props.setShowDocument?.(true);
        props.setDocumentURL?.(fileUrl);
        setLoading(true);
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
