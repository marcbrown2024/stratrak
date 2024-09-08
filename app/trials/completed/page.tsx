"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";

// firestore functions
import { getTrials } from "@/firebase";

// global store
import LoadingStore from "@/store/LoadingStore";

//components
import TrialTable from "@/components/TrialTable";

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

const CompletedTrialsPage = () => {
  const { user } = useAuth();
  const { setLoading } = LoadingStore();
  const [trials, setTrials] = useState<TrialDetails[]>([]);

  // Update the state with the imported data
  useEffect(() => {
    setLoading(true);
    if (user) {
      getTrials(user?.orgId).then((response) => {
        setTrials(response.data);
        setLoading(false);
      });
    }
  }, [user?.orgId]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      <div className="flex flex-col items-center justify-center gap-8">
        <TrialTable
          columns={columns}
          rows={trials}
          filter="Completed"
          orgId={user?.orgId}
        />
      </div>
    </div>
  );
};

export default CompletedTrialsPage;
