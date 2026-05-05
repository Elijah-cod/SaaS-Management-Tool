import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/store";

type AppShellState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isDarkMode: boolean;
};

const initialState: AppShellState = {
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isDarkMode: false,
};

const appShellSlice = createSlice({
  name: "appShell",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileSidebarOpen = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {
  setIsDarkMode,
  setIsMobileSidebarOpen,
  setIsSidebarCollapsed,
} = appShellSlice.actions;

export const selectIsDarkMode = (state: RootState) => state.appShell.isDarkMode;
export const selectIsMobileSidebarOpen = (state: RootState) =>
  state.appShell.isMobileSidebarOpen;
export const selectIsSidebarCollapsed = (state: RootState) =>
  state.appShell.isSidebarCollapsed;

export default appShellSlice.reducer;
