import { ApiCurrencyResponse } from "~/shared";
import { FC, useState } from "react";

type Props = {
  data: ApiCurrencyResponse[];
  activeCurrency?: ApiCurrencyResponse["ticker"];
  onChange: (key: ApiCurrencyResponse["ticker"]) => void;
};

export const CurrencyInput: FC<Props> = ({
  data,
  activeCurrency,
  onChange,
}) => {
  const [targetCurrencyKey, setTargeCurrencyKey] = useState(
    activeCurrency ?? null,
  );

  return <div></div>;
};
