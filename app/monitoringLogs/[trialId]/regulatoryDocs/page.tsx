"use client";

// react/nextjs components
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// firestore functions
import { createTrialFolders, fetchFoldersInTrial, getTrial } from "@/firebase";

// global store
import LoadingStore from "@/store/LoadingStore";

// custom hooks
import useUser from "@/hooks/UseUser";

// mui assets
import { GridColDef } from "@mui/x-data-grid";

//components
import RegulatoryDocTable from "@/components/RegulatoryDocTable";
import AddNewFolder from "@/components/AddNewFolder";

const folderNames = [
  "monitoringVisitReports",
  "caseReportForms",
  "clinicalTrialAgreement",
  "curriculumVitaeOfInvestigators",
  "delegationOfAuthorityLog",
  "drugAccountabilityRecords",
  "financialDisclosureForm",
  "informedConsentForm",
  "institutionalReviewBoard",
  "insuranceOrIndemnityDocumentation",
  "investigationalNewDrug",
  "investigatorBrochure",
  "seriousAdverseEvent",
  "siteSpecificStandard",
  "sourceDocuments",
  "studyProtocol",
];

const columns: GridColDef[] = [
  {
    field: "fileName",
    headerClassName: "text-blue-500 uppercase bg-blue-50",
    type: "string",
    headerName: "Regulatory Submissions",
    flex: 3,
  },
];

const RegulatoryDocPage = () => {
  const { user } = useUser();
  const { trialId } = useParams<{
    trialId: string;
  }>();
  const { setLoading } = LoadingStore();
  const [trial, setTrial] = useState<TrialDetails>({} as TrialDetails);
  const [fetchedFolderNames, setFetchedFolderNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFolder = async () => {
      setLoading(true);

      // Fetch trial details
      const trialResponse = await getTrial(trialId as string);
      setTrial(trialResponse.data);

      // Fetch existing folders
      const regDocsResponse: string[] = await fetchFoldersInTrial(
        `Organizations/${user?.orgId}/trials/${trialId}`
      );
      setFetchedFolderNames(regDocsResponse);

      // Check for missing folders
      const missingFolders = folderNames.filter(
        (folder) => !regDocsResponse.includes(folder)
      );

      if (missingFolders.length > 0) {
        // Create missing folders
        await createTrialFolders(
          missingFolders,
          trialId as string,
          user?.orgId as string
        );

        // Refetch folders after creation
        const updatedFolders: string[] = await fetchFoldersInTrial(
          `Organizations/${user?.orgId}/trials/${trialId}`
        );
        setFetchedFolderNames(updatedFolders);
      }

      setLoading(false);
    };

    if (user?.orgId && trialId) {
      fetchFolder();
    }
  }, [user?.orgId, trialId]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-start gap-10">
      <div className="h-fit w-[60rem] 2xl:w-[80rem] flex items-start justify-start">
        <div className="w-full sm:w-fit flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 bg-white px-4 sm:px-8 py-2 rounded-lg border">
          <div className="font-bold text-gray-500">
            <p>Investigator Name:</p>
            <p>Protocol:</p>
            <p>Site Visit:</p>
          </div>
          <div className="flex flex-col">
            <p>{trial?.investigatorName || "N/A"}</p>
            <p>{trial?.protocol || "N/A"}</p>
            <p>{trial?.siteVisit || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <RegulatoryDocTable
          columns={columns}
          rows={fetchedFolderNames}
          trialId={trialId as string}
        />
      </div>
      <AddNewFolder setFetchedFolderNames={setFetchedFolderNames} />
    </div>
  );
};

export default RegulatoryDocPage;
