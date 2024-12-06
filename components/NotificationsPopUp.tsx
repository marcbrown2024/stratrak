"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";

// global stores
import useNotificationStore from "@/store/NotificationStore ";

// Icons
import { IoSettings } from "react-icons/io5";
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io";

const NotificationsPopUp = () => {
  const {
    isPopupOpen,
    notifications,
    activeTab,
    setActiveTab,
    setNotifications,
  } = useNotificationStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = (index: number) => {
    hoverTimeout = setTimeout(() => {
      setHoveredIndex(index);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredIndex(null);
  };

  const testNotifications = {
    All: [
      {
        title: "Trial Submission Update",
        message: "Your trial submission has been successfully processed.",
      },
      {
        title: "Log Upload Confirmation",
        message: "Log file 'log_2458.txt' has been uploaded successfully.",
      },
      {
        title: "System Maintenance Alert",
        message:
          "Scheduled maintenance for the trial platform is starting at 10:00 PM.",
      },
      {
        title: "Trial Review Completed",
        message:
          "Your trial review has been completed and is now available for feedback.",
      },
      {
        title: "Trial Status Update",
        message:
          "The trial 'Cancer Treatment 2024' has moved to the review stage.",
      },
      {
        title: "Log Review Feedback",
        message: "Your recent log entries have been approved by the admin.",
      },
      {
        title: "Log Upload Success",
        message:
          "Log file 'log_5432.txt' was successfully processed and archived.",
      },
      {
        title: "System Update Complete",
        message:
          "The system update to version 2.5 has been completed successfully.",
      },
      {
        title: "New Trial Alert",
        message:
          "A new trial has been added to your dashboard. Check it out now!",
      },
      {
        title: "New Log Entry Pending",
        message: "Your latest log entry 'log_9874.txt' is awaiting approval.",
      },
      {
        title: "Urgent System Notice",
        message:
          "There was an error processing your trial data. Please review the logs.",
      },
    ],
    Unread: [
      {
        title: "New Trial Alert",
        message:
          "A new trial has been added to your dashboard. Check it out now!",
      },
      {
        title: "New Log Entry Pending",
        message: "Your latest log entry 'log_9874.txt' is awaiting approval.",
      },
      {
        title: "Urgent System Notice",
        message:
          "There was an error processing your trial data. Please review the logs.",
      },
    ],
    Read: [
      {
        title: "Trial Status Update",
        message:
          "The trial 'Cancer Treatment 2024' has moved to the review stage.",
      },
      {
        title: "Log Review Feedback",
        message: "Your recent log entries have been approved by the admin.",
      },
      {
        title: "Log Upload Success",
        message:
          "Log file 'log_5432.txt' was successfully processed and archived.",
      },
      {
        title: "System Update Complete",
        message:
          "The system update to version 2.5 has been completed successfully.",
      },
    ],
  };

  useEffect(() => {
    setNotifications(testNotifications);
  }, [setNotifications]);

  const handleTabClick = (tab: "All" | "Unread" | "Read") => {
    setActiveTab(tab);
  };

  if (!isPopupOpen) {
    return null;
  }

  return (
    <div className="Popup fixed top-[4.5rem] right-28 h-96 w-80 space-y-3 bg-slate-50 py-1 border rounded-2xl z-50 transition-all duration-100 ease-in-out">
      <div className="h-10 flex items-center justify-between px-3">
        <span className="text-sm font-semibold">Notifications</span>
        <div className="flex items-center gap-4">
          <IoSettings size={20} color="#2563eb" className="cursor-pointer" />
          <IoMdClose size={20} color="#000" className="cursor-pointer" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 text-xs font-medium pl-3">
          <button
            className={`w-16 text-center ${
              activeTab === "All" ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("All")}
          >
            All
          </button>
          <button
            className={`w-16 text-center ${
              activeTab === "Unread" ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("Unread")}
          >
            Unread
          </button>
          <button
            className={`w-16 text-center ${
              activeTab === "Read" ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={() => handleTabClick("Read")}
          >
            Read
          </button>
        </div>
        <div className="h-[1.5px] bg-gray-200 pl-3">
          {/* Translate the blue bar based on the active tab */}
          <div
            className="h-full w-14 bg-blue-600"
            style={{
              transform:
                activeTab === "All"
                  ? "translateX(0)"
                  : activeTab === "Unread"
                  ? "translateX(76px)"
                  : "translateX(148px)",
              transition: "transform 0.3s ease-in-out",
            }}
          ></div>
        </div>
      </div>
      {/* Display notifications based on the active tab */}
      <div className="custom-scrollbar h-72 space-y-2 mt-3 px-3 rounded-b-2xl overflow-y-auto">
        {notifications[activeTab].map((notification: any, index: number) => (
          <div
            key={index}
            className="relative h-20 w-full flex text-sm text-gray-700 bg-white rounded-lg"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-full flex items-center gap-3 rounded-b-lg">
              <div className="h-full w-[4px] bg-blue-600 rounded-tl-lg rounded-bl-lg"></div>
              <div className="h-8 w-8 flex items-center justify-center bg-blue-50 rounded-full">
                <IoMdNotificationsOutline size={20} color="#1e40af" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-2 px-2 py-1">
              <div className="text-xs font-semibold">{notification.title}</div>
              <div className="text-xs">{notification.message}</div>
            </div>
            {hoveredIndex === index && (
              <div className="absolute top-0 right-0 h-full w-[calc(100%-4px)] bg-white/90 rounded-r-lg">
                <Link
                  href="/notifications"
                  className="h-full w-full flex items-center justify-center text-blue-700 font-bold"
                >
                  Go to Notifications
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPopUp;
