"use client";

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";

// firebase components/functions
import { createLog, getTrial } from "@/firebase";

// global stores
import { useLogStore } from "@/store/CreateLogStore";
import { useAlertStore } from "@/store/AlertStore";
import LoadingStore from "@/store/LoadingStore";

// custom components
import CreateLogTableRow from "@/components/CreateLogTableRow";
import Loader from "@/components/Loader";

// libraries
import { defaultLog, getCurrentDateTime } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

// icons
import useUser from "@/hooks/UseUser";

type params = {
  params: {
    trialId: string;
  };
};

const CreateLog = ({ params }: params) => {
  const {user} = useUser()
  const router = useRouter();
  const { setLoading } = LoadingStore();
  const [savingLog, setSavingLog] = useState<boolean>(false);

  const [logs, clearLogs, updateLogs] = useLogStore((state) => [
    state.logs,
    state.clearLogs,
    state.updateLogs,
  ]);

  const [tableRowsIds, setTableRowsIds] = useState<number[]>([0]);
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails);

  const trialId = params.trialId;
  const createLogTableRef = useRef<HTMLTableElement>(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const saveLogs = () => {
    closeAlert();
    let alert: AlertBody;
    let alertType: AlertType;

    if (user?.signature) {
      setSavingLog(true);
      createLog({...logs[0], dateOfVisit: getCurrentDateTime()}, trialId).then((response) => {
        if (response.success) {
          alert = {
            title: "Success!",
            content:
              "Log" +
              (Object.keys(logs).length > 1 ? "s were" : " was") +
              "  saved successfully.",
          };
          alertType = AlertType.Success;
            router.push(`/monitoringLogs/${trialId}/logs`);
        } else {
          alert = {
            title: "Something went wrong",
            content: "Could not save log, please try again",
          };
          alertType = AlertType.Error;
        }
        setAlert(alert, alertType);
        setSavingLog(false);
      });
    } else {
      alert = {
        title: "Notice!",
        content: "Need to have a signature to save log",
      };
      alertType = AlertType.Info;
      setAlert(alert, alertType);
    }
  };

  const resetLogs = () => {
    clearLogs();
    createLogTableRef.current
      ?.querySelectorAll("form")
      .forEach((form) => form.reset());
    updateLogs(0, {
      ...defaultLog,
      monitorName: `${user?.fName || ""} ${user?.lName || ""}`,
      signature: user?.signature ?? "",
    });

    setTableRowsIds([0]);
  };

  useEffect(() => {
    setLoading(true);
    getTrial(trialId).then((response) => {
      setTrial(response.data);
      setLoading(false);
    });
  }, [trialId]);

  return (
    <div className="h-full w-full max-w-screen-xl flex flex-col justify-start gap-8 mx-auto px-4 sm:px-8">
      <div className="px-4 sm:px-8 py-2 bg-white mt-10 w-full sm:w-fit rounded-lg flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border">
        <div className="font-bold text-gray-500">
          <p>Investigator Name:</p>
          <p>Protocol:</p>
          <p>Site Visit:</p>
        </div>
        <div className="flex flex-col">
          <p>{trial?.investigatorName || "N/A"}</p>
          <p>{trial?.protocol || "N/A"}</p>
          <p>{trial?.siteVisit || "N/A"}</p>
        </div>
      </div>
      {/* Create log form wrapper */}
      <div className="w-full flex justify-end">
        <button
          onClick={resetLogs}
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
                ref={createLogTableRef}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-sky-50">
                  <tr className="text-blue-500 text-xs sm:text-sm">
                    <th
                      scope="col"
                      className="px-4 sm:px-8 py-3 text-start font-medium uppercase"
                    >
                      Monitor Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-8 py-3 text-start font-medium uppercase"
                    >
                      Signature
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-8 py-3 text-start font-medium uppercase"
                    >
                      Type of Visit
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-8 py-3 text-start font-medium uppercase"
                    >
                      Purpose of Visit
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-8 py-3 text-start font-medium uppercase"
                    >
                      Date of Visit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 duration-200 text-xs sm:text-sm">
                  {tableRowsIds.map((i, k) => (
                    <tr key={k}>
                      <CreateLogTableRow rowId={i} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center py-4">
        <button
          disabled={savingLog}
          onClick={saveLogs}
          className="px-4 py-3 w-full max-w-[12rem] bg-blue-500 text-white rounded-full hover:opacity-90 disabled:hover:opacity-100 text-sm sm:text-base"
        >
          {savingLog ? "Saving log..." : "Save log"}
        </button>
      </div>
    </div>
  );
};

export default CreateLog;
