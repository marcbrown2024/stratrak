// react/nextjs components
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

// firebase components
import { uploadFilesToFolder, getLogs, getTrials } from "@/firebase";

// mui components
import {
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";

// custom hooks
import useUser from "@/hooks/UseUser";

// global store
import { useAlertStore } from "@/store/AlertStore";
import AddNewFolderStore from "@/store/AddNewFolderStore";

// enums
import { AlertType } from "@/enums";

// icons
import { FiDownload } from "react-icons/fi";

const CustomToolbar = () => {
  const { user } = useUser();
  const { trialId } = useParams();
  const currentPathname = usePathname();
  const { setVisibility } = AddNewFolderStore();
  const [logs, setLogs] = useState<LogDetails[]>([]);
  const [monitoringlogs, setMonitoringlogs] = useState<TrialDetails[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    const folderName = currentPathname.split("/").slice(-2, -1)[0]; // Extract the folder name from the pathname

    if (files) {
      if (user && files) {
        try {
          await uploadFilesToFolder(
            folderName,
            trialId as string,
            user.orgId,
            files
          );
          setAlert(
            { title: "Success!", content: "Files were uploaded successfully." },
            AlertType.Success
          );
        } catch (error) {
          setAlert(
            { title: "Error!", content: `Failed to upload files: ${error}` },
            AlertType.Error
          );
        }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Calculate the timezone offset in minutes and convert it to hours and minutes
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetHours = String(
      Math.floor(Math.abs(timezoneOffset) / 60)
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(
      2,
      "0"
    );

    // Format the timezone offset to match the format ±hh:mm
    const offsetSign = timezoneOffset >= 0 ? "+" : "-";

    return `${hours}:${minutes}:${seconds} ${offsetSign}${offsetHours}:${offsetMinutes}`;
  };

  const isAdminAndTrialPath =
    user?.isAdmin && currentPathname === "/monitoringLogs";
  const isLogPath = currentPathname === `/monitoringLogs/${trialId}/logs`;

  const exportFields: string[] =
    currentPathname === "/monitoringLogs"
      ? ["investigatorName", "protocol", "siteVisit"]
      : [];

  const handleExport = () => {
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

          return `"${monitoringLog.investigatorName}","${
            monitoringLog.protocol
          }","${monitoringLog.siteVisit}","${
            log.monitorName
          }","Digitally signed by ${log.monitorName}, Date: ${formatDate(
            log.dateOfVisit
          )}, Time: ${formatTime(log.dateOfVisit)}","${log.typeOfVisit}","${
            log.purposeOfVisit
          }","${log.dateOfVisit}"`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `log-${trialId}.csv`);
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
          <GridToolbarExport
            printOptions={{ fields: exportFields }}
            csvOptions={{ fields: exportFields }}
          />
        )}
        {currentPathname === `/monitoringLogs/${trialId}/logs` && (
          <Button
            onClick={handleExport}
            className="flex items-center justify-center gap-2"
          >
            <FiDownload size={20} />
            Export
          </Button>
        )}
      </div>
      {currentPathname === `/monitoringLogs/${trialId}/regulatoryDocs` && (
        <>
          <Link href={`/monitoringLogs/${trialId}/regulatoryDocs/upload`}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#007bff", color: "#fff" }}
            >
              Download
            </Button>
          </Link>
          <Button
            onClick={() => setVisibility(true)}
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            New Folder
          </Button>
        </>
      )}

      <>
        {currentPathname.includes(`/monitoringLogs/${trialId}`) &&
          currentPathname.endsWith("/files") && (
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
          <Link href={`/monitoringLogs/${trialId}/logs/createLog`}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#007bff", color: "#fff" }}
            >
              Add Log
            </Button>
          </Link>
        )
      )}
    </div>
  );
};

export default CustomToolbar;
