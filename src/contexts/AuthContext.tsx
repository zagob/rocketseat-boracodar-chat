import { ref, update } from "firebase/database";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  auth,
  db,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
  status: "OFF" | "ON";
};

type AuthContextType = {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account.");
        }

        await update(ref(db, `profiles/${uid}`), {
          status: "ON",
        });

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          status: "ON",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    if (user) {
      const { displayName, photoURL, uid } = user;

      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }

      await update(ref(db, `profiles/${uid}`), {
        id: uid,
        name: displayName,
        avatar_url: photoURL,
        status: "ON",
      });

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        status: "ON",
      });
    }
  }

  async function signOutUser() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOutUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
