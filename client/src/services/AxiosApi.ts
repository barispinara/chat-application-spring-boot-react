import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";

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
    const auth = JSON.parse(authValue);

    if (auth.token) {
      config.headers = { ...config.headers } as AxiosHeaders;
      config.headers.set("Authorization", auth.token);
    }
  }
  return config;
});

AxiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");

      const navigate = useNavigate();
      navigate("/login");

      alert("Your session has expired. Please log in again.");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default AxiosApi;
