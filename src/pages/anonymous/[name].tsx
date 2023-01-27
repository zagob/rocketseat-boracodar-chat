import { useMessages } from "@/hooks/useMessages";
import { db } from "@/services/firebase/index";
import { child, onValue, push, ref } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface DataForm {
  message: string;
}

export default function Anonymous() {
  const { query } = useRouter();
  const { messages } = useMessages();
  const name = query.name;

  const { register, handleSubmit, formState } = useForm<DataForm>();

  async function handleSendText(data: { message: string }) {
    const messageData = {
      name,
      message: data.message,
    };
    const newKeyQuestions = await push(child(ref(db), `tests-an`), messageData);
  }

  console.log("messages", messages);

  //   useEffect(() => {
  //     onValue(ref(db, "anonymos-test"), (snapshot) => {
  //       const data = snapshot.val();
  //       console.log(data);
  //     });
  //   }, []);
  return (
    <div className="border w-[600px] h-[400px] flex flex-col bg-zinc-800 leading-tight p-2">
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto mb-2">
        {messages.map((message) => (
          <div className="bg-zinc-600 p-2 rounded-xl">
            <h4 className="text-zinc-400">{message.message.name}</h4>
            <span key={message.id} className="ml-2">
              {message.message.message}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleSendText)} className="">
        <input
          type="text"
          placeholder="text"
          className="text-black px-2 py-1"
          {...register("message")}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
