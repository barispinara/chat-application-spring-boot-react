import { User } from "../types/authTypes";

export const getStoredToken = (): string | null => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    try {
      const parsedToken = JSON.parse(storedToken);
      return parsedToken.token || null;
    } catch (e) {
      localStorage.removeItem("token");
      return null;
    }
  }
  return null;
};

export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};
