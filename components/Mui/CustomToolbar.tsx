// react/nextjs components
import React from "react";
import Link from "next/link";

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
      <Link href="/your-page">
        <Button
          variant="contained"
          style={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          Add Trial
        </Button>
      </Link>
    </div>
  );
};

export default CustomToolbar;
