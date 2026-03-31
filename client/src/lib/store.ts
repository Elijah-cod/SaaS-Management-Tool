// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/app/state/api";
import globalReducer from "@/app/state";

export const makeStore = () => {
    const store = configureStore({
        reducer: {
            global: globalReducer,
            [api.reducerPath]: api.reducer,
        },
        middleware: (getDefault) => getDefault().concat(api.middleware),
    });
    setupListeners(store.dispatch);
    return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];