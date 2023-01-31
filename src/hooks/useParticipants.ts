import { onValue, ref } from "firebase/database";
import { use, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import dayjs from "dayjs";
import { AuthContext } from "@/contexts/AuthContext";

type DatabaseMessages = Record<
  string,
  {
    avatar_url: string;
    id: string;
    name: string;
    status: "ON" | "OFF";
  }
>;

interface ParticipantsProps {
  id: string;
  name: string;
  avatar_url: string;
  status: "ON" | "OFF";
}

export function useParticipants() {
  const { user } = useContext(AuthContext);
  const [participants, setParticipants] = useState<ParticipantsProps[]>([]);

  useEffect(() => {
    const roomRef = ref(db, `profiles`);

    onValue(roomRef, (snapshot) => {
      const databaseParticipants: DatabaseMessages = snapshot.val();

      const participantsObject = Object.entries(databaseParticipants)
        .map(([key, valueProfile]) => {
          return {
            ...valueProfile,
          };
        })
        .filter((participant) => participant.id !== user?.id);

      console.log("participantsObject", participantsObject);

      setParticipants(participantsObject);

      return () => {
        // off('value')
      };
    });
  }, []);

  return { participants };
}
