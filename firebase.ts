// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import moment from "moment";

import { getAuth } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  arrayUnion,
  arrayRemove,
  orderBy,
  writeBatch,
} from "firebase/firestore";

import {
  deleteObject,
  listAll,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";

import JSZip from "jszip";

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
    const date = (timestamp as Timestamp).toDate();

    // Format the date directly with moment, no need to slice
    const formattedDate = moment(date).format("YYYY-MM-DD, h:mm A");
    return formattedDate;
  } catch (e) {
    return timestamp as string; // If it's not a Timestamp, return it as a string
  }
};

export const getTrials = async (orgId: string) => {
  const trials: TrialDetails[] = [];

  try {
    const trialsRef = collection(db, "trials");
    const q = query(trialsRef, where("orgId", "==", orgId));
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
    const newTrialsRef = await addDoc(trialsRef, {
      ...trial,
      orgId: orgId,
      progress: "Active",
    });
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
    return { success: false };
  }
};

export const updatePrivilege = async (
  email: string,
  isAdmin: boolean
): Promise<{ success: boolean }> => {
  try {
    // Reference to the "users" collection
    const usersCollection = collection(db, "users");

    // Create a query to find the document with the matching email
    const q = query(usersCollection, where("email", "==", email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No document found with the specified email
      return { success: false };
    }

    // Assume there's only one document per email, get the first document found
    const docToUpdate = querySnapshot.docs[0];

    // Update the isAdmin field
    await updateDoc(docToUpdate.ref, { isAdmin });

    return { success: true };
  } catch (e: any) {
    return { success: false };
  }
};

// export const updateUserLastActivity = async (
//   userId: string
// ): Promise<{ success: boolean }> => {
//   try {
//     // Create a query to find the document where userId matches
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("userId", "==", userId));

//     // Get the documents matching the query
//     const querySnapshot = await getDocs(q);

//     // Check if a document was found
//     if (!querySnapshot.empty) {
//       const now = new Date();
//       const firestoreTimestamp = Timestamp.fromDate(now); // Convert to Firestore Timestamp

//       // Update the lastActivity field in matching document
//       const updatePromises = querySnapshot.docs.map((doc) =>
//         updateDoc(doc.ref, { lastActivity: firestoreTimestamp })
//       );

//       // Wait for all updates to complete
//       await Promise.all(updatePromises);

//       return { success: true };
//     } else {
//       return { success: false };
//     }
//   } catch (e: any) {
//     return { success: false };
//   }
// };

export const updateUserLastActivity = async (
  userId: string
): Promise<{ success: boolean }> => {
  try {
    // Create a query to find the document where userId matches
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Check if a document was found
    if (!querySnapshot.empty) {
      const now = new Date();
      const firestoreTimestamp = Timestamp.fromDate(now); // Convert to Firestore Timestamp

      // Get the current authenticated user to access the creation date
      const auth = getAuth();
      const user = auth.currentUser;

      // Check if user is authenticated and retrieve the creation date
      let dateAdded = user?.metadata.creationTime;
      if (!dateAdded) {
        // If no creation date is found, use the current date as fallback
        dateAdded = now.toISOString();
      }

      // Update the lastActivity and dateAdded fields in matching document
      const updatePromises = querySnapshot.docs.map((doc) => {
        // Only set dateAdded if it's not already present
        const updateData: any = { lastActivity: firestoreTimestamp };
        if (!doc.data().dateAdded) {
          updateData.dateAdded = Timestamp.fromDate(new Date(dateAdded));
        }

        return updateDoc(doc.ref, updateData);
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      return { success: true };
    } else {
      return { success: false };
    }
  } catch (e: any) {
    console.error(e);
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
      logs.push({
        id: doc.id,
        ...doc.data(),
        dateOfVisit:
          convertTimestampToDate(doc.data().dateOfVisit) ??
          doc.data().dateOfVisit,
      } as DBLog);
    });
    response = { success: true, data: logs };
  } catch (e: any) {
    response = { success: false, data: e };
  }
  return response;
};

export const createTrialFolders = async (
  folderNames: string[],
  trialId: string,
  organizationId: string
) => {
  const storage = getStorage(); // Get the storage instance
  const folderPaths = folderNames.map(
    (name) => `Organizations/${organizationId}/trials/${trialId}/${name}`
  );

  const promises = folderPaths.map(async (path) => {
    const storageRef = ref(storage, path); // Use the ref function to get the reference
    const placeholderFile = new Blob([], { type: "text/plain" }); // An empty file
    await uploadBytes(ref(storageRef, ".placeholder"), placeholderFile); // Use uploadBytes to upload the placeholder
  });

  await Promise.all(promises);
};

export const uploadFilesToFolder = async (
  folderName: string,
  trialId: string,
  organizationId: string,
  files: FileList | null,
  user: { fName: string; lName: string }
) => {
  const storage = getStorage();
  const folderPath = `Organizations/${organizationId}/trials/${trialId}/${folderName}/`;

  if (files) {
    const promises = Array.from(files).map(async (file) => {
      const fileRef = ref(storage, `${folderPath}${file.name}`);
      const now = new Date();
      const localTime = now.toLocaleString();

      // Create metadata
      const metadata = {
        customMetadata: {
          uploadedBy: `${user.fName} ${user.lName}`,
          uploadedAt: localTime,
        },
      };

      await uploadBytes(fileRef, file, metadata);
    });

    await Promise.all(promises);
  }
};

export const fetchFoldersInTrial = async (path: string) => {
  const storage = getStorage();
  const trialRef = ref(storage, path);

  try {
    const result = await listAll(trialRef);
    const folders = result.prefixes.map((folder) => folder.name);
    return folders;
  } catch (error) {
    return [];
  }
};

export const deleteFolder = async (
  organizationId: string,
  trialId: string,
  regDocId: string
): Promise<boolean> => {
  const storage = getStorage();
  const folderRef = ref(
    storage,
    `Organizations/${organizationId}/trials/${trialId}/${regDocId}`
  );
  try {
    const result = await listAll(folderRef);
    const deletePromises = result.items.map((fileRef) => deleteObject(fileRef));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchFilesInFolder = async (
  organizationId: string,
  trialId: string,
  folderName: string
) => {
  const storage = getStorage();
  const folderRef = ref(
    storage,
    `/Organizations/${organizationId}/trials/${trialId}/${folderName}`
  );
  try {
    const result = await listAll(folderRef);
    const files = result.items.map((item) => item.name);
    return files;
  } catch (error) {
    return [];
  }
};

export const deleteFile = async (
  organizationId: string,
  trialId: string,
  folderName: string,
  fileName: string
): Promise<boolean> => {
  const storage = getStorage();
  const fileRef = ref(
    storage,
    `Organizations/${organizationId}/trials/${trialId}/${folderName}/${fileName}`
  );

  try {
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    return false;
  }
};

export const getFileMetadata = async (
  organizationId: string,
  trialId: string,
  folderName: string,
  fileName: string
) => {
  const storage = getStorage();
  const fileRef = ref(
    storage,
    `Organizations/${organizationId}/trials/${trialId}/${folderName}/${fileName}`
  );
  try {
    const metadata = await getMetadata(fileRef);
    return metadata;
  } catch (error) {
    return null;
  }
};

export const fetchAndPreviewFile = async (
  organizationId: string,
  trialId: string,
  folderName: string,
  fileName: string
) => {
  const storage = getStorage();
  const fileRef = ref(
    storage,
    `Organizations/${organizationId}/trials/${trialId}/${folderName}/${fileName}`
  );
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    return null;
  }
};

export const downloadFolderAsZip = async (
  organizationId: string,
  trialId: string,
  zipFileName: string
) => {
  const jszip = new JSZip();
  const storage = getStorage();
  const folderPath = `Organizations/${organizationId}/trials/${trialId}`;
  const folderRef = ref(storage, folderPath);

  try {
    // Function to process each folder and retrieve its files
    const processFolder = async (folderRef: StorageReference) => {
      const folderContents = await listAll(folderRef);

      // Iterate through each subfolder
      const folderPromises = folderContents.prefixes.map(
        async (subFolderRef) => {
          const subFolderContents = await listAll(subFolderRef); // List contents of the subfolder

          // Iterate through each file in the subfolder
          const filePromises = subFolderContents.items.map(async (fileRef) => {
            const fileName = fileRef.name; // Get the file name
            const fileURL = await getDownloadURL(fileRef); // Get the download URL
            const response = await fetch(fileURL); // Fetch the file
            const blob = await response.blob(); // Get the file as a Blob
            // Add the file to the zip, optionally using the folder structure
            jszip.file(`${zipFileName}/${subFolderRef.name}/${fileName}`, blob); // Maintain folder structure in zip
          });

          // Wait for all file downloads to complete in the subfolder
          await Promise.all(filePromises);
        }
      );

      // Wait for all subfolder processing to complete
      await Promise.all(folderPromises);
    };

    // Start processing from the main folder
    await processFolder(folderRef);

    // Generate the zip file
    const zipContent = await jszip.generateAsync({ type: "blob" });

    // Create a download link for the zip file
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(zipContent);
    downloadLink.download = `${zipFileName}.zip`; // Use the provided zipFileName
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    return error;
  }
};

export const createLog = async (
  log: LogDetails,
  trialId: string,
  userId1: string,
  adminName: string,
  userId2: string,
  monitorName: string
) => {
  try {
    const logsRef = collection(db, "logs");
    const newLogRef = await addDoc(logsRef, {
      ...log,
      trialId: trialId,
      ammendedDate: log.amendedDate
        ? convertToFirestoreTimestamp(log.amendedDate)
        : null,
      dateOfVisit: convertToFirestoreTimestamp(log.dateOfVisit),
    });
    const newLogSnap = await getDoc(newLogRef);

    response = {
      success: true,
      data: {
        ...newLogSnap.data(),
        dateOfVisit: newLogSnap.data()!.dateOfVisit, //TODO: fix
      } as LogDetails,
    };

    if (response.success && userId1) {
      await createAmendNotification(
        userId1,
        adminName,
        userId2,
        monitorName,
        trialId
      );
    }
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
    // Reference the 'users' collection and query for documents with the matching userId field
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));

    // Fetch matching documents
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update the signature field in the first matching document
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { signature: base64String });

      return { success: true };
    }
  } catch (e) {
    return { success: false, data: e };
  }
};

export const userEmailExists = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const usersSnap = await getDocs(q);

    response = {
      success: true,
      data: !usersSnap.empty,
    };
  } catch (e) {
    response = {
      success: false,
      data: e,
    };
  }
  return response;
};

export const getAllUsers = async (orgId: string) => {
  const users: User[] = [];

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("orgId", "==", orgId));
    const usersSnap = await getDocs(q);

    usersSnap.forEach((doc) => {
      const userData = doc.data();

      users.push({
        ...userData,
        lastActivity: convertTimestampToDate(userData.lastActivity),
        dateAdded: convertTimestampToDate(userData.dateAdded),
      } as User);
    });

    return { success: true, data: users };
  } catch (e: any) {
    return { success: false, data: e };
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<ProfileFormData>
): Promise<{ success: boolean }> => {
  try {
    // Reference to the users collection
    const usersRef = collection(db, "users");

    // Query to find the document with the specific userId
    const q = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Check if any documents matched the query
    if (querySnapshot.empty) {
      return { success: false };
    }

    // Assuming userId is unique, update the first matching document
    const userDoc = querySnapshot.docs[0]; // Get the first document from the results
    const userDocRef = doc(db, "users", userDoc.id); // Get a reference to the document

    await updateDoc(userDocRef, profileData);
    return { success: true };
  } catch (e: any) {
    return { success: false };
  }
};

export const getOrganizationName = async (
  orgId: string
): Promise<string | null> => {
  try {
    // Reference the document using the orgId as the document ID
    const docRef = doc(db, "organizations", orgId);

    // Fetch the document
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Retrieve the 'name' field from the document
      const organizationName = data.name as string;

      return organizationName;
    } else {
      // Document not found
      return null;
    }
  } catch (error) {
    throw new Error("Error getting organization name");
  }
};

export const getOptions = async (orgId: string) => {
  try {
    const optionsRef = collection(db, "options");
    const optionsSnap = await getDocs(optionsRef);
    const matchingDoc = optionsSnap.docs.find((doc) => doc.id === orgId);

    if (matchingDoc) {
      const options = {
        id: matchingDoc.id,
        ...matchingDoc.data(),
      };
      return { success: true, data: options };
    } else {
      return {
        success: false,
        data: `No document found with the ID matching orgId: ${orgId}`,
      };
    }
  } catch (e: any) {
    return { success: false, data: e.message || "An error occurred" };
  }
};

export const updateOptionsField = async (
  orgId: string,
  field: string,
  action: string,
  value: string
) => {
  try {
    // Get the document reference by orgId
    const docRef = doc(db, "options", orgId);

    // Perform the action (add or remove)
    if (action === "add") {
      // Add value to the array field
      await updateDoc(docRef, {
        [field]: arrayUnion(value), // arrayUnion ensures value is added only if not present
      });
    } else if (action === "remove") {
      // Remove value from the array field
      await updateDoc(docRef, {
        [field]: arrayRemove(value), // arrayRemove ensures value is removed
      });
    }

    return {
      success: true,
      data: `${action} operation successful for ${field}`,
    };
  } catch (e: any) {
    return { success: false, data: e.message || "An error occurred" };
  }
};

export const updateLogSignature = async (
  documentId: string,
  signature: string
): Promise<{ success: boolean }> => {
  try {
    // Reference to the document in the "trials" collection by document ID
    const docRef = doc(db, "logs", documentId);

    // Update the signature field with the base64 string
    await updateDoc(docRef, { signature: signature });

    return { success: true };
  } catch (e: any) {
    // Log the error if needed for debugging
    return { success: false };
  }
};

// Function to check and clone global notifications into the user's notification subcollection
export const fetchGlobalNotificationsForUser = async (
  userId: string
): Promise<void> => {
  try {
    // Reference to the users collection
    const usersRef = collection(db, "users");

    // Query to find the user document where the userId field matches the parameter
    const userQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return;
    }

    // Assuming there's only one document with the matching userId
    const userDoc = querySnapshot.docs[0];

    // Reference to the user's notifications subcollection
    const notificationsRef = collection(userDoc.ref, "notifications");

    // Fetch existing user-specific notifications
    const userNotificationsSnapshot = await getDocs(notificationsRef);
    const existingNotificationIds = userNotificationsSnapshot.docs.map(
      (doc) => doc.id
    );

    // Fetch global notifications
    const globalNotificationsRef = collection(db, "globalNotifications");
    const globalNotificationsSnapshot = await getDocs(globalNotificationsRef);

    // Use Firestore writeBatch
    const batch = writeBatch(db);
    globalNotificationsSnapshot.docs.forEach((globalDoc) => {
      if (!existingNotificationIds.includes(globalDoc.id)) {
        const newDocRef = doc(notificationsRef, globalDoc.id);
        batch.set(newDocRef, globalDoc.data());
      }
    });

    // Commit the batched writes
    await batch.commit();
  } catch (error) {}
};

// Function to fetch user-specific notifications
export const fetchNotifications = async (
  userId: string
): Promise<UserNotification[]> => {
  try {
    // Ensure global notifications are synced first
    await fetchGlobalNotificationsForUser(userId);

    // Reference to the users collection
    const usersRef = collection(db, "users");

    // Query to find the user document where the userId field matches the parameter
    const userQuery = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return [];
    }

    // Assuming there's only one document with the matching userId
    const userDoc = querySnapshot.docs[0];

    // Reference to the user's notifications subcollection
    const notificationsRef = collection(userDoc.ref, "notifications");

    // Query to get user-specific notifications, ordered by createdAt timestamp
    const userNotificationsQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc")
    );

    // Get the user-specific notifications
    const userNotificationsSnapshot = await getDocs(userNotificationsQuery);

    // Map through the query results and return the user-specific notifications
    const userNotifications = userNotificationsSnapshot.docs.map((doc) => ({
      id: doc.id, // Use doc.id as the 'id' for the notification
      ...doc.data(),
      createdAt: convertTimestampToDate(doc.data().createdAt), // Convert Firestore timestamp to string
    })) as UserNotification[];

    return userNotifications;
  } catch (error) {
    return [];
  }
};

export const updateIsRead = async (
  userId: string,
  notificationId: string,
  status: boolean
): Promise<boolean> => {
  try {
    // Reference to the 'users' collection
    const usersRef = collection(db, "users");

    // Query to find the user document where the userId field matches the parameter
    const userQuery = query(usersRef, where("userId", "==", userId));

    // Get the query snapshot of the users collection
    const userQuerySnapshot = await getDocs(userQuery);

    // If the user is not found
    if (userQuerySnapshot.empty) {
      return false;
    }

    // Assuming there's only one document with the matching userId
    const userDoc = userQuerySnapshot.docs[0];

    const notificationRef = doc(
      db,
      "users",
      userDoc.id,
      "notifications",
      notificationId
    );

    // Update the 'isRead' field to the new status for the user-specific notification
    await updateDoc(notificationRef, {
      isRead: status,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const createAmendNotification = async (
  userId1: string,
  adminName: string,
  userId2: string,
  monitorName: string,
  amendlogNum: string
): Promise<void> => {
  const now = new Date();
  const firestoreTimestamp = Timestamp.fromDate(now);

  try {
    // Function to generate a notification object based on userId
    const generateNotification = (userId: string) => ({
      title: "Amend Log",
      message:
        userId === userId2
          ? `Admin ${adminName} has requested that you add your signature to amended log. Link:/monitoringLogs/${amendlogNum}/logs`
          : `Notification to set signature for amended log was sent to ${monitorName}.`,
      isRead: false,
      createdAt: firestoreTimestamp,
    });

    // Function to fetch the user document reference
    const getUserDocRef = async (userId: string) => {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].ref;
      }
      throw new Error(`User with ID ${userId} not found.`);
    };

    // Get document references for both users
    const userDocRef1 = await getUserDocRef(userId1);
    const userDocRef2 = await getUserDocRef(userId2);

    // Create notification in the notifications subcollection for both users
    const notification1 = generateNotification(userId1);
    const notification2 = generateNotification(userId2);

    await Promise.all([
      setDoc(doc(collection(userDocRef1, "notifications")), notification1),
      setDoc(doc(collection(userDocRef2, "notifications")), notification2),
    ]);
  } catch (error) {}
};

export const createNotification = async (
  userId: string,
  title: string,
  message: string
): Promise<void> => {
  const now = new Date();
  const firestoreTimestamp = Timestamp.fromDate(now);

  try {
    // Function to fetch the user document reference
    const getUserDocRef = async (userId: string) => {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].ref;
      }
      throw new Error(`User with ID ${userId} not found.`);
    };

    // Fetch the user document reference
    const userDocRef = await getUserDocRef(userId);

    // Create the notification object
    const notification = {
      title,
      message,
      isRead: false,
      createdAt: firestoreTimestamp,
    };

    // Add the notification to the user's notifications subcollection
    await setDoc(doc(collection(userDocRef, "notifications")), notification);
  } catch (error) {}
};

export const getAmendedLogs = async (userOrg: string) => {
  const amendedLogs: LogDetails[] = [];

  try {
    // Step 1: Get all trial IDs from the 'trials' collection that match the orgId
    const trialsRef = collection(db, "trials");
    const q = query(trialsRef, where("orgId", "==", userOrg)); // Filter trials by orgId
    const trialsSnap = await getDocs(q);

    const trialIds: string[] = [];
    trialsSnap.forEach((doc) => {
      trialIds.push(doc.id); // Collect all trial IDs that match the orgId
    });

    if (trialIds.length === 0) {
      return { success: false, data: "No trials found for this orgId" };
    }

    // Step 2: Query the 'logs' collection in batches of 30 to match trialId in logs
    const logsRef = collection(db, "logs");

    // Function to run queries in batches
    const fetchLogsInBatches = async (trialIds: string[]) => {
      const batchSize = 30;
      let allLogs: LogDetails[] = [];

      // Loop through trialIds in batches of 30
      for (let i = 0; i < trialIds.length; i += batchSize) {
        const batch = trialIds.slice(i, i + batchSize); // Create a batch of 30 or fewer trialIds

        const logsQuery = query(logsRef, where("trialId", "in", batch)); // Query logs by this batch of trialIds
        const logsSnap = await getDocs(logsQuery);

        // Filter logs with amended: true
        logsSnap.forEach((doc) => {
          const logData = doc.data();
          if (logData.amended === true) {
            allLogs.push({
              id: doc.id,
              ...logData,
              amendedDate:
                convertTimestampToDate(logData.amendedDate) ??
                logData.amendedDate,
              dateOfVisit:
                convertTimestampToDate(logData.dateOfVisit) ??
                logData.dateOfVisit,
            } as DBLog);
          }
        });
      }

      return allLogs;
    };

    // Fetch logs in batches and merge them
    const fetchedLogs = await fetchLogsInBatches(trialIds);
    amendedLogs.push(...fetchedLogs);

    return { success: true, data: amendedLogs };
  } catch (e: any) {
    return { success: false, data: e };
  }
};
