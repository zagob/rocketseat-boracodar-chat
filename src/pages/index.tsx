import { Button } from "@/components/Button";
import { writeUserData } from "@/services/firebase/function";
import { child, push } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onValue, ref, db } from "../services/firebase";
import { PaperPlaneRight } from "phosphor-react";
import clsx from "clsx";
import { Message } from "@/components/Message";

interface DataForm {
  message: string;
}

export default function Home() {
  const { register, handleSubmit, formState } = useForm<DataForm>();
  const [nameAnonimy, setNameAnonimy] = useState("");

  async function handleSendText(data: { message: string }) {
    const newKeyQuestions = await push(
      child(ref(db), `anonymos-test/${nameAnonimy}`),
      data
    );
  }

  useEffect(() => {
    onValue(ref(db, "anonymos-test"), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  }, []);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {/* <div className="h-[80px]">menu</div> */}
      <div className="w-full flex-1 p-10">
        <div></div>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          <span className="text-center">Hoje 11:30</span>

          <div className="flex-1 flex flex-col gap-4">
            <Message
              textMessage="Olá"
              name="Matheus"
              date="11:30"
              isMessageOther
            />
            <Message textMessage="oi" name="Andre" date="11:31" />
          </div>

          <div>
            <label
              htmlFor=""
              className="w-full py-3 px-6 bg-[#282843] rounded-full flex items-center"
            >
              <input
                type="text"
                placeholder="Digite sua mensagem"
                className="bg-transparent flex-1 outline-none text-xs"
              />
              <button>
                <PaperPlaneRight size={24} />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
