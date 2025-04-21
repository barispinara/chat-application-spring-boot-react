export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface loginUserType {
  username: string;
  password: string;
}

export interface registerUserType {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
