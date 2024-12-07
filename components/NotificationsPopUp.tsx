"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// firebase components
import { fetchNotifications, updateIsRead } from "@/firebase";

// global stores
import useNotificationStore from "@/store/NotificationStore ";
import { useAlertStore } from "@/store/AlertStore";

// date components
import { format, formatDistanceToNow, parse, isValid } from "date-fns";

// custom hooks
import useUser from "@/hooks/UseUser";

// enums
import { AlertType } from "@/enums";

// Icons
import { IoSettings } from "react-icons/io5";
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io";

const NotificationsPopUp = () => {
  const { user } = useUser();
  const {
    isPopupOpen,
    notifications,
    activeTab,
    setActiveTab,
    setNotifications,
    closePopUp,
  } = useNotificationStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = (index: number) => {
    hoverTimeout = setTimeout(() => {
      setHoveredIndex(index);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredIndex(null);
  };

  const handleTabClick = (tab: "All" | "Unread" | "Read") => {
    setActiveTab(tab);
  };

  const toggleExactTime = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const customDateFormat = "yyyy-MM-dd, h:mm a";

  const getTimeDisplay = (
    createdAt: string | undefined,
    showExactTime: boolean
  ) => {
    if (!createdAt) return "Invalid date";

    // Parse the date with the custom format
    const parsedDate = parse(createdAt, customDateFormat, new Date());

    // Check if the parsed date is valid
    if (!isValid(parsedDate)) return "Invalid date";

    const relativeTime = formatDistanceToNow(parsedDate, { addSuffix: true });
    const exactTime = format(parsedDate, "yyyy-MM-dd, h:mm a");

    return showExactTime ? exactTime : relativeTime;
  };

  const getNotifications = async () => {
    if (user?.userId) {
      const fetchedNotifications = await fetchNotifications(user.userId);

      // Categorize the notifications into All, Unread, and Read
      const categorizedNotifications = {
        All: fetchedNotifications,
        Unread: fetchedNotifications.filter((notif) => !notif.isRead),
        Read: fetchedNotifications.filter((notif) => notif.isRead),
      };

      // Set the categorized notifications in the store
      setNotifications(categorizedNotifications);
    }
  };

  const handleUpdateIsRead = async (
    notificationId: string,
    status: boolean
  ) => {
    closeAlert();
    if (user?.userId) {
      const result = await updateIsRead(user.userId, notificationId, status);
      if (result) {
        getNotifications();
      } else {
        setAlert(
          { title: "Error!", content: "Failed to mark notification as read." },
          AlertType.Info
        );
      }
    }
  };

  useEffect(() => {
    const closePopupsOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".Notif")) {
        setHoveredIndex(null);
        setOverlayIndex(null);
      }
    };
    document.addEventListener("click", closePopupsOnOutsideClick);
    return () => {
      document.removeEventListener("click", closePopupsOnOutsideClick);
    };
  }, [setHoveredIndex, setOverlayIndex]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    getNotifications();
  }, [user?.userId, setNotifications]);

  if (!isPopupOpen) {
    return null;
  }

  return (
    <div className="Popup fixed top-16 right-28 h-96 w-80 space-y-3 bg-slate-50 py-1 border rounded-2xl z-50 transition-all duration-100 ease-in-out">
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
      <div>
        <div className="custom-scrollbar h-[17rem] space-y-2 mt-3 -mb-2 px-3 rounded-b-2xl overflow-y-auto">
          {notifications[activeTab].length > 0 ? (
            notifications[activeTab].map((notification: any, index: number) => (
              <div
                key={index}
                className="Notif relative h-24 w-full flex text-sm text-gray-700 bg-white rounded-lg overflow-hidden"
              >
                <div
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className={`h-full w-full flex items-center ${
                    overlayIndex === index ? "z-10" : "z-0"
                  }`}
                >
                  <div className="h-full flex items-center gap-3 rounded-b-lg">
                    <div className="h-full w-[4px] bg-blue-600 rounded-tl-lg rounded-bl-lg" />
                    <div className="h-8 w-8 flex items-center justify-center bg-blue-50 rounded-full">
                      {hoveredIndex !== index && activeTab !== "Read" ? (
                        <IoMdNotificationsOutline size={20} color="#1e40af" />
                      ) : (
                        <Image
                          src="/click.gif"
                          alt="hand click gif"
                          height={100}
                          width={100}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2 px-2 py-1">
                    <Link
                      href={`/notifications/${notification.id}`}
                      onClick={() => closePopUp()}
                    >
                      <div className="text-xs font-semibold">
                        {notification.title}
                      </div>
                      <div className="text-xs">
                        {notification.message.length > 70
                          ? `${notification.message.substring(0, 70)}...`
                          : notification.message}
                      </div>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs text-gray-400 cursor-pointer hover:underline"
                        onClick={() => toggleExactTime(index)}
                        title={getTimeDisplay(notification.createdAt, true)}
                      >
                        {getTimeDisplay(
                          notification.createdAt,
                          expandedIndex === index
                        )}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateIsRead(
                            notification.id,
                            !notification.isRead
                          )
                        }
                        className={`text-xs ${
                          notification.isRead
                            ? "text-gray-500 hover:text-blue-700"
                            : "text-blue-700 hover:text-gray-500"
                        } text-blue-700 font-semibold `}
                      >
                        {notification.isRead
                          ? "Mark as Unread"
                          : "Mark as Read"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 pb-4">
              No notifications to display
            </div>
          )}
        </div>
        <div className="h-[32px] w-full flex items-center justify-center border-t border-gray-200 rounded-b-2xl">
          <Link
            href="/notifications"
            onClick={() => closePopUp()}
            className="text-sm text-blue-700 font-bold"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopUp;

{
  /* <div className="flex-1 flex flex-col justify-center gap-2 px-2 py-1">
<div className="text-xs font-semibold">
  {notification.title}
</div>
<div className="text-xs">
  {/* Check if the message contains "Link:" and wrap the URL */
}
// {notification.message.includes("Link:")
// ? // Split the message into two parts: before and after "Link:"
// notification.message
// .split("Link:")
// .map((part: string, index: number) => {
//   if (index === 0) {
//     return part; // Return the part before "Link:" as plain text
//   } else {
//     // The second part should contain the URL after "Link:"
//     const url = part.split(" ")[0]; // Extract the URL
//     const rest = part.substring(url.length); // The remaining text after the URL

//     // Return the part before the URL as plain text, wrap the URL in a Link component
//     return (
//       <>
//         Link:
//         <Link
//           href={url}
//           key={index}
//           className="text-blue-600 underline"
//         >
//           {url}
//         </Link>
//         {rest}
//       </>
//     );
//   }
// })
//     : // If there's no "Link:", just display the full message
//     notification.message.length > 70
//     ? `${notification.message.substring(0, 70)}...`
//     : notification.message}
// </div>
// </div> */}
