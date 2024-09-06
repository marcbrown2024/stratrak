import admin from "firebase-admin";

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

let adminApp: admin.app.App | null = null;

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    storageBucket: params.storageBucket,
  });
}

export async function initAdmin() {
  if (!adminApp) {
    const params = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
      privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
    };

    adminApp = createFirebaseAdminApp(params);
  }

  return adminApp;
}

export const deleteUser = async (
  userId: string
): Promise<{ success: boolean }> => {
  if (!userId) {
    return { success: false };
  }

  try {
    const adminApp = await initAdmin();
    const auth = admin.auth(adminApp); // Use admin.auth(adminApp)
    const db = admin.firestore(adminApp); // Use admin.firestore(adminApp)

    // Delete user from Firebase Authentication
    await auth.deleteUser(userId);

    // Delete user document from Firestore
    const usersCollection = db.collection("users");
    const q = usersCollection.where("userId", "==", userId ?? "default");
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return { success: false };
    }

    const docToDelete = querySnapshot.docs[0];
    await docToDelete.ref.delete();

    return { success: true };
  } catch (e: any) {
    return { success: false };
  }
};
