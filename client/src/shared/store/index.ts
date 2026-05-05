import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import appShellReducer from "@/features/app-shell/store/appShellSlice";
import sessionReducer from "@/features/auth/store/sessionSlice";
import { baseApi } from "@/shared/api/baseApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      appShell: appShellReducer,
      session: sessionReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
