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

// cuatom hooka
import { useAuth } from "@/components/AuthProvider";

// libraries
import { defaultTrial } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

// icons
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

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

  const saveTrial = () => {
    setSavingTrial(true);
    closeAlert();
    let alert: AlertBody;
    let alertType: AlertType;

    for (let rowId in trials) {
      if (
        trials[rowId].investigatorName === "" ||
        trials[rowId].protocol === "" ||
        trials[rowId].siteVisit === ""
      ) {
        alert = {
          title: "Notice!",
          content: "Please fill out all fields in the Monitoring Log form.",
        };
        alertType = AlertType.Info;
        setSavingTrial(false);
        setAlert(alert, alertType);
        return;
      }
    }

    for (let rowId in trials) {
      createTrial(trials[rowId], user?.orgId as string).then((response) => {
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
    if (user) {
      if (user.isAdmin === false) redirect("/");
    }
  }, [user]);

  return (
    <div className="relative h-full w-full max-w-screen-xl flex flex-col mx-auto justify-start gap-6">
      <div className="w-11/12 flex justify-end mx-auto">
        <button
          onClick={resetTrials}
          className="bg-red-500 text-white px-6 py-2 rounded-full disabled:opacity-30"
        >
          Reset
        </button>
      </div>
      <div className="w-11/12 space-y-4 mx-auto overflow-hidden">
        <div ref={createTrialTableRef} className="border rounded-lg">
          <div className="w-full flex text-blue-500 bg-sky-50 pl-3 rounded-t-lg">
            <div className="h-12 w-1/3 flex items-center text-[13px] font-medium uppercase">
              Investigator Name
            </div>
            <div className="h-12 w-1/3 flex items-center text-[13px] font-medium uppercase">
              Protocol
            </div>
            <div className="h-12 w-1/3 flex items-center text-[13px] font-medium uppercase">
              Site Visit
            </div>
          </div>
          <div className="space-y-4">
            {tableRowsIds.map((i, k) => (
              <div key={k} className="w-full flex justify-between">
                <CreateTrialTableRow rowId={i} tablelength={tableRowsIds.length}/>
              </div>
            ))}
          </div>
        </div>
        {/* add or delete row */}
        <div className="flex space-x-2">
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
      </div>
      <div className="px-4 lg:px-6 w-full flex items-center justify-center">
        <button
          disabled={savingTrial}
          onClick={saveTrial}
          className="w-full max-w-[12rem] bg-blue-500 text-sm sm:text-base text-white font-semibold py-3 rounded-lg hover:opacity-90 hover:scale-[99%] disabled:hover:opacity-100 shadow-xl"
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
