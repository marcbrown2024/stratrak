// react/nextjs components
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// firebase components/functions
import { createLog } from "@/firebase";

// global stores
import { useAlertStore } from "@/store/AlertStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// libraries
import { getCurrentDateTime } from "@/lib/defaults";

// enums
import { AlertType } from "@/enums";

// icons
import { IoCloseCircleSharp } from "react-icons/io5";

type DisclaimerProps = {
  trialId: string;
  logs: { [key: number]: LogDetails };
  setSavingLog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAckPopup: React.Dispatch<
    React.SetStateAction<null | "signAndSave" | "saveDontSign">
  >;
  showAckPopup: null | "signAndSave" | "saveDontSign";
};

const Disclaimer: React.FC<DisclaimerProps> = ({
  trialId,
  logs,
  setSavingLog,
  showAckPopup,
  setShowAckPopup,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const [acknowledgeChecked, setAcknowledgeChecked] = useState(false);
  const [declineChecked, setDeclineChecked] = useState(false);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleAcknowledgeContinue = () => {
    closeAlert();

    if (showAckPopup === "signAndSave" && !user?.signature) {
      setAlert(
        {
          title: "Notice",
          content: "A signature is required to save the log.",
        },
        AlertType.Info
      );
      return;
    }

    const logData: LogDetails = {
      ...logs[0],
      dateOfVisit: getCurrentDateTime(),
      signature:
        showAckPopup === "signAndSave"
          ? user?.signature || "Missing Signature"
          : "E-signatures are not permitted",
    };

    setSavingLog(true);
    createLog(logData, trialId).then((response) => {
      const alert = response.success
        ? {
            title: "Success!",
            content: `Log${
              Object.keys(logs).length > 1 ? "s" : ""
            } saved successfully.`,
          }
        : {
            title: "Error",
            content: "Could not save log, please try again.",
          };
      setAlert(alert, response.success ? AlertType.Success : AlertType.Error);
      setSavingLog(false);

      if (response.success) router.push(`/monitoringLogs/${trialId}/logs`);
    });
  };

  const handleDeclineExit = () => {
    closeAlert();
    router.push(`/monitoringLogs/${trialId}/logs`);
  };

  return (
    <>
      {showAckPopup && (
        <div className="relative h-fit w-1/2 flex flex-col items-center justify-center gap-3 bg-white p-8 mx-44 my-20 rounded shadow-md">
          <button
            onClick={() => setShowAckPopup(null)}
            className="absolute -top-4 -right-4"
          >
            <IoCloseCircleSharp size={48} color="#2563eb" />
          </button>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
              {showAckPopup === "signAndSave"
                ? "Acknowledge Your E-Signature and Participation"
                : "Acknowledge Your Consent Without E-Signature"}
            </h2>
            <p className="mt-2">
              {showAckPopup === "signAndSave"
                ? "By electronically signing, you acknowledge that:"
                : "Due to local regulations, e-signatures are not permitted in this clinical trial. By acknowledging this, you confirm that:"}
            </p>
            <ul className="space-y-3 text-sm mt-2 list-disc pl-6">
              <li>
                {showAckPopup === "signAndSave"
                  ? "You have carefully reviewed the clinical trial information, including the risks, benefits, and procedures."
                  : "You have thoroughly reviewed the provided clinical trial information, including risks, benefits, and procedures."}
              </li>
              <li>
                {showAckPopup === "signAndSave"
                  ? "You understand that your electronic signature is legally binding and has the same effect as a handwritten signature"
                  : "You understand that although you cannot provide an electronic signature, the information you have received is legally binding and accurate"}
              </li>
              <li>
                {showAckPopup === "signAndSave"
                  ? "You agree that all the information you have received is accurate and that your decision to participate is voluntary and made without coercion."
                  : "You agree to participate voluntarily, without coercion or undue influence"}
              </li>
            </ul>
            <div className="flex flex-col gap-2 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={acknowledgeChecked}
                  onChange={(e) => {
                    setAcknowledgeChecked(e.target.checked);
                    setDeclineChecked(false);
                  }}
                />
                <span>I acknowledge and agree to the terms.</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={declineChecked}
                  onChange={(e) => {
                    setDeclineChecked(e.target.checked);
                    setAcknowledgeChecked(false);
                  }}
                />
                <span>I decline to participate in this trial.</span>
              </label>
            </div>
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleAcknowledgeContinue}
                disabled={!acknowledgeChecked}
                className={`w-1/2 p-2 rounded ${
                  acknowledgeChecked ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                Acknowledge and Continue
              </button>
              <button
                onClick={handleDeclineExit}
                disabled={!declineChecked}
                className={`w-1/2 p-2 rounded ${
                  declineChecked ? "bg-red-500 text-white" : "bg-gray-300"
                }`}
              >
                Decline and Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Disclaimer;
