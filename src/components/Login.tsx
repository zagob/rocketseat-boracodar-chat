import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function Login() {
  const { signInWithGoogle } = useContext(AuthContext);

  return (
    <div className="absolute flex flex-col gap-2 text-xl">
      <h2 className="">Entre com o google para conversar no chat</h2>
      <button
        onClick={() => signInWithGoogle()}
        className="w-full leading-none p-4 text-center bg-orange-900 rounded"
      >
        Entrar com google
      </button>
    </div>
  );
}
