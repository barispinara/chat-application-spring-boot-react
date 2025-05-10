import axios, { InternalAxiosRequestConfig } from "axios";

const AxiosApi = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL || "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

AxiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authValue: string | null = localStorage.getItem("token");

  if (authValue) {
    try {
      const auth = JSON.parse(authValue);
      if (auth.token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${auth.token}`;
      }
    } catch (e) {
      console.error("Error parsing auth token:", e);
    }
  }
  return config;
});

AxiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && localStorage.getItem("token")) {
      console.log("Received 401 error with existing token - session expired");
      localStorage.removeItem("token");

      // Create the event on demand (not using predefined one)
      const authErrorEvent = new CustomEvent("authError");
      window.dispatchEvent(authErrorEvent);
    }
    return Promise.reject(error);
  },
);

export default AxiosApi;
