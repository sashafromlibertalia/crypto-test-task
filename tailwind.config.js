/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        brand: "#11B3FE",
        "brand-hover": "#0095E0",
        "grey-100": "#F6F7F8",
        "grey-200": "#E3EBEF",
      },
    },
  },
  plugins: [],
};
