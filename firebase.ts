// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_VAvLs0zFKgj1sSVVujCXQ1yCsnmQeT8",
  authDomain: "stratrak-e7d68.firebaseapp.com",
  projectId: "stratrak-e7d68",
  storageBucket: "stratrak-e7d68.appspot.com",
  messagingSenderId: "737654042646",
  appId: "1:737654042646:web:f605e8abaa68f06c8e8537",
  measurementId: "G-G438MCSLTW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

type DBResponse = {
  success: boolean;
  data?: any;
};

let response: DBResponse;

export const createLog = async (log: LogDetails, trialId: string) => {
  try {
    const logsRef = collection(db, "logs");
    const newLogsRef = await addDoc(logsRef, {
      ...log,
      trialId: trialId,
    });
    const newLogsSnap = await getDoc(newLogsRef);
    response = { success: true, data: newLogsSnap.data() as LogDetails };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};

export const getTrials = async () => {
  const trials: TrialDetails[] = [];

  try {
    const trialsRef = collection(db, "trials");
    const trialsSnap = await getDocs(trialsRef);

    trialsSnap.forEach((doc) => {
      // Use Firestore's document ID as the `id` for each trial
      trials.push({ id: doc.id, ...doc.data() } as TrialDetails);
    });
    response = { success: true, data: trials };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};

export const getLogs = async (id: string) => {
  const logs: LogDetails[] = [];

  try {
    const logsRef = collection(db, "logs");
    const q = query(logsRef, where("trialId", "==", id));

    const logsSnap = await getDocs(q);
    logsSnap.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as LogDetails);
    });
    response = { success: true, data: logs };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};
