type LogDetails = {
  monitorName: string,
  signature: string,
  typeOfVisit: "Remote" | "Onsite" | "Waiver Call",
  purposeOfVisit: "SIV" | "IMV" | "COV" | "Audit",
  dateOfVisit: string,
}

type TrialDetails = {
  investigatorName: string,
  protocol: string,
  siteVisit: string,
}