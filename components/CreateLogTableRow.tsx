"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// firebase components/functions
import { useAuth } from "@/components/AuthProvider";

// global store
import { useLogStore } from "@/store/CreateLogStore";

type params = {
  rowId: number;
};

const TableRow = ({ rowId }: params) => {
  const { user } = useAuth();

  const [logs, updateLog] = useLogStore((state) => [
    state.logs,
    state.updateLog,
  ]);

  useEffect(() => {
    if (user) {
      updateLog(rowId, "monitorName", `${user?.fName || ""} ${user?.lName || ""}`)
      if (user.signature) {
        updateLog(rowId, "signature", user.signature)
      }
    }
  }, [user])

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <form>
          <input
            disabled
            type="text"
            defaultValue={`${user?.fName || ""} ${user?.lName || ""}`}
            id={`name-${rowId}`}
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
          />
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <div className="h-[40px] w-fit flex items-center text-center border bg-white">
          {user && user.signature ? (
            <Image
              width={400}
              height={400}
              src={user.signature}
              alt="User Signature"
              style={{
                maxWidth: "150px",
                maxHeight: "80px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div>No signature available</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <select
            defaultValue={logs[rowId]["typeOfVisit"]}
            onChange={(e) => updateLog(rowId, "typeOfVisit", e.target.value)}
            id={`visit-${rowId}`}
            className="hover:cursor-pointer text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
          >
            <option>Remote</option>
            <option>Onsite</option>
            <option>Waiver Call</option>
          </select>
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <select
            defaultValue={logs[rowId]["purposeOfVisit"]}
            onChange={(e) => updateLog(rowId, "purposeOfVisit", e.target.value)}
            id={`purpose-${rowId}`}
            className="hover:cursor-pointer text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
          >
            <option>SIV</option>
            <option>IMV</option>
            <option>COV</option>
            <option>Audit</option>
          </select>
        </form>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        <form>
          <input
            className="text-gray-900 text-sm border-b-[1px] border-b-transparent focus:outline-0 focus:border-blue-500 block w-full p-2.5 px-2"
            defaultValue={logs[rowId]["dateOfVisit"] as keyof LogDetails}
            onChange={(e) => updateLog(rowId, "dateOfVisit", e.target.value)}
            aria-label="Date"
            type="datetime-local"
          />
        </form>
      </td>
    </>
  );
};

export default TableRow;
