import { getAvailableCurrencies } from "~/entites/currency";
import { useEffect } from "react";
import { Button, Input } from "~/shared";

export const ExchangeWidget = () => {
  useEffect(() => {
    (async () => {
      const data = await getAvailableCurrencies();
      console.log(data);
    })();
  }, []);

  return (
    <div
      className={
        "absolute left-1/2 top-1/2 m-auto flex w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col gap-8 px-8"
      }
    >
      <div>
        <h1 className={"mb-4 text-4xl font-light"}>Crypto Exchange</h1>
        <span>Exchange fast and easy</span>
      </div>
      <div
        className={
          "flex flex-col flex-wrap items-end gap-6 md:flex-row md:items-center"
        }
      >
        <button className={"rotate-90 md:rotate-0"}>
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_3_98)">
              <path
                d="M7.99 17H20V19H7.99V22L4 18L7.99 14V17Z"
                fill="#11B3FE"
              />
              <path d="M16.01 8H4V10H16.01V13L20 9L16.01 5V8Z" fill="#11B3FE" />
            </g>
            <defs>
              <clipPath id="clip0_3_98">
                <rect fill="white" height="24" width="24" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <div className={"flex flex-wrap items-end gap-4 md:gap-8"}>
        <Input label={"Your Ethereum address"} />
        <Button className={"w-full md:w-auto"}>Exchange</Button>
      </div>
    </div>
  );
};
