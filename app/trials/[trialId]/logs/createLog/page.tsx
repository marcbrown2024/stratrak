"use client";

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// firebase components/functions
import { createLog, getTrial } from "@/firebase";

// global stores
import { useLogStore } from "@/store/CreateLogStore";
import { useAlertStore } from "@/store/AlertStore";

// custom components
import CreateLogTableRow from "@/components/CreateLogTableRow";
import Loader from "@/components/Loader";

// libraries
import { defaultLog } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

// icons
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";

type params = {
  params: {
    trialId: string;
  };
};

const CreateLog = ({ params }: params) => {
  const { user } = useAuth();
  const router = useRouter();
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

  const [loading, setLoading] = useState<boolean>(true);

  const saveLogs = () => {
    closeAlert();
    let alert: AlertBody;
    let alertType: AlertType;

    setSavingLog(true);
    createLog(logs[0], trialId).then((response) => {
      if (response.success) {
        alert = {
          title: "Success!",
          content:
            "Log" +
            (Object.keys(logs).length > 1 ? "s were" : " was") +
            "  saved successfully.",
        };
        alertType = AlertType.Success;
        setTimeout(() => {
          router.back();
        }, 3000);
      } else {
        alert = {
          title: "Something went wrong",
          content: "Could not save log, please try again",
        };
        alertType = AlertType.Error;
      }
      setSavingLog(false);
      setAlert(alert, alertType);
    });
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
    getTrial(trialId).then((response) => {
      setTrial(response.data);
      setLoading(false);
    });
  }, [trialId]);

  return (
    <div className="h-full w-full max-w-screen-lg flex flex-col justify-start gap-8 mx-auto px-4 sm:px-8">
      <div className="px-4 sm:px-8 py-2 bg-white mt-10 w-full sm:w-fit rounded-lg flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border">
        <div className="font-bold text-gray-500">
          <p>Investigator Name:</p>
          <p>Protocol:</p>
          <p>Site Visit:</p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col">
            <p className="">{trial?.investigatorName}</p>
            <p className="">{trial?.protocol}</p>
            <p className="">{trial?.siteVisit}</p>
          </div>
        )}
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
              {savingLog ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center py-4">
        <button
          disabled={savingLog || loading}
          onClick={saveLogs}
          className="px-4 py-2 w-full max-w-xs bg-blue-500 text-white rounded-full hover:opacity-90 disabled:hover:opacity-100 text-sm sm:text-base"
        >
          {savingLog ? "Saving log..." : "Save log"}
        </button>
      </div>
    </div>
  );
};

export default CreateLog;
