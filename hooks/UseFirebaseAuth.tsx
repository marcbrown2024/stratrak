import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

type FirebaseAuthFunction = (...args: any[]) => Promise<any>;

const useFirebaseAuth = (authFunction: FirebaseAuthFunction) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAuth = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authFunction(...args);
      return { result, success: true }; // Return success status and result
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            setError("An account with this email already exists.");
            break;
          case AuthErrorCodes.INVALID_PASSWORD:
            setError("Incorrect password. Please try again.");
            break;
          case AuthErrorCodes.USER_DELETED:
            setError("No user found with this email.");
            break;
          case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            setError("Too many unsuccessful login attempts. Please try again later.");
            break;
          case AuthErrorCodes.INVALID_EMAIL:
            setError("The email address is badly formatted.");
            break;
          default:
            setError("An unknown error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
      return { result: null, success: false }; // Return failure status
    } finally {
      setLoading(false);
    }
  };

  return { executeAuth, loading, error };
};

export default useFirebaseAuth;
