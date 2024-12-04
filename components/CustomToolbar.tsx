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

import ExcelJS from "exceljs";

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

  const handleExport = async () => {
    let title = "";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Monitoring Logs");

    // Define columns (you can modify this if needed)
    worksheet.columns = [
      { header: "Investigator Name", key: "investigatorName", width: 25 },
      { header: "Protocol", key: "protocol", width: 20 },
      { header: "Site Visit", key: "siteVisit", width: 20 },
      { header: "Monitor Name", key: "monitorName", width: 20 },
      { header: "Signature", key: "signature", width: 30 },
      { header: "Type of Visit", key: "typeOfVisit", width: 20 },
      { header: "Purpose of Visit", key: "purposeOfVisit", width: 30 },
      { header: "Date of Visit", key: "dateOfVisit", width: 20 },
    ];

    // Add data rows
    logs.forEach((log) => {
      const monitoringLog = monitoringlogs.find(
        (monLog) => monLog.id === log.trialId
      );

      // If no matching monitoring log is found, skip this row
      if (!monitoringLog) return;

      title = `${monitoringLog.investigatorName.replace(
        /\s/g,
        ""
      )}_${monitoringLog.protocol.replace(
        /\s/g,
        ""
      )}_${monitoringLog.siteVisit.replace(/\s/g, "")}`;

      worksheet.addRow({
        investigatorName: monitoringLog.investigatorName,
        protocol: monitoringLog.protocol,
        siteVisit: monitoringLog.siteVisit,
        monitorName: log.monitorName,
        signature: `Digitally signed by ${log.monitorName}, Date: ${log.dateOfVisit}`,
        typeOfVisit: log.typeOfVisit,
        purposeOfVisit: log.purposeOfVisit,
        dateOfVisit: log.dateOfVisit,
      });
    });

    // Remove empty rows
    worksheet.eachRow((row, rowNumber) => {
      let isRowEmpty = true;
      row.eachCell((cell) => {
        if (cell.value) {
          isRowEmpty = false;
        }
      });

      // If row is empty, remove it
      if (isRowEmpty) {
        worksheet.spliceRows(rowNumber, 1);
      }
    });

    // Set the header (this will be shown at the top of the page when printing or viewing)
    const headerText = `Monitoring_Log_${title}`;
    worksheet.headerFooter.oddHeader = `&C${headerText}`; // Center the header text

    // Set the footer with justified alignment:
    const footerDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const footerText = `Monitoring Visit Log v${footerDate}`;

    // Set footer with justified alignment
    worksheet.headerFooter.oddFooter = `&L${footerText}       &RTrialist`;

    // Save as .xlsx file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Monitoring_Log_${title}.xlsx`;
    link.click();
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
            {user?.isAdmin && (
              <Button
                variant="contained"
                style={{ backgroundColor: "#384151", color: "#fff" }}
                onClick={() => setIsOpen(true)}
              >
                {isOpen ? "Cancel" : "Ammend Log"}
              </Button>
            )}
          </>
        )
      )}
    </div>
  );
};

export default CustomToolbar;
