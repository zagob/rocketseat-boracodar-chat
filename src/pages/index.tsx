import { useContext, useEffect } from "react";
import { Message } from "@/components/Message";
import { AuthContext } from "@/contexts/AuthContext";
import { Login } from "@/components/Login";
import { Overflow } from "@/components/Overflow";
import dayjs from "dayjs";
import { useMessages } from "@/hooks/useMessages";
import { Profile } from "@/components/Profile";
import { SendMessage } from "@/components/SendMessage";
import { ref, update } from "firebase/database";
import { db } from "@/services/firebase";

export default function Home() {
  const { messages } = useMessages();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.onbeforeunload = async function () {
      await update(ref(db, `profiles/${user?.id}`), {
        status: "OFF",
      });
    };
  }, [user?.id]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {!user && <Overflow />}

      {!user && <Login />}

      <div className="w-full flex-1 p-10">
        <div></div>
        <div className="flex flex-col gap-2 h-full">
          <Profile />
          <div className="flex flex-col overflow-y-auto h-[580px]">
            <div className="flex-1 flex flex-col gap-4 px-3">
              {messages.map((message) => {
                const datFormat = dayjs(message.created_at).format("HH-mm");

                return (
                  <Message
                    key={message.id}
                    date={datFormat}
                    name={message.name}
                    textMessage={message.text}
                    isMessageOther={message.name !== user?.name}
                  />
                );
              })}
            </div>
          </div>

          <SendMessage />
        </div>
      </div>
    </div>
  );
}
