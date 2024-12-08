"use client";

// react/nextjs components
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { notifId } = useParams();

  return <div className="text-2xl font-semibold text-center"> {notifId} Notification Page <br/> Working on Page</div>;
};

export default Page;
