"use client";

// react/nextjs components
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { notifId } = useParams();

  return <div> {notifId} Notification Page</div>;
};

export default Page;
