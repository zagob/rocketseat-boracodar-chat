import { Button } from "@/components/Button";
import { child, push, serverTimestamp, set, update } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onValue, ref, db } from "../services/firebase";
import { PaperPlaneRight, Power } from "phosphor-react";
import clsx from "clsx";
import { Message } from "@/components/Message";
import { AuthContext } from "@/contexts/AuthContext";
import { Login } from "@/components/Login";
import { Overflow } from "@/components/Overflow";
import Image from "next/image";
import dayjs from "dayjs";
import { useMessages } from "@/hooks/useMessages";

interface DataForm {
  message: string;
}

export default function Home() {
  const { messages } = useMessages();
  const { signInWithGoogle, signOutUser, user } = useContext(AuthContext);
  const { register, handleSubmit, formState, reset } = useForm<DataForm>();
  const [nameAnonimy, setNameAnonimy] = useState("");

  // console.log("user", user);

  async function handleSendText(data: { message: string }) {
    const newKeyQuestions = await push(
      child(ref(db), `profiles/${user?.id}/messages`),
      {
        text: data.message,
        created_at: serverTimestamp(),
      }
    );

    reset();

    // const newKeyQuestions = await push(
    //   child(ref(db), `anonymos-test/${nameAnonimy}`),
    //   data
    // );
  }
  // console.log("timestamp", dayjs(1675006853581).toDate());
  console.log("messages", messages);
  useEffect(() => {
    onValue(ref(db, "profiles"), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {!user && <Overflow />}

      {!user && <Login />}
      {/* <button
        className="absolute"
        onClick={async () => {
          // update(ref(db), updates);
          await update(ref(db, `profiles/123`), {
            nome: "theus",
          });
        }}
      >
        teste
      </button> */}
      <div className="w-full flex-1 p-10">
        <div></div>
        <div className="flex flex-col gap-2 h-full">
          <div
            className={clsx("flex items-center justify-between", {
              ["visible"]: user,
              ["invisible"]: !user,
            })}
          >
            <div className="flex items-center gap-4">
              <Image
                width={48}
                height={48}
                src={user?.avatar!}
                alt={user?.name!}
                className="rounded-full"
              />
              <div className="flex flex-col justify-start">
                <span className="text-base font-bold">{user?.name}</span>
                <span className="text-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </span>
              </div>
            </div>

            <Power
              size={32}
              onClick={signOutUser}
              className="text-zinc-400 hover:brightness-125 cursor-pointer"
            />
          </div>
          <div className="flex flex-col overflow-y-auto h-[580px]">
            <span className="text-center">Hoje 11:30</span>

            <div className="flex-1 flex flex-col gap-4 px-3">
              {/* <Message
                textMessage="Tive uma ideia incrível para um projeto! 😍"
                name="Matheus"
                date="11:30"
                isMessageOther
              />
              <Message
                textMessage="Sério? Me conta mais."
                name="Andre"
                date="11:31"
              />
              <Message
                textMessage="E se a gente fizesse um chat moderno e responsivo em apenas uma semana?"
                name="Andre"
                date="11:31"
                isMessageOther
              />
              <Message textMessage="#boraCodar! 🚀" name="Andre" date="11:31" /> */}
              {messages.map((message) => {
                const datFormat = dayjs(message.created_ar).format("HH-mm");
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

          <form onSubmit={handleSubmit(handleSendText)}>
            <label
              htmlFor=""
              className="w-full py-3 px-6 bg-[#282843] rounded-full flex items-center"
            >
              <input
                type="text"
                disabled={!user}
                placeholder="Digite sua mensagem"
                className="bg-transparent flex-1 outline-none text-xs"
                {...register("message")}
              />
              <button type="submit">
                <PaperPlaneRight size={24} />
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
