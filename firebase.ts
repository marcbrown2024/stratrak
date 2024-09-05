// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import moment from 'moment';

import { getAuth } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const secondaryApp = initializeApp(firebaseConfig, "secondary");
export const secondaryAuth = getAuth(secondaryApp);

export const db = getFirestore(app);

type DBResponse = {
  success: boolean;
  data?: any;
};

let response: DBResponse;

export const getTrials = async (orgId: string) => {
  const trials: TrialDetails[] = [];

  try {
    const trialsRef = collection(db, "trials");
    const q = query(trialsRef, where("orgId", "==", orgId))
    const trialsSnap = await getDocs(q);

    trialsSnap.forEach((doc) => {
      // Use Firestore's document ID as the `id` for each trial
      trials.push({ id: doc.id, ...doc.data() } as DBTrial);
    });
    response = { success: true, data: trials };
  } catch (e: any) {
    response = { success: false, data: e };
  }
  return response;
};

export const getTrial = async (trialId: string) => {
  try {
    const trialsRef = doc(db, "trials", trialId);
    const trialsSnap = await getDoc(trialsRef);

    response = { success: true, data: trialsSnap.data() as TrialDetails };
  } catch (e: any) {
    response = { success: false, data: e };
  }
  return response;
};

export const createTrial = async (trial: TrialDetails, orgId: string) => {
  try {
    const trialsRef = collection(db, "trials");
    const newTrialsRef = await addDoc(trialsRef, {...trial, orgId: orgId, progress: 'Active'});
    const newTrialsSnap = await getDoc(newTrialsRef);
    response = {
      success: true,
      data: {
        ...newTrialsSnap.data(),
      } as TrialDetails,
    };
  } catch (e: any) {
    response = { success: false };
  }
  return response;
};

export const deleteTrial = async (trialId: string) => {
  try {
    const trialRef = doc(db, "trials", trialId);
    await deleteDoc(trialRef);
    response = { success: true };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};

export const updateTrialProgress = async (
  trialId: string,
  progress: string
): Promise<{ success: boolean }> => {
  try {
    const trialRef = doc(db, "trials", trialId);
    await updateDoc(trialRef, { progress });
    return { success: true };
  } catch (e: any) {
    console.error(e.message);
    return { success: false };
  }
};

export const getLogs = async (trialId: string) => {
  const logs: LogDetails[] = [];

  try {
    const logsRef = collection(db, "logs");
    const q = query(logsRef, where("trialId", "==", trialId));

    const logsSnap = await getDocs(q);
    logsSnap.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data(), dateOfVisit: convertTimestampToDate(doc.data().dateOfVisit) ?? doc.data().dateOfVisit} as DBLog);
    });
    response = { success: true, data: logs };
  } catch (e: any) {
    console.log(e)
    response = { success: false, data: e };
  }
  return response;
};

export const createLog = async (log: LogDetails, trialId: string) => {
  try {
    const logsRef = collection(db, "logs");
    const newLogRef = await addDoc(logsRef, {
      ...log,
      trialId: trialId,
      dateOfVisit: convertToFirestoreTimestamp(log.dateOfVisit)
    });
    const newLogSnap = await getDoc(newLogRef);

    response = {
      success: true,
      data: {
        ...newLogSnap.data(),
        dateOfVisit: newLogSnap.data()!.dateOfVisit, //TODO: fix
      } as LogDetails,
    };
  } catch (e: any) {
    response = { success: false, data: e };
  }
  return response;
};

export const deleteLog = async (logId: string) => {
  try {
    const logRef = doc(db, "logs", logId);
    await deleteDoc(logRef);
    response = { success: true };
  } catch (e: any) {
    console.error(e.message);
    response = { success: false };
  }
  return response;
};

// create user

export const createUser = async (user: User) => {
  try {
    const usersRef = collection(db, "users");
    const newUserRef = await addDoc(usersRef, user);
    const userSnap = await getDoc(newUserRef);

    await enrollUser(userSnap.id); // add userId to org
    response = {
      success: true,
      data: user,
    };
  } catch (e) {
    response = { success: false, data: e };
  }
  return response;
};

export const userExists = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", "==", email),
      where("enrolled", "==", false)
    ); // user has never logged in before

    const userSnap = await getDocs(q);
    if (!userSnap.empty) {
      //user exists in org and we should create firebase user
      response = {
        success: true, //successfully fulfilled request
        data: {
          ...userSnap.docs[0],
          id: userSnap.docs[0].id,
          exists: true,
        }, //user exists in org and we should create firebase user
      };
    } else {
      response = {
        success: true, //successfully fulfilled request
        data: null, //user does not exist in org and we should create firebase user
      };
    }
  } catch (e) {
    response = { success: false, data: e };
  }

  return response;
};

export const enrollUser = async (userId: string) => {
  //first time user logging in
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const orgRef = doc(db, "organizations", userSnap.data()?.orgId);
    const orgSnap = await getDoc(orgRef);

    await setDoc(
      orgRef,
      {
        users: [...orgSnap.data()?.users, userId],
      },
      { merge: true }
    );

    response = {
      success: true,
    };
  } catch (e) {
    response = {
      success: false,
      data: e,
    };
  }

  return response;
};

export const getUserFromDb = async (firebaseUserId: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", firebaseUserId));
    const userSnap = await getDocs(q);

    if (!userSnap.empty) {
      response = {
        success: true,
        data: {
          ...userSnap.docs[0].data(),
          id: userSnap.docs[0].id,
        },
      };
    } else {
      response = {
        success: true,
        data: null,
      };
    }
  } catch (e) {
    response = { success: false, data: e };
  }

  return response;
};

export const uploadSignature = async (userId: string, base64String: string) => {
  try {
    // Create a document reference for the user
    const userRef = doc(db, "users", userId);

    // Save the base64 string to the user's document
    await setDoc(userRef, { signature: base64String }, { merge: true });

    return { success: true };
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return { success: false, data: e };
  }
};

export const userEmailExists = async (email: string) => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where("email", "==", email))
    const usersSnap = await getDocs(q)
    
    response = {
      success: true,
      data: !usersSnap.empty
    }
  } catch (e) {
    response = {
      success: false,
      data: e
    }
  }
  return response
}

const convertToFirestoreTimestamp = (dateString: string): Timestamp => {
  // Create a JavaScript Date object from the date string
  const date = new Date(dateString);

  // Convert to Firestore Timestamp
  return Timestamp.fromDate(date);
};

// Function to convert Firestore Timestamp to a formatted date string
const convertTimestampToDate = (timestamp: Timestamp | string): string => {
  try {
    // Convert Firestore Timestamp to JavaScript Date object
    const date = (timestamp as Timestamp).toDate().toLocaleString();
  
    // Format the date to 'YYYY-MM-DDThh:mm'
    const formattedDate = moment(date.slice(0, 16)).format('YYYY-MM-DD, h:mm A');
    return formattedDate;
  } catch (e) {
    return timestamp as string
  }
};

