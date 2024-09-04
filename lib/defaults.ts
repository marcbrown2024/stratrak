export const defaultLog: LogDetails = {
  monitorName: "",
  signature: "",
  typeOfVisit: "Remote",
  purposeOfVisit: "SIV",
  dateOfVisit: getCurrentDateTime(),
};

export const defaultTrial: TrialDetails = {
  investigatorName: "",
  protocol: "",
  siteVisit: "",
  progress: "",
};

// Function to format the current date and time in 'YYYY-MM-DDThh:mm' format
function getCurrentDateTime() {
  const now = new Date();

  // Pad single-digit numbers with leading zeros
  const padWithZero = (num: number) => (num < 10 ? `0${num}` : num);

  const year = now.getFullYear();
  const month = padWithZero(now.getMonth() + 1); // Months are 0-based
  const day = padWithZero(now.getDate());
  const hours = padWithZero(now.getHours());
  const minutes = padWithZero(now.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

