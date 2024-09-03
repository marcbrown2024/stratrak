"use client";

// react/nextjs components
import React from "react";
import { useRouter } from "next/navigation";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";
import Tooltip from "@mui/material/Tooltip";

//icons
import { FaFolderOpen } from "react-icons/fa6";

type Props = {
  columns: GridColDef[];
  rows: object[];
};

const TrialTable = (props: Props) => {
  const router = useRouter();

  const handleRowClick = (id: number) => {
    if (id) {
      router.push(`/trials/${id}/logs`);
    }
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Action",
    headerAlign: "left",
    flex: 1,
    renderCell: (params) => {
      return (
        <div className="h-full w-full flex items-center justify-start">
          <Tooltip title="Open logs">
            <button type="button" onClick={() => handleRowClick(params.row.id)}>
              <FaFolderOpen className="text-lg text-[#ec8e36]" />
            </button>
          </Tooltip>
        </div>
      );
    },
  };

  return (
    <div className="h-fit w-[80rem]">
      <DataGrid
        className="p-8 gap-4"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        pageSizeOptions={[15]}
        disableMultipleRowSelection
        disableColumnMenu
      />
    </div>
  );
};

export default TrialTable;
