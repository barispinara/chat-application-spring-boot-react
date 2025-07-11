import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserService } from "../../services/UserService";
import {
  AuthResponse,
  AuthState,
  loginUserType,
  registerUserType,
} from "../../types/authTypes";
import { getStoredToken, getStoredUser } from "../../helper/storage";
import { timeStamp } from "node:console";

const token = getStoredToken();
const user = getStoredUser();

const initialState: AuthState = {
  user: user,
  token: token,
  isLoading: false,
  error: null,
  isAuthenticated: !!token,
  userList: [],
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: loginUserType, { rejectWithValue }) => {
    try {
      const response = await UserService.login(credentials);
      return response.data as AuthResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || error.message || "Login failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: registerUserType, { rejectWithValue }) => {
    try {
      await UserService.register(credentials);
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || error.message || "Registration failed",
      );
    }
  },
);

export const fetchAllUsers = createAsyncThunk(
  "auth/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.getAllUsers();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Getting All User failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserList: (state) => {
      state.userList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;

          // Store token and user separately in localStorage
          localStorage.setItem(
            "token",
            JSON.stringify({ token: action.payload.token }),
          );
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // state.userList = [];
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // state.userList = [];
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
