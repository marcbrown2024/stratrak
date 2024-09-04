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

const CustomToolbar = () => {
  const { trialId } = useParams();
  const currentPathname = usePathname();

  return (
    <div className="flex justify-between items-center gap-8">
      <div className="flex-1">
        <GridToolbarQuickFilter debounceMs={100} />
      </div>
      <div className="flex gap-1 opacity-70">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </div>
      {(currentPathname === "/trials" ||
        currentPathname === `/trials/${trialId}/logs`) && (
        <Link
          href={
            currentPathname === "/trials"
              ? "/trials/createTrial"
              : `/trials/${trialId}/logs/createLog`
          }
        >
          <Button
            variant="contained"
            style={{ backgroundColor: "#007bff", color: "#fff" }}
          >
            {currentPathname === "/trials" ? "Add Trial" : "Add Log"}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default CustomToolbar;
