import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";

export function useMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const roomRef = ref(db, `anonymos-test`);
    const roomRef = ref(db, `tests-an`);

    onValue(roomRef, (snapshot) => {
      const databaseRoom = snapshot.val();

      //   console.log("databaseRoom", databaseRoom);
      //   const firebaseQuestions = databaseRoom?.questions ?? {};

      //   console.log("firebaseQuestions", firebaseQuestions);

      // transformar um Objeto em Array
      const messages = Object.entries(databaseRoom).map(([key, value]) => {
        return {
          id: key,
          message: value,
        };
      });

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
