export const defaultLog: LogDetails = {
  monitorName: "",
  signature: "",
  typeOfVisit: "Remote",
  purposeOfVisit: "SIV",
  dateOfVisit: getCurrentDate(),
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}