"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";

//components
import TrialTable from "@/components/Mui/TrialTable";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// lib assets
import TrialsData from "@/lib/trialData.json";

type TrialsFormatted = {
  [id: number]: TrialData;
};

const columns: GridColDef[] = [
  {
    field: "investigatorName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Investigator Name",
    flex: 1,
  },
  {
    field: "protocol",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Protocol",
    flex: 1,
  },
  {
    field: "siteVisit",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Site Visit",
    flex: 1,
  },
];

const TrialsPage = () => {
  const [trialData, setTrialData] = useState<TrialsFormatted>({});
  const [trials, setTrials] = useState<TrialData[]>([]);

  // Update the state with the imported JSON data
  useEffect(() => {
    const formattedData: TrialsFormatted = {};
    TrialsData.forEach((trial: TrialData) => {
      formattedData[trial.id] = trial;
    });
    setTrials(TrialsData);
    setTrialData(formattedData);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10 px-20">
      <h1 className="text-3xl text-blue-500 font-bold">Current Trials</h1>
      <TrialTable columns={columns} rows={trials} />
    </div>
  );
};

export default TrialsPage;
