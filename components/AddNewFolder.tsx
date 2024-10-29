// react/nextjs components
import React, { useState } from "react";
import { useParams } from "next/navigation";

// firestore functions
import { createTrialFolders, fetchFoldersInTrial } from "@/firebase";

// global store
import { useAlertStore } from "@/store/AlertStore";
import LoadingStore from "@/store/LoadingStore";
import AddNewFolderStore from "@/store/AddNewFolderStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// enums
import { AlertType } from "@/enums";

// icons
import { IoCloseCircleSharp } from "react-icons/io5";

type Props = {
  setFetchedFolderNames: React.Dispatch<React.SetStateAction<string[]>>;
};

const AddNewFolder = (props: Props) => {
  const { user } = useUser();
  const { trialId } = useParams();
  const [newFolderName, setNewFolderName] = useState("");
  const { setLoading } = LoadingStore();
  const { visible, setVisibility } = AddNewFolderStore();
  const [setAlert, closeAlert] = useAlertStore((state) => [
    state.setAlert,
    state.closeAlert,
  ]);

  const handleAddFolder = async () => {
    closeAlert();
    if (newFolderName.trim()) {
      setLoading(true);
      try {
        // Convert the new folder name to camelCase
        const camelCaseFolderName = newFolderName
          .split(" ")
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");

        // Fetch existing folders to check for duplicates
        const existingFolders = await fetchFoldersInTrial(
          `Organizations/${user?.orgId}/trials/${trialId}`
        );

        // Check if the folder name already exists
        if (existingFolders.includes(camelCaseFolderName)) {
          setAlert(
            { title: "Info!", content: "Folder name already exists." },
            AlertType.Info
          );
          return; // Exit early if the folder exists
        }

        // Create the new folder
        await createTrialFolders(
          [camelCaseFolderName], // Use the camelCase folder name
          trialId as string,
          user?.orgId as string
        );

        // Update state to include the new folder
        const updatedFolders = await fetchFoldersInTrial(
          `Organizations/${user?.orgId}/trials/${trialId}`
        );
        props.setFetchedFolderNames(updatedFolders);
        setAlert(
          { title: "Success!", content: "Folder was created successfully." },
          AlertType.Success
        );
      } catch (error) {
        setAlert(
          { title: "Error!", content: `Failed to create folder: ${error}` },
          AlertType.Error
        );
      } finally {
        setLoading(false);
        handleCloseModal();
      }
    }
  };

  const handleCloseModal = () => {
    setVisibility(false);
    setNewFolderName("");
  };

  return (
    <>
      {visible && (
        <div className="fixed h-full w-full flex items-center justify-center bg-white bg-opacity-60">
          <div className="relative h-48 w-1/4 flex flex-col items-center justify-center gap-4 bg-white mb-64 border border-gray-300 rounded-lg shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute -top-4 -right-4 bg-white rounded-full"
            >
              <IoCloseCircleSharp size={48} color="#2563eb" />
            </button>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-3/4 text-gray-600 p-2 mb-2 border-2 border-blue-500 rounded focus:outline-none focus:ring focus:ring-blue-100"
            />
            <div
              onClick={handleAddFolder}
              className="cursor-pointer bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewFolder;
