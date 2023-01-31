import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import dayjs from "dayjs";

type DatabaseMessages = Record<
  string,
  {
    avatar_url: string;
    id: string;
    name: string;
    messages: Record<
      string,
      {
        created_at: Date;
        text: string;
      }
    >;
  }
>;

interface MessagesProps {
  id: string;
  name: string;
  text: string;
  avatar_url: string;
  created_at: Date;
}

export function useMessages() {
  const [messages, setMessages] = useState<MessagesProps[]>([]);

  useEffect(() => {
    const roomRef = ref(db, `profiles`);

    onValue(roomRef, (snapshot) => {
      const databaseMessages: DatabaseMessages = snapshot.val();

      const messages = Object.entries(databaseMessages)
        .map(([key, valueProfile]) => {
          return {
            id: key,
            messages: valueProfile?.messages
              ? Object?.entries(valueProfile.messages).map(
                  ([key, valueMessage]) => {
                    return {
                      id: key,
                      name: valueProfile.name,
                      avatar_url: valueProfile.avatar_url,
                      ...valueMessage,
                      created_at: dayjs(valueMessage.created_at).toDate(),
                    };
                  }
                )
              : [],
          };
        })
        .map((message) => message.messages)
        .flat()
        .sort(
          (a, b) => dayjs(a.created_at).diff() - dayjs(b.created_at).diff()
        );

      setMessages(messages);

      return () => {
        // off('value')
      };
    });
  }, []);

  return { messages };
}
