type LogDetails = {
  id: string;
  monitorName: string,
  signature: string,
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call",
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit",
  dateOfVisit: string,
}

type TrialDetails = {
  id: string;
  investigatorName: string,
  protocol: string,
  siteVisit: string,
}