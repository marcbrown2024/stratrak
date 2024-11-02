"use client";

// react/nextjs components
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

// firestore functions
import { getTrials, fetchFoldersInTrial } from "@/firebase";

// global store
import SiteNavBarStore from "@/store/SiteNavBarStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// icons
import { HiArrowSmallLeft, HiArrowSmallRight } from "react-icons/hi2";

const SiteNavBtns = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const { trialId, regDocId } = useParams();
  const {
    trialsArray,
    foldersArray,
    currentFolder,
    setTrialsArray,
    setCurrentTrial,
    setFoldersArray,
    setCurrentFolder,
  } = SiteNavBarStore();
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (user) {
      if (pathname.endsWith("regulatoryDocs") || pathname.endsWith("logs")) {
        getTrials(user?.orgId).then((response) => {
          const trialIds = response.data.map(
            (trial: { id: string }) => trial.id
          );
          setTrialsArray(trialIds);
          setCurrentTrial(trialId as string);
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
          setCurrentFolder(regDocId as string);
          const initialIndex = folders.indexOf(regDocId as string);
          if (initialIndex !== -1) {
            setIndex(initialIndex);
          }
        });
      }
    }
  }, [user, trialId, regDocId, setTrialsArray, setFoldersArray]);

  useEffect(() => {
    console.log("Updated currentFolder: ", currentFolder);
  }, [currentFolder]);

  const handleBack = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
      if (pathname.endsWith("regulatoryDocs") || pathname.endsWith("logs")) {
        setCurrentTrial(trialsArray[index - 1]);
      } else if (pathname.endsWith("files")) {
        setCurrentFolder(foldersArray[index - 1]);
        console.log(foldersArray[index - 1]);
      }
    }
  };

  const handleForward = () => {
    if (pathname.endsWith("regulatoryDocs") || pathname.endsWith("logs")) {
      if (index < trialsArray.length - 1) {
        setIndex((prevIndex) => prevIndex + 1);
      }
      setCurrentTrial(trialsArray[index + 1]);
    } else if (pathname.endsWith("files")) {
      if (index < foldersArray.length - 1) {
        setIndex((prevIndex) => prevIndex + 1);
      }
      setCurrentFolder(foldersArray[index + 1]);
      console.log(foldersArray[index + 1]);
    }
  };

  return (
    (pathname.endsWith("regulatoryDocs") ||
      pathname.endsWith("files") ||
      pathname.endsWith("logs")) && (
      <div className="fixed top-20 w-9/12 2xl:w-[80%] flex justify-between space-x-4 pl-12 pr-8">
        <button
          onClick={handleBack}
          className="hover:text-gray-500 border rounded p-2 active:scale-90 duration-200"
        >
          <HiArrowSmallLeft size={24} />
        </button>

        <button
          onClick={handleForward}
          className="hover:text-gray-500 border rounded p-2 active:scale-90 duration-200"
        >
          <HiArrowSmallRight size={24} />
        </button>
      </div>
    )
  );
};

export default SiteNavBtns;
