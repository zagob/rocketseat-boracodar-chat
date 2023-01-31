import { AuthContext } from "@/contexts/AuthContext";
import clsx from "clsx";
import Image from "next/image";
import { Power } from "phosphor-react";
import { useContext } from "react";

export function Profile() {
  const { user, signOutUser } = useContext(AuthContext);

  return (
    <div
      className={clsx("flex items-center justify-between", {
        ["visible"]: user,
        ["invisible"]: !user,
      })}
    >
      <div className="flex items-center gap-4">
        {user ? (
          <Image
            width={48}
            height={48}
            src={user?.avatar}
            alt={user?.name}
            className="rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-zinc-500" />
        )}
        <div className="flex flex-col justify-start">
          <span className="text-base font-bold">{user?.name}</span>
          <span className="text-xs flex items-center gap-2">
            <div
              className={clsx("w-2 h-2 rounded-full", {
                ["bg-green-500"]: user?.status === "ON",
                ["bg-red-500"]: user?.status === "OFF",
              })}
            />
            {user?.status ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <Power
        size={32}
        onClick={signOutUser}
        className="text-zinc-400 hover:brightness-125 cursor-pointer"
      />
    </div>
  );
}
