"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// firebase components
import { fetchNotifications, updateIsRead } from "@/firebase";

// global stores
import useNotificationStore from "@/store/NotificationStore";

// date components
import { format, formatDistanceToNow, parse, isValid } from "date-fns";

// custom hooks
import useUser from "@/hooks/UseUser";

const Page = () => {
  const { user } = useUser();
  const { notifications, activeTab } = useNotificationStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  return (
    <div className="h-full w-full space-y-8 p-8 rounded-xl">
      <span className="text-2xl font-bold">Notification</span>
      <div className="space-y-6">
        {notifications[activeTab].length > 0 ? (
          notifications[activeTab].map((notification: any, index: number) => (
            <div
              key={index}
              className="Notif relative h-20 w-full flex items-center text-sm text-gray-700 bg-gray-200 px-4 rounded-lg overflow-hidden"
            >
              {/* Render your notification content here */}
              <div className="flex-1 flex items-center gap-8">
                <span className="font-semibold">{notification.title}</span>
                <span className="text-xs">
                  {notification.message.length > 70
                    ? `${notification.message.substring(0, 70)}...`
                    : notification.message}
                </span>
                <span
                  className="text-xs text-gray-600 cursor-pointer hover:underline"
                  onClick={() => toggleExactTime(index)}
                  title={getTimeDisplay(notification.createdAt, true)}
                >
                  {getTimeDisplay(
                    notification.createdAt,
                    expandedIndex === index
                  )}
                </span>
              </div>
              <Link
                href={`/notifications/${notification.id}`}
                type="button"
                className="h-12 w-32 flex items-center justify-center text-sm text-white font-bold bg-blue-700 rounded-md"
              >
                Details
              </Link>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 pb-4">
            No notifications to display
          </div>
        )}
      </div>
      <div className="text-xl font-semibold">Possible Future Updates</div>
      <Image
        src="/notifications.jpg"
        alt="notification update"
        width={1000}
        height={1000}
      />
      <Image
        src="/notificationPopUp.jpg"
        alt="notification update"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default Page;
