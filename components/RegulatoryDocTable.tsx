"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Image from "next/image";

// firebase components/functions
import { deleteLog, getLogs } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";
import useSignatureStore from "@/store/SignatureStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// mui components
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomToolbar from "@/components/CustomToolbar";

// enums
import { AlertType } from "@/enums";

type Props = {
  columns: GridColDef[];
  rows: LogDetails[];
  trialId: string;
};

const RegulatoryDocTable = (props: Props) => {
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


  return (
    <div className="w-full flex items-center">
      <DataGrid<LogDetails>
        className="h-fit w-[60rem] 2xl:w-[80rem] p-6 gap-4"
        rows={logs}
        columns={[
          props.columns[0],
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

export default RegulatoryDocTable;
