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
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "stratrak-4614e.firebaseapp.com",
  projectId: "stratrak-4614e",
  storageBucket: "stratrak-4614e.appspot.com",
  messagingSenderId: "423217736137",
  appId: "1:423217736137:web:cd78f54c5438a501afe018",
  measurementId: "G-7QJWLM6YFP"
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
    response = {
      success: true,
      data: {
        ...newLogsSnap.data(),
        dateOfVisit: new Date(newLogsSnap.data()!.dateOfVisit),
      } as LogDetails,
    };
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
      trials.push({ id: doc.id, ...doc.data() } as DBTrial);
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
      logs.push({ id: doc.id, ...doc.data() } as DBLog);
    });
    response = { success: true, data: logs };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};

export const getTrial = async (trialId: string) => {
  try {
    const trialsRef = doc(db, "trials", trialId);
    const trialsSnap = await getDoc(trialsRef);

    response = { success: true, data: trialsSnap.data() as TrialDetails };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};
