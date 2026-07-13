"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, ServerOff } from "lucide-react";
import { apiBaseUrl } from "@/shared/config/env";

type ApiState = "checking" | "online" | "offline";

export default function ApiAvailability() {
  const [state, setState] = useState<ApiState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        setState(response.ok ? "online" : "offline");
      })
      .catch(() => setState("offline"))
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (state === "checking") {
    return (
      <div className="flex items-center gap-2 text-xs text-[var(--muted)]" role="status">
        <LoaderCircle className="animate-spin" size={14} aria-hidden="true" />
        Checking workspace service
      </div>
    );
  }

  if (state === "offline") {
    return (
      <div
        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs leading-5 text-rose-700 dark:text-rose-300"
        role="alert"
      >
        <div className="flex items-center gap-2 font-semibold">
          <ServerOff size={14} aria-hidden="true" />
          Workspace service unavailable
        </div>
        <p className="mt-1">
          Sign-in is paused until the production API is connected and healthy.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300" role="status">
      <CheckCircle2 size={14} aria-hidden="true" />
      Workspace service online
    </div>
  );
}
