type ApiCurrencyResponse = {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
};

type ApiCurrencyExchangeResponse = {
  estimatedAmount: number;
  networkFee: number;
  transactionSpeedForecast: string;
  warningMessage: string | null;
  rateId: string;
};

export type { ApiCurrencyResponse, ApiCurrencyExchangeResponse };
