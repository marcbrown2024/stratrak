"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";

// firestore functions
import { getTrials } from "@/firebase";

//components
import TrialTable from "@/components/TrialTable";
import Loader from "@/components/Loader";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

import { useAuth } from "@/components/AuthProvider";

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

const ActiveTrialsPage = () => {
  const {user} = useAuth()
  const [trials, setTrials] = useState<TrialDetails[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state with the imported data
  useEffect(() => {
    getTrials(user?.orgId)
    .then(response => {
      setTrials(response.data)
      setLoading(false)
    })
  }, [user]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      {
        loading ?
        <Loader />
        :
        <TrialTable columns={columns} rows={trials} filter="Active" orgId={user?.orgId} />
      }
    </div>
  );
};

export default ActiveTrialsPage;
