import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
    isSidebarCollapsed: boolean;
    isMobileSidebarOpen: boolean;
    isDarkMode: boolean;
}

const initialState: GlobalState = {
    isSidebarCollapsed: false,
    isMobileSidebarOpen: false,
    isDarkMode: false,
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
    },
});

export const { setIsSidebarCollapsed, setIsMobileSidebarOpen, setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;
