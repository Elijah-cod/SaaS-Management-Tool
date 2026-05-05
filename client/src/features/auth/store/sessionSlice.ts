import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/store";

type SessionState = {
  accessToken: string | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
};

const initialState: SessionState = {
  accessToken: null,
  authStatus: "loading",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setAuthStatus: (
      state,
      action: PayloadAction<SessionState["authStatus"]>
    ) => {
      state.authStatus = action.payload;
    },
  },
});

export const { setAccessToken, setAuthStatus } = sessionSlice.actions;

export const selectAccessToken = (state: RootState) => state.session.accessToken;
export const selectAuthStatus = (state: RootState) => state.session.authStatus;

export default sessionSlice.reducer;
