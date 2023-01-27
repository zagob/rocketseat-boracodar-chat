import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "green" | "red" | "purple" | "default";
}

export function Button({ children, color = "default", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        `px-6 py-2 rounded-md hover:brightness-125 transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:brightness-100 ${rest.className}`,
        {
          ["bg-[#07847E]"]: color === "green",
          ["bg-[#633BBC]"]: color === "purple",
          ["bg-red-600"]: color === "red",
          ["bg-zinc-500"]: color === "default",
        }
      )}
    >
      {children}
    </button>
  );
}
