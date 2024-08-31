"use client";

// react/nextjs components
import React from "react";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/mui/CustomToolbar";

type Props = {
  columns: GridColDef[];
  rows: object[];
};

const TrialTable = (props: Props) => {
  return (
    <div className="h-fit w-[80rem]">
      <DataGrid
        className="p-8 gap-4"
        rows={props.rows}
        columns={[...props.columns]}
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

export default TrialTable;
