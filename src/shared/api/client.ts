import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  params: {
    api_key: encodeURIComponent(import.meta.env.VITE_API_KEY ?? ""),
  },
});

export { api };
