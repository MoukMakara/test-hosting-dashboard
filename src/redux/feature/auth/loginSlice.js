import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeAccessToken,
  removeAccessToken,
  getAccessToken,
} from "../../../lib/secureLocalStorage";

const baseUrl = import.meta.env.VITE_BASE_URL;
const loginEndPoint = import.meta.env.VITE_LOGIN_URL;
const apiUrl = `${baseUrl}${loginEndPoint}`;

console.log("API:", apiUrl);

const initialState = {
  status: "idle",
  error: null,
  accessToken: getAccessToken(),
};

export const fetchLogin = createAsyncThunk(
  "login/fetchLogin",
  async ({ email, password }) => {
    const body = JSON.stringify({
      email,
      password,
    });
    console.log("Body:", body);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const accessToken = await response.json();
    console.log("Token:", accessToken.access);
    return accessToken;
  }
);

export const loginSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      removeAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "success";
        const token = action.payload;
        console.log("Token from action payload:", token);
        storeAccessToken(action.payload.access);
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default loginSlice.reducer;

export const { logout } = loginSlice.actions;

export const selectAccessToken = (state) => state?.login?.accessToken;
