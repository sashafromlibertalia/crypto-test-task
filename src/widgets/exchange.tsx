import { CurrencyInput, getAvailableCurrencies } from "~/entites/currency";
import { FC, useEffect, useRef, useState } from "react";
import { ApiCurrencyResponse, Button, Input } from "~/shared";

type Props = {
  className?: string;
};

export const ExchangeWidget: FC<Props> = ({ className }) => {
  const allCoins = useRef<ApiCurrencyResponse[]>([]);
  const [leftData, setLeftData] = useState<ApiCurrencyResponse[]>([]);
  const [rightData, setRightData] = useState<ApiCurrencyResponse[]>([]);

  const [initialCoin, setInitialCoin] = useState<ApiCurrencyResponse | null>(
    null,
  );
  const [targetCoin, setTargetCoin] = useState<ApiCurrencyResponse | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      /**
       *  В идеале, запрос должен кэшироваться на стороне RTK Query / React Query,
       *  что позволит избавиться от излишних стейтов
       */
      const data = await getAvailableCurrencies();
      allCoins.current = data;
      setLeftData(data);
      setRightData(data);
    })();
  }, []);

  const handleChange = (
    coin: ApiCurrencyResponse,
    target: "initial" | "target",
  ) => {
    switch (target) {
      case "initial": {
        setRightData(allCoins.current.filter((c) => c.ticker !== coin.ticker));
        setInitialCoin(coin);
        break;
      }
      case "target": {
        setLeftData(allCoins.current.filter((c) => c.ticker !== coin.ticker));
        setTargetCoin(coin);
        break;
      }
    }
  };

  const handleSwap = () => {
    setRightData(leftData);
    setLeftData(rightData);
    setInitialCoin(targetCoin);
    setTargetCoin(initialCoin);
  };

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
      }}
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
        <CurrencyInput
          className={"w-full flex-1"}
          data={leftData}
          defaultCoin={initialCoin ?? null}
          onChange={(coin) => handleChange(coin, "initial")}
        />
        <button className={"rotate-90 md:rotate-0"} onClick={handleSwap}>
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
        <CurrencyInput
          className={"w-full flex-1"}
          data={rightData}
          defaultCoin={targetCoin ?? null}
          onChange={(coin) => handleChange(coin, "target")}
        />
      </div>
      <div className={"flex flex-wrap items-end gap-4 md:gap-8"}>
        <Input label={"Your Ethereum address"} />
        <Button className={"w-full md:w-auto"}>Exchange</Button>
      </div>
    </form>
  );
};
