import { ButtonHTMLAttributes, FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<Props> = (props) => {
  return (
    <button
      {...props}
      className={twMerge(
        "h-fit rounded-md bg-brand px-8 py-3 text-center font-bold capitalize text-white transition hover:bg-sky-600 active:scale-95",
        props.className,
      )}
    />
  );
};
