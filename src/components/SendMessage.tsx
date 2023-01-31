import { AuthContext } from "@/contexts/AuthContext";
import { PaperPlaneRight, WarningCircle } from "phosphor-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  db,
  ref,
  serverTimestamp,
  child,
  push,
} from "../services/firebase/index";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { useMessages } from "@/hooks/useMessages";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

import { toast } from "react-hot-toast";

interface DataForm {
  message: string;
}

const messageForm = z.object({
  message: z
    .string()
    .min(1, "Digite uma mensagem antes de enviar")
    .trim()
    .max(200, "Você ultrapasou o limite de caracteres digitados"),
});

export function SendMessage() {
  const { messages } = useMessages();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: zodResolver(messageForm),
  });

  async function handleSendText(data: DataForm) {
    const { message } = data;

    const currentDate = dayjs();

    const messagesByUserId = messages.filter(
      (message) => message.name === user?.name
    );

    const findEndMessage = messagesByUserId.sort((a, b) => {
      const diffA = Math.abs(currentDate.diff(a.created_at));
      const diffB = Math.abs(currentDate.diff(b.created_at));
      return diffA - diffB;
    })[0];

    const dateMessageIsDifferenceOf30Seconds = dayjs().diff(
      findEndMessage.created_at,
      "seconds"
    );

    if (dateMessageIsDifferenceOf30Seconds <= 30) {
      toast.error("Só é possivel enviar mensagens a cada 30 segundos.");
      return;
    }

    await push(child(ref(db), `profiles/${user?.id}/messages`), {
      text: message,
      created_at: serverTimestamp(),
    });

    reset();
  }
  return (
    <form onSubmit={handleSubmit(handleSendText)}>
      <label
        htmlFor=""
        className={clsx(
          "w-full border border-transparent py-3 px-6 bg-[#282843] rounded-full flex items-center",
          {
            ["border-red-500"]: errors.message,
          }
        )}
      >
        {errors.message && (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <WarningCircle className=" text-red-500" size={22} />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="py-1 ml-10 px-4 bg-zinc-600 text-gray-100 rounded-lg">
                  {errors.message?.message}
                  <Tooltip.Arrow className="fill-zinc-600" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}

        <input
          type="text"
          disabled={!user}
          placeholder="Digite sua mensagem"
          className={clsx("bg-transparent flex-1 outline-none text-xs ", {
            ["ml-2"]: errors.message,
          })}
          {...register("message")}
        />
        <button type="submit">
          <PaperPlaneRight size={24} />
        </button>
      </label>
    </form>
  );
}
