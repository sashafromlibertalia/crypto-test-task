import {
  api,
  ApiCurrencyExchangeResponse,
  ApiCurrencyResponse,
} from "~/shared";

const getAvailableCurrencies = async (): Promise<ApiCurrencyResponse[]> => {
  try {
    const { data } = await api.get("currencies", {
      params: {
        active: "true",
      },
    });
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getMinimalExchangeAmount = async (
  initialCurrency: ApiCurrencyResponse["ticker"],
  targetCurrency: ApiCurrencyResponse["ticker"],
): Promise<number | null> => {
  try {
    const { data } = await api.get(
      `min-amount/${initialCurrency}_${targetCurrency}`,
    );

    return data?.["minAmount"] ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getEstimateExchangeAmount = async (
  amount: number,
  initialCurrency: ApiCurrencyResponse["ticker"],
  targetCurrency: ApiCurrencyResponse["ticker"],
): Promise<ApiCurrencyExchangeResponse | null> => {
  try {
    const { data } = await api.get(
      `exchange-amount/${amount}/${initialCurrency}_${targetCurrency}`,
    );

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export {
  getAvailableCurrencies,
  getMinimalExchangeAmount,
  getEstimateExchangeAmount,
};
