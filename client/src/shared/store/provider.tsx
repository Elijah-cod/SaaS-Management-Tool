"use client";

import { useEffect, useRef, useState } from "react";
import type { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import {
  selectIsDarkMode,
  setIsDarkMode,
} from "@/features/app-shell/store/appShellSlice";
import {
  setAccessToken,
  setAuthStatus,
} from "@/features/auth/store/sessionSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { makeStore } from "@/shared/store";

const THEME_STORAGE_KEY = "saas-manager-theme";

function SessionTokenBridge() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthStatus(status));

    if (typeof window === "undefined") {
      return;
    }

    if (session?.accessToken) {
      dispatch(setAccessToken(session.accessToken));
      return;
    }

    dispatch(setAccessToken(null));
  }, [dispatch, session?.accessToken, status]);

  return null;
}

function ThemePreferenceBridge() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const hasLoadedTheme = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedTheme.current) {
      return;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "dark" || storedTheme === "light") {
      dispatch(setIsDarkMode(storedTheme === "dark"));
    }

    hasLoadedTheme.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return null;
}

export default function StoreProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const [store] = useState(() => {
    const nextStore = makeStore();

    if (session?.accessToken) {
      nextStore.dispatch(setAccessToken(session.accessToken));
      nextStore.dispatch(setAuthStatus("authenticated"));

    }

    return nextStore;
  });

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <SessionTokenBridge />
        <ThemePreferenceBridge />
        {children}
      </Provider>
    </SessionProvider>
  );
}
