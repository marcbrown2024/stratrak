"use client";

// react/nextjs components
import React, { useEffect, useRef, useState } from "react";

// firebase components/functions
import { getTrial } from "@/firebase";

// global stores
import { useLogStore } from "@/store/CreateLogStore";
import LoadingStore from "@/store/LoadingStore";

// custom components
import CreateLogTableRow from "@/components/CreateLogTableRow";
import Acknowledgement from "@/components/Acknowledgement";
import Disclaimer from "@/components/Disclaimer";

// libraries
import { defaultLog } from "@/lib/defaults";

// custom hooks
import useUser from "@/hooks/UseUser";

type params = {
  params: {
    trialId: string;
  };
};

const CreateLog = ({ params }: params) => {
  const { user } = useUser();
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
  const [showAckPopup, setShowAckPopup] = useState<
    null | "signAndSave" | "saveDontSign"
  >(null);
  const [showDisPopup, setShowDisPopup] = useState<
    null | "signAndSave" | "saveDontSign"
  >(null);

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
      <div className="h-48 w-full flex items-end justify-center py-4">
        <div className="w-1/4 flex flex-col items-center gap-3">
          <button
            disabled={savingLog}
            // onClick={saveLogs}
            onClick={() => setShowAckPopup("signAndSave")}
            className="w-full max-w-[11rem] bg-blue-500 text-sm sm:text-base text-white font-semibold py-3 rounded-lg hover:opacity-90 hover:scale-[99%] disabled:hover:opacity-100 shadow-xl"
          >
            Sign and Save
          </button>
          <span
            onClick={() => setShowDisPopup("signAndSave")}
            className="text-sm text-gray-800 font-thin cursor-pointer"
          >
            Disclaimer
          </span>
        </div>
        <div className="w-1/4 flex flex-col items-center gap-3">
          <button
            disabled={savingLog}
            onClick={() => setShowAckPopup("saveDontSign")}
            className="w-full max-w-[11rem] bg-red-500 text-sm sm:text-base text-white font-semibold py-3 rounded-lg hover:opacity-90 hover:scale-[99%] disabled:hover:opacity-100 shadow-xl"
          >
            Save Don&apos;t Sign
          </button>
          <span
            onClick={() => setShowDisPopup("saveDontSign")}
            className="text-sm text-gray-800 font-thin cursor-pointer"
          >
            Disclaimer
          </span>
        </div>
      </div>
      {showDisPopup && (
        <div className="fixed h-full w-full bg-slate-50">
          <Disclaimer
            showDisPopup={showDisPopup}
            setShowDisPopup={setShowDisPopup}
          />
        </div>
      )}
      {showAckPopup && (
        <div className="fixed h-full w-full bg-slate-50">
          <Acknowledgement
            trialId={trialId}
            logs={logs}
            setSavingLog={setSavingLog}
            showAckPopup={showAckPopup}
            setShowAckPopup={setShowAckPopup}
          />
        </div>
      )}
    </div>
  );
};

export default CreateLog;
