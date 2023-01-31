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
import { useParticipants } from "@/hooks/useParticipants";
import clsx from "clsx";
import Image from "next/image";

export default function Home() {
  const { messages } = useMessages();
  const { participants } = useParticipants();
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

      <div className="w-full flex-1 p-10 flex gap-2">
        <div className="w-[200px] flex flex-col gap-4 shadow-2xl">
          <h4 className="text-center py-2 shadow-2xl">Participantes</h4>
          <div className="flex flex-col gap-2">
            {participants.map((participant) => {
              return (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 bg-zinc-800 rounded-lg p-4"
                >
                  <Image
                    width={42}
                    height={42}
                    src={participant.avatar_url}
                    alt={participant.name}
                    className="rounded-full"
                  />
                  <div className="flex flex-col justify-start">
                    <span className="text-sm font-bold">
                      {participant.name}
                    </span>
                    <span className="text-xs flex items-center gap-2">
                      <div
                        className={clsx("w-2 h-2 rounded-full", {
                          ["bg-green-500"]: participant.status === "ON",
                          ["bg-red-500"]: participant.status === "OFF",
                        })}
                      />
                      {participant.status === "ON" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2 h-full">
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
