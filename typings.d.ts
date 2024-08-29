type LogDetails = {
  monitorName: string,
  signature: string,
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call",
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit",
  dateOfVisit: string | Date,
}

type TrialDetails = {
  id: string,
  investigatorName: string,
  protocol: string,
  siteVisit: string,
}

type TrialData = {
  id: number;
  investigatorName: string;
  protocol: string;
  siteVisit: string;
}

type TrialLog = {
  id: number;
  monitorName: string;
  Signature: string;
  typeOfVisit: string;
  purposeOfVisit: string;
  dateOfVisit: Date;
}
