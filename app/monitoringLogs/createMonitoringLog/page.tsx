"use client";

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";

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
import { useAuth } from "@/components/AuthProvider";

const CreateMonitoringLogs = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [trials, removeLog, updateLogs, clearLogs] = useTrialStore((state) => [
    state.trials,
    state.removeTrial,
    state.updateTrials,
    state.clearTrials,
  ]);
  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0]);
  const createTrialTableRef = useRef<HTMLTableElement>(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  const [savingTrial, setSavingTrial] = useState<boolean>(false);

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

  const isFormFieldsEmpty = () => {
    // Convert the HTMLCollectionOf<HTMLFormElement> to an array
    return Array.from(createTrialTableRef.current!.querySelectorAll("form")).some((form: HTMLFormElement) => {
      // Get all input elements within the form
      const inputs = form.querySelectorAll("input");
  
      // Check if any input is empty
      return Array.from(inputs).some((input) => input.value.trim() === "");
    });
  };

  const saveTrial = () => {
    setSavingTrial(true);
    closeAlert();
    let alert: AlertBody;
    let alertType: AlertType;

    const noEmptyFields = isFormFieldsEmpty();

    if (noEmptyFields) {
      alert = {
        title: "Notice!",
        content: "Please fill out all fields in the Monitoring Log form.",
      };
      alertType = AlertType.Info;
      setSavingTrial(false);
      setAlert(alert, alertType);
      return;
    }

    for (let rowId in trials) {
      createTrial(trials[rowId], user?.orgId).then((response) => {
        if (response.success) {
          alert = {
            title: "Success!",
            content:
              "Monitoring Log" +
              (Object.keys(trials).length > 1 ? "s were" : " was") +
              "  saved successfully.",
          };
          alertType = AlertType.Success;
          router.push("/monitoringLogs");
        } else {
          alert = {
            title: "Something went wrong",
            content:
              "Could not save Monitoring Log" +
              (Object.keys(trials).length > 1 ? "s" : ""),
          };
          alertType = AlertType.Error;
        }
        setSavingTrial(false);
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

  useEffect(() => {
    if (!user?.isAdmin) redirect("/");
  }, [user]);

  return (
    <div className="h-full w-full max-w-screen-xl flex flex-col mx-auto justify-start gap-6">
      <div className="w-full flex justify-end pr-4 lg:pr-6">
        <button
          onClick={resetTrials}
          className="bg-red-500 text-white px-4 py-2 rounded-full disabled:opacity-30"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col">
        <div className="-mx-1.5 overflow-x-auto">
          <div className="px-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden">
              <table
                ref={createTrialTableRef}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-sky-50">
                  <tr className="text-blue-500">
                    <th
                      scope="col"
                      className="px-2 lg:px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                      Investigator Name
                    </th>
                    <th
                      scope="col"
                      className="px-2 lg:px-8 py-3 text-start text-xs font-medium uppercase"
                    >
                      Protocol
                    </th>
                    <th
                      scope="col"
                      className="px-2 lg:px-8 py-3 text-start text-xs font-medium uppercase"
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
      <div className="flex space-x-2 pl-4 lg:pl-8">
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
      <div className="px-4 lg:px-6 w-full flex items-center justify-center">
        <button
          disabled={savingTrial}
          onClick={saveTrial}
          className="px-4 py-3 w-full max-w-fit bg-blue-500 text-white rounded-full hover:opacity-90 disabled:hover:opacity-100 text-sm sm:text-base"
        >
          {savingTrial
            ? "Saving..."
            : `Save Monitoring Log${tableRowsIds.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
};

export default CreateMonitoringLogs;
