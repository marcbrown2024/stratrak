"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

//components
import LogTable from "@/components/Mui/LogTable";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// lib assets
import TrialLogsData from "@/lib/trialLogs.json";

type TrialLogsFormatted = {
  [id: number]: TrialLog;
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    headerName: "Log ID",
    width: 90,
  },
  {
    field: "monitorName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Monitor Name",
    flex: 1,
  },
  {
    field: "signature",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Signature",
    flex: 1,
  },
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
    type: "date",
    headerName: "Date Of Visit",
    flex: 1,
  },
];

const TrialsPage = () => {
  const { trialId } = useParams();
  const [trialData, setTrialData] = useState<TrialLogsFormatted>({});
  const [trials, setTrials] = useState<TrialLog[]>([]);

  // Update the state with the imported JSON data
  useEffect(() => {
    const formattedData: TrialLogsFormatted = {};
    const formattedTrials: TrialLog[] = TrialLogsData.map((log: any) => ({
      ...log,
      dateOfVisit: new Date(log.dateOfVisit), // Convert string to Date object
    }));

    formattedTrials.forEach((log) => {
      formattedData[log.id] = log;
    });

    setTrials(formattedTrials);
    setTrialData(formattedData);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10 px-20">
      <h1 className="text-3xl text-blue-500 font-bold">
        Trial Id# {trialId} Logs
      </h1>
      {trialId ? (
        <div className="flex flex-col items-center justify-center gap-8">
          <LogTable columns={columns} rows={trials} />
          <Link
            className="text-white font-bold bg-blue-500 rounded-full px-4 py-2 hover:opacity-90"
            href={`/trials/${trialId}/logs/create`}
            rel="noopener noreferrer"
          >
            Add Log
          </Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TrialsPage;
