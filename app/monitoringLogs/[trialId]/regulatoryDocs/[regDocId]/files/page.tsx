"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// firestore functions
import { fetchFilesInFolder, getTrial } from "@/firebase";

// custom hooks
import useUser from "@/hooks/UseUser";

// global store
import LoadingStore from "@/store/LoadingStore";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

//components
import RegulatoryDocTable from "@/components/RegulatoryDocTable";

const columns: GridColDef[] = [
  {
    field: "fileName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "File Name",
    flex: 1,
  },
];

const RegDocFiles = () => {
  const { user } = useUser();
  const { trialId, regDocId } = useParams<{
    trialId: string;
    regDocId: string;
  }>();
  const { setLoading } = LoadingStore();
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const formatString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const trialResponse = await getTrial(trialId as string);
      setTrial(trialResponse.data);
      const regDocsResponse = await fetchFilesInFolder(
        user?.orgId as string,
        trialId as string,
        regDocId as string
      );
      const filteredFiles = regDocsResponse.filter(
        (fileName) => fileName !== ".placeholder"
      );
      setFileNames(filteredFiles);
      setLoading(false);
    };

    if (user?.orgId && trialId) {
      fetchData();
    }
  }, [user?.orgId, trialId]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-start gap-10">
      <div className="h-fit w-[60rem] 2xl:w-[80rem] flex items-start justify-start">
        <div className="w-full sm:w-fit flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-white px-4 sm:px-8 py-2 rounded-lg border">
          <div className="font-bold text-gray-500">
            <p>Investigator Name:</p>
            <p>Protocol:</p>
            <p>Site Visit:</p>
            <p>Regulatory Document:</p>
          </div>
          <div className="flex flex-col">
            <p>{trial?.investigatorName || "N/A"}</p>
            <p>{trial?.protocol || "N/A"}</p>
            <p>{trial?.siteVisit || "N/A"}</p>
            <p>{formatString(regDocId) || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <RegulatoryDocTable
          columns={columns}
          rows={fileNames}
          trialId={trialId as string}
        />
      </div>
    </div>
  );
};

export default RegDocFiles;
