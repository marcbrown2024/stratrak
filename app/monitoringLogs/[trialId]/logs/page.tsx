"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// firestore functions
import { getLogs, getTrial } from "@/firebase";

// global store
import LoadingStore from "@/store/LoadingStore";
import useSignatureStore from "@/store/SignatureStore";
import AdminPopupStore from "@/store/AdminPopupStore";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

// custom components
import LogTable from "@/components/LogTable";
import SignaturePopUp from "@/components/SignaturePopUp";
import AdminPopup from "@/components/AdminPopup";

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
  const { isOpen } = AdminPopupStore();
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails);
  const [logs, setLogs] = useState<LogDetails[]>([]);

  const { visible } = useSignatureStore((state) => ({
    selectedRow: state.selectedRow,
    visible: state.visible,
  }));

  // Update the state with the imported data
  useEffect(() => {
    setLoading(true);
    getTrial(trialId as string).then((response) => {
      setTrial(response.data);
      setLoading(false);
    });
    getLogs(trialId as string).then((response) => {
      setLogs(response.data);
      setLoading(false);
    });
  }, [trialId]);

  return (
    <div className="relative h-full w-full space-y-10">
      <div className="w-[96%] h-fit flex items-start justify-start mx-auto">
        <div className="w-full sm:w-fit flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-white px-4 sm:px-8 py-2 rounded-lg border">
          <div className="font-bold text-gray-500">
            <p>Investigator Name:</p>
            <p>Protocol:</p>
            <p>Site Visit:</p>
          </div>
          <div className="flex flex-col">
            <p>{trial?.investigatorName || "N/A"}</p>
            <p>{trial?.protocol || "N/A"}</p>
            <p>{trial?.siteVisit || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="w-[96%] flex flex-col items-center justify-center gap-8 mx-auto">
        <LogTable columns={columns} rows={logs} trialId={trialId as string} />
      </div>
      {visible && (
        <div className="fixed top-4 right-0 h-full w-[calc(100%-12rem)] xl:w-[calc(100%-18rem)] flex items-center justify-center bg-white/50">
          <SignaturePopUp />
        </div>
      )}

      {isOpen && <AdminPopup />}
    </div>
  );
};

export default LogsPage;
