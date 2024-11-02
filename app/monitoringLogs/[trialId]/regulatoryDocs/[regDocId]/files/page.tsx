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
import SiteNavBarStore from "@/store/SiteNavBarStore";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

//components
import RegulatoryDocTable from "@/components/RegulatoryDocTable";

// icons
import { IoCloseCircleSharp } from "react-icons/io5";

const columns: GridColDef[] = [
  {
    field: "fileName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "File Name",
    flex: 1,
  },
  {
    field: "uploadedBy",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Uploaded By",
    flex: 1,
  },
  {
    field: "uploadedAt",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Uploaded At",
    flex: 1,
  },
];

const RegDocFiles = () => {
  const { user } = useUser();
  const { trialId } = useParams();
  const { setLoading } = LoadingStore();
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [showDocument, setShowDocument] = useState<boolean>(false);
  const [documentURL, setDocumentURL] = useState<string>("");
  const { currentFolder } = SiteNavBarStore();

  const formatString = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const trialResponse = await getTrial(trialId as string);
      setTrial(trialResponse.data);

      const regDocsResponse = await fetchFilesInFolder(
        user?.orgId as string,
        trialId as string,
        currentFolder as string
      );
      const filteredFiles = regDocsResponse.filter(
        (fileName) => fileName !== ".placeholder"
      );
      setFileNames(filteredFiles);
      setLoading(false);
    };

    if (user?.orgId && trialId) {
      fetchFiles();
    }

  }, [user?.orgId, trialId, currentFolder]);

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
            <p>{formatString(currentFolder) || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <RegulatoryDocTable
          columns={columns}
          rows={fileNames}
          trialId={trialId as string}
          setShowDocument={setShowDocument}
          setDocumentURL={setDocumentURL}
        />
      </div>
      {showDocument && (
        <div className="fixed h-3/4 w-2/5 py-8">
          <iframe
            src={`${documentURL}`}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-2 border-black"
            title="Document Viewer"
          />
          <button
            onClick={() => setShowDocument(false)}
            className="absolute bottom-12 right-6 w-32 flex items-center justify-center gap-2 bg-white p-1 border shadow-md hover:scale-95"
          >
            <IoCloseCircleSharp size={40} color="#2563eb" />
            <span className="">Close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RegDocFiles;
