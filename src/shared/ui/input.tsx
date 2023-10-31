import { FC, InputHTMLAttributes, useId } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<Props> = (props) => {
  const { label, className, ...rest } = props;

  const hintId = useId();

  return (
    <div className={"gap flex flex-1 flex-col gap-2"}>
      {label && <label htmlFor={hintId}>{label}</label>}
      <input
        {...rest}
        aria-describedby={hintId}
        id={hintId}
        className={twMerge(
          "rounded-sm border border-grey-200 bg-grey-100 px-4 py-3 outline-none",
          className,
        )}
      />
    </div>
  );
};
