"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

// firestore functions
import { getTrials, fetchFoldersInTrial } from "@/firebase";

// custom hooks
import useUser from "@/hooks/UseUser";

// icons
import { HiArrowSmallLeft, HiArrowSmallRight } from "react-icons/hi2";

const SiteNavBtns = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { trialId, regDocId } = useParams();
  const { user } = useUser();
  const [trialsArray, setTrialsArray] = useState<string[]>([]);
  const [foldersArray, setFoldersArray] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (user) {
      if (pathname.endsWith("regulatoryDocs") || pathname.endsWith("logs")) {
        getTrials(user?.orgId).then((response) => {
          const trialIds = response.data.map(
            (trial: { id: string }) => trial.id
          );
          setTrialsArray(trialIds);
          const initialIndex = trialIds.indexOf(trialId);
          if (initialIndex !== -1) {
            setIndex(initialIndex);
          }
        });
      }

      if (pathname.endsWith("files")) {
        fetchFoldersInTrial(
          `Organizations/${user?.orgId}/trials/${trialId}`
        ).then((response) => {
          const folders = response.map((folder: string) => folder);
          setFoldersArray(folders);
          const initialIndex = folders.indexOf(regDocId as string);
          if (initialIndex !== -1) {
            setIndex(initialIndex);
          }
        });
      }
    }
  }, [user, trialId, regDocId, setTrialsArray, setFoldersArray]);

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
      if (pathname.endsWith("regulatoryDocs")) {
        router.push(`/monitoringLogs/${trialsArray[index - 1]}/regulatoryDocs`);
      } else if (pathname.endsWith("logs")) {
        router.push(`/monitoringLogs/${trialsArray[index - 1]}/logs`);
      } else if (pathname.endsWith("files")) {
        router.push(
          `/monitoringLogs/${trialId}/regulatoryDocs/${
            foldersArray[index - 1]
          }/files`
        );
      }
    }
  };

  const handleForward = () => {
    if (index < trialsArray.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    }
    if (pathname.endsWith("regulatoryDocs")) {
      router.push(`/monitoringLogs/${trialsArray[index + 1]}/regulatoryDocs`);
    } else if (pathname.endsWith("logs")) {
      router.push(`/monitoringLogs/${trialsArray[index + 1]}/logs`);
    } else if (pathname.endsWith("files")) {
      router.push(
        `/monitoringLogs/${trialId}/regulatoryDocs/${
          foldersArray[index + 1]
        }/files`
      );
    }
  };

  return (
    (pathname.endsWith("regulatoryDocs") ||
      pathname.endsWith("files") ||
      pathname.endsWith("logs")) && (
      <div className="fixed top-20 w-[76%] 2xl:w-[80%] flex">
        <div className="w-1/2 flex justify-start">
          {index > 0 && (
            <button
              onClick={handleBack}
              className="hover:text-gray-500 border rounded p-2 active:scale-90 duration-200"
            >
              <HiArrowSmallLeft size={24} />
            </button>
          )}
        </div>
        <div className="w-1/2 flex justify-end">
          {((pathname.endsWith("regulatoryDocs") &&
            index !== trialsArray.length-1) ||
            (pathname.endsWith("logs") && index !== trialsArray.length-1) ||
            (pathname.endsWith("files") && index !== foldersArray.length-1)) && (
            <button
              onClick={handleForward}
              className="hover:text-gray-500 border rounded p-2 active:scale-90 duration-200"
            >
              <HiArrowSmallRight size={24} />
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default SiteNavBtns;
