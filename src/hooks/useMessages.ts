import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import dayjs from "dayjs";

export function useMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const roomRef = ref(db, `anonymos-test`);
    const roomRef = ref(db, `profiles`);

    onValue(roomRef, (snapshot) => {
      const databaseRoom = snapshot.val();

      const firebaseQuestions = databaseRoom?.questions ?? {};

      console.log("firebaseMessages", firebaseQuestions);

      //   console.log("databaseRoom", databaseRoom);
      //   const firebaseQuestions = databaseRoom?.questions ?? {};

      //   console.log("firebaseQuestions", firebaseQuestions);

      // transformar um Objeto em Array
      const messages = Object.entries(databaseRoom)
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
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      console.log(
        "split messages",
        messages.map((message) => message.messages).flat()
      );

      //   console.log("parsedQuestion", parsedQuestion);

      //   setTitle(databaseRoom?.title);
      setMessages(messages);

      return () => {
        // off('value')
      };
    });
  }, []);

  return { messages };
}
