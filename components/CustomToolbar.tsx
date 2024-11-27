// react/nextjs components
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

// firebase components
import {
  downloadFolderAsZip,
  getLogs,
  getTrial,
  getTrials,
  uploadFilesToFolder,
} from "@/firebase";

// mui components
import {
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  useGridApiContext,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";

// custom hooks
import useUser from "@/hooks/UseUser";

// global store
import { useAlertStore } from "@/store/AlertStore";
import AddNewFolderStore from "@/store/AddNewFolderStore";
import AdminPopupStore from "@/store/AdminPopupStore";

// enums
import { AlertType } from "@/enums";

// icons
import { FiDownload } from "react-icons/fi";

const CustomToolbar = () => {
  const { user } = useUser();
  const { trialId } = useParams();
  const currentPathname = usePathname();
  const apiRef = useGridApiContext();
  const { setVisibility } = AddNewFolderStore();
  const { isOpen, setIsOpen } = AdminPopupStore();
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [monitoringlogs, setMonitoringlogs] = useState<TrialDetails[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleDownload = async () => {
    const trialResponse = await getTrial(trialId as string);

    if (user && trialResponse.data) {
      try {
        const { investigatorName, protocol, siteVisit } = trialResponse.data;

        await downloadFolderAsZip(
          user.orgId,
          trialId as string,
          `${investigatorName.trim().replace(/ /g, "_")}_${protocol
            .trim()
            .replace(/ /g, "_")}_${siteVisit.trim().replace(/ /g, "_")}`
        );

        setAlert(
          { title: "Success!", content: "Download was successful." },
          AlertType.Success
        );
      } catch (error) {
        setAlert(
          { title: "Error!", content: `Failed to download files: ${error}` },
          AlertType.Error
        );
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    closeAlert();
    const files = event.target.files;
    const folderName = currentPathname.split("/").slice(-2, -1)[0];

    if (user && files) {
      const invalidFiles = [];

      // Check if all files are PDFs
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== "application/pdf") {
          invalidFiles.push(files[i].name);
        }
      }

      if (invalidFiles.length > 0) {
        const fileMessage =
          invalidFiles.length === 1
            ? `The following file is not a PDF: ${invalidFiles[0]}`
            : `The following files are not PDFs: ${invalidFiles.join(", ")}`;

        setAlert({ title: "Info!", content: fileMessage }, AlertType.Info);
        return;
      }

      try {
        await uploadFilesToFolder(
          folderName,
          trialId as string,
          user.orgId,
          files,
          { fName: user.fName, lName: user.lName }
        );
        setAlert(
          { title: "Success!", content: "Files were uploaded successfully." },
          AlertType.Success
        );
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setAlert(
          { title: "Error!", content: `Failed to upload files: ${error}` },
          AlertType.Error
        );
      }
    }
  };

  useEffect(() => {
    getTrials(user?.orgId as string).then((response) => {
      setMonitoringlogs(response.data);
    });
    getLogs(trialId as string).then((response) => {
      setLogs(response.data);
    });
  }, [trialId, user?.orgId]);

  const isAdminAndTrialPath =
    user?.isAdmin && currentPathname === "/monitoringLogs";
  const isLogPath = currentPathname === `/monitoringLogs/${trialId}/logs`;

  const handleEDocsExport = () => {
    if (apiRef.current) {
      apiRef.current.exportDataAsCsv({
        fileName: "trialist_studies.csv",
      });
    }
  };

  const handleExport = () => {
    let title = "";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Investigator Name,Protocol,Site Visit,Monitor Name,Signature,Type of Visit,Purpose of Visit,Date of Visit\n" +
      logs
        .map((log) => {
          // Find the specific monitoring log that matches the log's trialId
          const monitoringLog = monitoringlogs.find(
            (monLog) => monLog.id === log.trialId
          );

          // If no matching monitoring log is found, return an empty row
          if (!monitoringLog) {
            return "";
          }

          title = `${monitoringLog.investigatorName.replace(
            /\s/g,
            ""
          )}_${monitoringLog.protocol.replace(
            /\s/g,
            ""
          )}_${monitoringLog.siteVisit.replace(/\s/g, "")}`;

          return `"${monitoringLog.investigatorName}","${monitoringLog.protocol}","${monitoringLog.siteVisit}","${log.monitorName}","Digitally signed by ${log.monitorName}, Date: ${log.dateOfVisit}","${log.typeOfVisit}","${log.purposeOfVisit}","${log.dateOfVisit}"`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-between items-center gap-8">
      <div className="flex-1">
        <GridToolbarQuickFilter debounceMs={100} />
      </div>
      <div className="flex gap-1 opacity-70">
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {currentPathname == `/monitoringLogs` && (
          <Button
            onClick={handleEDocsExport}
            className="flex items-center justify-center gap-2"
          >
            <FiDownload size={20} />
            Download
          </Button>
        )}
        {currentPathname === `/monitoringLogs/${trialId}/logs` && (
          <Button
            onClick={handleExport}
            className="flex items-center justify-center gap-2"
          >
            <FiDownload size={20} />
            Download
          </Button>
        )}
      </div>
      {currentPathname === `/monitoringLogs/${trialId}/regulatoryDocs` && (
        <>
          <Button
            onClick={handleDownload}
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            Download
          </Button>
          {user?.isAdmin && (
            <Button
              onClick={() => setVisibility(true)}
              variant="contained"
              style={{ backgroundColor: "#007bff", color: "#fff" }}
            >
              New Folder
            </Button>
          )}
        </>
      )}

      <>
        {currentPathname.includes(`/monitoringLogs/${trialId}`) &&
          currentPathname.endsWith("/files") &&
          user?.isAdmin && (
            <>
              <Button
                variant="contained"
                style={{ backgroundColor: "#007bff", color: "#fff" }}
                onClick={handleUploadClick} // Trigger the file input
              >
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef} // Attach the ref
                onChange={handleFileChange} // Handle file selection
                style={{ display: "none" }} // Hide the file input
                multiple // Allow multiple file selection
              />
            </>
          )}
      </>

      {isAdminAndTrialPath ? (
        <Link href="/monitoringLogs/createMonitoringLog">
          <Button
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            Add Monitoring Log
          </Button>
        </Link>
      ) : (
        isLogPath && (
          <>
            <Link href={`/monitoringLogs/${trialId}/logs/createLog`}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#007bff", color: "#fff" }}
              >
                Add Log
              </Button>
            </Link>
            {user?.isAdmin && <Button
              variant="contained"
              style={{ backgroundColor: "#384151", color: "#fff" }}
              onClick={() => setIsOpen(true)}
            >
              {isOpen ? "Cancel" : "Ammend Log"}
            </Button>}
            
          </>
        )
      )}
    </div>
  );
};

export default CustomToolbar;
