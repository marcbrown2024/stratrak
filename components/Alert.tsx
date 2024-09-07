"use client";

import { useAlertStore } from "@/store/AlertStore";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { AlertType } from "@/enums";
import { TiTick } from "react-icons/ti";
import { IoAlert } from "react-icons/io5";

const Alert = () => {
  const [showAlert, body, alertType, closeAlert] = useAlertStore((state) => [
    state.showAlert,
    state.body,
    state.alertType,
    state.closeAlert,
  ]);

  useEffect(() => {
    setTimeout(() => {
      closeAlert();
    }, 5000);
  }, [showAlert, closeAlert]);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          key="alert"
          initial={{
            right: "0",
          }}
          animate={{
            right: "2rem",
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className={`z-[1000000] p-2 fixed bottom-20 -right-50 flex w-96 h-fit bg-white rounded shadow-xl border-t-2
            ${
              alertType === AlertType.Success
                ? "border-emerald-500 text-emerald-500"
                : alertType === AlertType.Error
                ? "border-rose-500 text-rose-500"
                : alertType === AlertType.Info &&
                  "border-blue-500 text-blue-500"
            }`}
        >
          {/* alert body */}
          <div className="relative w-full">
            {/* Alert Heading */}
            <div className="flex items-center space-x-2 font-bold">
              {alertType === AlertType.Success ? (
                <span className="rounded-full bg-emerald-500 text-white">
                  <TiTick />
                </span>
              ) : alertType === AlertType.Error ? (
                <span className="rounded-full bg-rose-500 text-white">
                  <IoAlert />
                </span>
              ) : alertType === AlertType.Info ? (
                <span className="rounded-full bg-blue-500 text-white">
                  {/* Use an info icon or any other suitable icon */}
                  <IoAlert />
                </span>
              ) : null}
              <p className="flex-1">{body.title}</p>
              <button onClick={closeAlert} className="">
                <MdClose className="" fontWeight={500} />
              </button>
            </div>
            {/* Alert Body Content */}
            <p className="px-6 text-black text-sm text-wrap">{body.content}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
