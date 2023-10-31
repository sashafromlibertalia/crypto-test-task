import { ButtonHTMLAttributes, FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  caption?: string;
};

export const Button: FC<Props> = (props) => {
  return (
    <span className={"flex flex-col flex-wrap gap-2"}>
      <button
        {...props}
        className={twMerge(
          "h-fit rounded-md bg-brand px-8 py-3 text-center font-bold capitalize text-white transition hover:bg-brand-hover active:scale-95",
          props.className,
        )}
      />
      {props.caption && <span className={"text-red-500"}>{props.caption}</span>}
    </span>
  );
};
