import clsx from "clsx";

interface MessageProps {
  name: string;
  date: string;
  textMessage: string;
  isMessageOther?: boolean;
}

export function Message({
  isMessageOther = false,
  date,
  textMessage,
  name,
}: MessageProps) {
  return (
    <div
      className={clsx("flex flex-col gap-[10px]", {
        ["items-start"]: isMessageOther,
        ["items-end"]: !isMessageOther,
      })}
    >
      <span className="text-xs text-[#E1E1E6]">
        {name} - {date}
      </span>
      <text
        className={clsx("p-[14px] text-[#E1E1E6] w-fit", {
          ["rounded-r-lg rounded-bl-lg bg-[#633BBC] "]: isMessageOther,
          ["rounded-l-lg rounded-tr-lg bg-[#07847E] "]: !isMessageOther,
        })}
      >
        {textMessage}
      </text>
    </div>
  );
}
