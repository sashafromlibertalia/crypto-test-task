import { getAvailableCurrencies } from "~/entites/currency";
import { useEffect } from "react";

export const ExchangeWidget = () => {
  useEffect(() => {
    (async () => {
      const data = await getAvailableCurrencies();
      console.log(data);
    })();
  }, []);

  return (
    <div>
      <button>
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3_98)">
            <path d="M7.99 17H20V19H7.99V22L4 18L7.99 14V17Z" fill="#11B3FE" />
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
  );
};
