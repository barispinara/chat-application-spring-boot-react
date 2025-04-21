import { AxiosResponse } from "axios";
import { loginUserType, registerUserType } from "../types/authTypes";
import AxiosApi from "./AxiosApi";

const PATHS = {
  REGISTER: "user/register",
  LOGIN: "user/login",
};

export class UserService {
  public static login(loginUserRequest: loginUserType): Promise<AxiosResponse> {
    try {
      return AxiosApi.post(PATHS.LOGIN, loginUserRequest);
    } catch (error) {
      throw new Error("Login failed. Please try again.");
    }
  }
  public static register(
    registerUserRequest: registerUserType,
  ): Promise<AxiosResponse> {
    try {
      return AxiosApi.post(PATHS.REGISTER, registerUserRequest);
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  }
}
