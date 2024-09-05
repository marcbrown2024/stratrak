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
import { useAuth } from "./AuthProvider";

const CustomToolbar = () => {
  const { user } = useAuth();
  const { trialId } = useParams();
  const currentPathname = usePathname();

  const isAdminAndTrialPath = user.isAdmin && currentPathname === "/trials";
  const isLogPath = currentPathname === `/trials/${trialId}/logs`;

  return (
    <div className="flex justify-between items-center gap-8">
      <div className="flex-1">
        <GridToolbarQuickFilter debounceMs={100} />
      </div>
      <div className="flex gap-1 opacity-70">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
      {isAdminAndTrialPath ? (
        <Link href="/trials/createTrial">
          <Button
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            Add Trial
          </Button>
        </Link>
      ) : (
        isLogPath && (
          <Link href={`/trials/${trialId}/logs`}>
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
