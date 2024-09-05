"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

//components
import LogTable from "@/components/LogTable";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// firestore functions
import { getLogs } from "@/firebase";
import Loader from "@/components/Loader";

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
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state with the imported data
  useEffect(() => {
    getLogs(trialId as string).then((response) => {
      setLogs(response.data);
      setLoading(false);
    });
  }, [trialId]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center gap-8">
        {loading ? (
          <Loader />
        ) : (
          <LogTable columns={columns} rows={logs} trialId={trialId as string} />
        )}
      </div>
    </div>
  );
};

export default LogsPage;
