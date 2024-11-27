"use client";

// react/nextjs components
import React, { useState, useEffect, useRef } from "react";

// firestore functions
import { getTrials, getUserFromDb, updateUserLastActivity } from "@/firebase";

// global store
import LoadingStore from "@/store/LoadingStore";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// custom hooks
import useUser from "@/hooks/UseUser";

// custom components
import MonitoringLogTable from "@/components/MonitoringLogTable";

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

const MonitoringLogsPage = () => {
  const { user } = useUser();
  const [updatedUser, setUpdatedUser] = useState<User>();
  const { setLoading } = LoadingStore();
  const [trials, setTrials] = useState<TrialDetails[]>([]);

  useEffect(() => {
    if (user) {
      getUserFromDb(user?.userId).then((response) => {
        const user = response?.data ?? null;
        setUpdatedUser(user);
      });
    }
  }, [user]);

  // Update the state with the imported data
  useEffect(() => {
    setLoading(true);
    if (user) {
      getTrials(user?.orgId).then((response) => {
        setTrials(response.data);
        setLoading(false);
      });
    }

    if (user && user.userId) {
      updateUserLastActivity(user.userId)
        .then(() => {})
        .catch((error) => {});
    }
  }, [user]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-start">
      <div className="w-[95%] flex flex-col items-center justify-center gap-8">
        <MonitoringLogTable
          columns={columns}
          rows={trials}
          orgId={user?.orgId ?? ""}
        />
      </div>
    </div>
  );
};

export default MonitoringLogsPage;
