// react/nextjs components
import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

// mui components
import {
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import useUser from "@/hooks/UseUser";

const CustomToolbar = () => {
  const {user} = useUser()
  const { trialId } = useParams();
  const currentPathname = usePathname();

  const isAdminAndTrialPath =
    user?.isAdmin && currentPathname === "/monitoringLogs";
  const isLogPath = currentPathname === `/monitoringLogs/${trialId}/logs`;

  const exportFields =
    currentPathname === "/monitoringLogs"
      ? ["investigatorName", "protocol", "siteVisit"]
      : currentPathname === `/monitoringLogs/${trialId}/logs` && [
          "monitorName",
          "digitalSignature",
          "typeOfVisit",
          "purposeOfVisit",
        ];

  return (
    <div className="flex justify-between items-center gap-8">
      <div className="flex-1">
        <GridToolbarQuickFilter debounceMs={100} />
      </div>
      <div className="flex gap-1 opacity-70">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <GridToolbarExport
          printOptions={{ fields: exportFields }}
          csvOptions={{ fields: exportFields }}
        />
      </div>
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
