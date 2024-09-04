"use client";

// react/nextjs components
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// firebase components/functions
import { createTrial } from "@/firebase";

// custom components
import CreateTrialTableRow from "@/components/CreateTrialTableRow";

// global stores
import { useTrialStore } from "@/store/CreateTrialStore";
import { useAlertStore } from "@/store/AlertStore";

// libraries
import { defaultTrial } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

// icons
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const CreateTrials = () => {
  const router = useRouter();
  const [trials, removeLog, updateLogs, clearLogs] = useTrialStore((state) => [
    state.trials,
    state.removeTrial,
    state.updateTrials,
    state.clearTrials,
  ]);

  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0]);
  const createTrialTableRef = useRef<HTMLTableElement>(null);
  const [setAlert] = useAlertStore((state) => [state.setAlert]);

  const addRow = () => {
    updateLogs(tableRowsIds.length, defaultTrial);
    setTableRowsIds((rowArr) => [...rowArr, rowArr.length]);
  };

  const remRow = () => {
    if (tableRowsIds.length == 1) return;

    removeLog(tableRowsIds.length - 1);

    setTableRowsIds((rowArr) => {
      if (rowArr.length == 1) return rowArr;
      return rowArr.slice(0, -1);
    });
  };

  const saveTrial = () => {
    for (let log in trials) {
      createTrial(trials[log]).then((response) => {
        let alert: AlertBody;
        let alertType: AlertType;

        if (response.success) {
          alert = {
            title: "Success!",
            content:
              "Log" +
              (Object.keys(trials).length > 1 ? "s were" : " was") +
              "  saved successfully.",
          };
          alertType = AlertType.Success;
          setTimeout(() => {
            router.push("/trials");
          }, 3000);
        } else {
          alert = {
            title: "Something went wrong",
            content: "Could not save logs, please try again",
          };
          alertType = AlertType.Error;
        }
        setAlert(alert, alertType);
        resetTrials();
      });
    }
  };

  const resetTrials = () => {
    clearLogs();
    createTrialTableRef.current
      ?.querySelectorAll("form")
      .forEach((form) => form.reset());
    setTableRowsIds([0]);
  };

  return (
    <div className="h-full flex flex-col w-5/6 mx-auto justify-start gap-6">
      <div className="w-full flex justify-end pr-6">
        <button
          onClick={resetTrials}
          className="bg-red-500 text-white px-4 py-1 rounded-full disabled:opacity-30"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden">
              <table
                ref={createTrialTableRef}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-sky-50">
                  <tr className="text-blue-500">
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                      Investigator Name
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                      Protocol
                    </th>
                    <th
                      scope="col"
                      className="px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                      Site Visit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 duration-200">
                  {tableRowsIds.map((i, k) => (
                    <tr key={k}>
                      <CreateTrialTableRow rowId={i} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* add or delete row */}
      <div className="flex space-x-2 pl-8">
        <button onClick={remRow} disabled={tableRowsIds.length <= 1}>
          <FaMinusCircle
            className={`text-2xl text-slate-200 ${
              tableRowsIds.length > 1 && "hover:text-blue-500"
            }`}
          />
        </button>
        <button onClick={addRow}>
          <FaPlusCircle className="text-2xl text-slate-200 hover:text-blue-500" />
        </button>
      </div>
      <div className="pl-6 w-full flex items-center justify-center">
        <button
          onClick={saveTrial}
          className="px-4 py-2 w-fit bg-blue-500 text-white rounded-full hover:opacity-90"
        >{`Save Trial${tableRowsIds.length > 1 ? "s" : ""}`}</button>
      </div>
    </div>
  );
};

export default CreateTrials;
