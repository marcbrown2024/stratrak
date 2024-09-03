"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";

//components
import TrialTable from "@/components/TrialTable";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// firestore functions
import { getTrials } from "@/firebase";
import Loader from "@/components/Loader";

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
  {
    field: "progress",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Progress",
    flex: 1,
  },
];

const TrialsPage = () => {
  const [trials, setTrials] = useState<TrialDetails[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state with the imported data
  useEffect(() => {
    getTrials()
    .then(response => {
      setTrials(response.data)
      setLoading(false)
    })
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      {
        loading ?
        <Loader />
        :
        <TrialTable columns={columns} rows={trials} />
      }
    </div>
  );
};

export default TrialsPage;
