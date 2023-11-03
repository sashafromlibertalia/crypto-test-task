import {
  CurrencyInput,
  getAvailableCurrencies,
  getEstimateExchangeAmount,
  getMinimalExchangeAmount,
} from "~/entites/currency";
import { FC, useEffect, useRef, useState } from "react";
import { ApiCurrencyResponse, Button, Input } from "~/shared";

type Props = {
  className?: string;
};

type CoinState = {
  coin: ApiCurrencyResponse | null;
  options: ApiCurrencyResponse[];
  value?: number | string;
  minimalValue?: number;
};

export const ExchangeWidget: FC<Props> = ({ className }) => {
  const allCoins = useRef<ApiCurrencyResponse[]>([]);
  const [startCoinMeta, setStartCoinMeta] = useState<CoinState>({
    coin: null,
    options: [],
  });

  const [targetCoinMeta, setTargetCoinMeta] = useState<CoinState>({
    coin: null,
    options: [],
  });

  const [errorCaption, setErrorCaption] = useState("");

  useEffect(() => {
    (async () => {
      /**
       *  В идеале, запрос должен кэшироваться на стороне RTK Query / React Query
       */
      const data = await getAvailableCurrencies();
      allCoins.current = data;

      setStartCoinMeta((prev) => ({
        ...prev,
        options: data,
      }));
      setTargetCoinMeta((prev) => ({
        ...prev,
        options: data,
      }));
    })();
  }, []);

  // Актуализация значений при выборе новых валют
  useEffect(() => {
    (async () => {
      if (!startCoinMeta.coin || !targetCoinMeta.coin) return;

      const minimalAmount = await getMinimalExchangeAmount(
        startCoinMeta.coin.ticker,
        targetCoinMeta.coin.ticker,
      );

      if (!minimalAmount) {
        disablePairs();
        return;
      }

      setStartCoinMeta((prev) => ({
        ...prev,
        minimalValue: minimalAmount ?? undefined,
      }));
    })();
  }, [startCoinMeta.coin, targetCoinMeta.coin]);

  // Поиск estimated при выборе правой валюты
  useEffect(() => {
    if (startCoinMeta.minimalValue && startCoinMeta?.minimalValue > 0)
      handleInputChange(startCoinMeta.minimalValue);
  }, [startCoinMeta.minimalValue, targetCoinMeta.coin]);

  const disablePairs = (
    caption: string = "This pair is disabled now",
    fallbackValue: CoinState["value"] = "—",
  ) => {
    setErrorCaption(caption);
    setTargetCoinMeta((prev) => ({
      ...prev,
      value: fallbackValue,
    }));
  };

  const handleInputChange = async (value: number) => {
    if (!startCoinMeta.coin || !targetCoinMeta.coin) {
      return;
    }

    if (startCoinMeta.minimalValue && value < startCoinMeta.minimalValue) {
      disablePairs("Error");
      return;
    }

    const estimatedAmount = await getEstimateExchangeAmount(
      value,
      startCoinMeta.coin.ticker,
      targetCoinMeta.coin.ticker,
    );

    if (!estimatedAmount) {
      disablePairs();
      return;
    }

    setTargetCoinMeta((prev) => ({
      ...prev,
      value: estimatedAmount?.estimatedAmount ?? undefined,
    }));

    setStartCoinMeta((prev) => ({
      ...prev,
      value,
    }));
  };

  const handleCoinSelection = async (
    coin: ApiCurrencyResponse,
    target: "start" | "target",
  ) => {
    switch (target) {
      case "start": {
        setStartCoinMeta((prev) => ({
          ...prev,
          coin,
        }));
        setTargetCoinMeta((prev) => ({
          ...prev,
          options: allCoins.current.filter((c) => c.ticker !== coin.ticker),
        }));
        break;
      }
      case "target": {
        setTargetCoinMeta((prev) => ({
          ...prev,
          coin,
        }));
        setStartCoinMeta((prev) => ({
          ...prev,
          options: allCoins.current.filter((c) => c.ticker !== coin.ticker),
        }));
        break;
      }
    }
  };

  const handleSwap = () => {
    setTargetCoinMeta(startCoinMeta);
    setStartCoinMeta(targetCoinMeta);
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
          data={startCoinMeta.options}
          defaultCoin={startCoinMeta.coin}
          value={startCoinMeta.value ?? startCoinMeta.minimalValue}
          onCoinChange={(coin) => handleCoinSelection(coin, "start")}
          onInputChange={(value) => handleInputChange(value)}
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
          readOnly
          className={"w-full flex-1"}
          data={targetCoinMeta.options}
          defaultCoin={targetCoinMeta.coin}
          defaultValue={targetCoinMeta.minimalValue}
          placeholder={"Здесь будет результат"}
          value={targetCoinMeta.value}
          onCoinChange={(coin) => handleCoinSelection(coin, "target")}
        />
      </div>
      <div className={"flex flex-wrap items-end gap-4 md:gap-8"}>
        <Input label={"Your Ethereum address"} />
        <Button className={"w-full md:w-auto"} type={"submit"}>
          Exchange
        </Button>
        {errorCaption && <span className={"text-red-500"}>{errorCaption}</span>}
      </div>
    </form>
  );
};
