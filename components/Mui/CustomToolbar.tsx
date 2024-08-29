// react/nextjs components
import React from "react";

// mui components
import { GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";

const CustomToolbar = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <GridToolbarQuickFilter debounceMs={100} />
      </div>
      <div className="flex gap-1 opacity-70">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
    </div>
  );
};

export default CustomToolbar;
