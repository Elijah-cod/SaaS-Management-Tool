"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";

function SessionTokenBridge() {
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (session?.accessToken) {
      window.localStorage.setItem("accessToken", session.accessToken);
      return;
    }

    window.localStorage.removeItem("accessToken");
  }, [session?.accessToken]);

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
      <SessionTokenBridge />
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
