import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
    isSidebarCollapsed: boolean;
    isMobileSidebarOpen: boolean;
    isDarkMode: boolean;
    accessToken: string | null;
    authStatus: "loading" | "authenticated" | "unauthenticated";
}

const initialState: GlobalState = {
    isSidebarCollapsed: false,
    isMobileSidebarOpen: false,
    isDarkMode: false,
    accessToken: null,
    authStatus: "loading",
};

export const globalSlice = createSlice({
    name: "global",
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
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
        setAuthStatus: (
            state,
            action: PayloadAction<GlobalState["authStatus"]>
        ) => {
            state.authStatus = action.payload;
        },
    },
});

export const {
    setIsSidebarCollapsed,
    setIsMobileSidebarOpen,
    setIsDarkMode,
    setAccessToken,
    setAuthStatus,
} = globalSlice.actions;
export default globalSlice.reducer;
