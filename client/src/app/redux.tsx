"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { setAccessToken, setAuthStatus } from "@/app/state";
import { useAppDispatch } from "@/lib/hooks";
import { makeStore } from "@/lib/store";

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
      window.localStorage.setItem("accessToken", session.accessToken);
      return;
    }

    dispatch(setAccessToken(null));
    window.localStorage.removeItem("accessToken");
  }, [dispatch, session?.accessToken, status]);

  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(makeStore);

  return (
    <SessionProvider>
      <Provider store={store}>
        <SessionTokenBridge />
        {children}
      </Provider>
    </SessionProvider>
  );
}
