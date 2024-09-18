"use client";

// react/nextjs components
import React from "react";

// global stores
import { useTrialStore } from "@/store/CreateTrialStore";

type params = {
  rowId: number;
};

const TableRow = ({ rowId }: params) => {
  const [logs, updateLog] = useTrialStore((state) => [
    state.trials,
    state.updateTrial,
  ]);

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <form>
          <input
            type="text"
            defaultValue={logs[rowId]["investigatorName"]}
            onChange={(e) =>
              updateLog(rowId, "investigatorName", e.target.value)
            }
            id={`investigatorName-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
            placeholder="Enter name..."
          />
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input
            type="text"
            defaultValue={logs[rowId]["protocol"]}
            onChange={(e) => updateLog(rowId, "protocol", e.target.value)}
            id={`protocol-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
            placeholder="The protocol"
          />
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input
            type="text"
            defaultValue={logs[rowId]["siteVisit"]}
            onChange={(e) => updateLog(rowId, "siteVisit", e.target.value)}
            id={`siteVisit-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
            placeholder="Site Visited"
          />
        </form>
      </td>
    </>
  );
};

export default TableRow;
