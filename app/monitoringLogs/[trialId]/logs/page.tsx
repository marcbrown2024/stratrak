"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// firestore functions
import { getLogs } from "@/firebase";

// global store
import LoadingStore from "@/store/LoadingStore";
import useSignatureStore from "@/store/SignatureStore";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

//components
import LogTable from "@/components/LogTable";
import SignaturePopUp from "@/components/SignaturePopUp";

const columns: GridColDef[] = [
  {
    field: "typeOfVisit",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Type Of Visit",
    flex: 1,
  },
  {
    field: "purposeOfVisit",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Purpose Of Visit",
    flex: 1,
  },
  {
    field: "dateOfVisit",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Date Of Visit",
    flex: 1,
  },
];

const LogsPage = () => {
  const { trialId } = useParams();
  const { setLoading } = LoadingStore();
  const [logs, setLogs] = useState<LogDetails[]>([]);

  const { visible } = useSignatureStore((state) => ({
    selectedRow: state.selectedRow,
    visible: state.visible,
  }));

  // Update the state with the imported data
  useEffect(() => {
    setLoading(true);
    getLogs(trialId as string).then((response) => {
      setLogs(response.data);
      setLoading(false);
    });
  }, [trialId]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center gap-8">
        <LogTable columns={columns} rows={logs} trialId={trialId as string} />
      </div>
      {visible && (
        <div className="fixed h-full w-full flex items-center justify-center bg-slate-50 opacity-95">
          <SignaturePopUp />
        </div>
      )}
    </div>
  );
};

export default LogsPage;