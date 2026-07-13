"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, LoaderCircle } from "lucide-react";

export default function LoginForm({ initialError = false }: { initialError?: boolean }) {
  const [error, setError] = useState(
    initialError
      ? "Sign-in could not be completed. Check the service status above and try again."
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/home",
      });

      if (result?.error) {
        setError("Sign-in failed. Confirm the credentials and workspace service, then try again.");
        return;
      }

      window.location.assign(result?.url ?? "/home");
    } catch {
      setError("The sign-in request could not reach the workspace service. Try again when it is online.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-sm leading-6 text-rose-700 dark:text-rose-300" role="alert">
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-1.5 text-sm font-semibold">
          <span>Email address</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue="amina@saasmanager.app"
            className="ui-field"
            placeholder="you@startup.com"
          />
        </label>
        <label className="block space-y-1.5 text-sm font-semibold">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue="ChangeMe123!"
            className="ui-field"
            placeholder="Enter your password"
          />
        </label>
        <button type="submit" disabled={isSubmitting} className="ui-button-primary w-full">
          {isSubmitting ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : null}
          {isSubmitting ? "Signing in..." : "Sign in to workspace"}
          {!isSubmitting ? <ArrowRight size={16} aria-hidden="true" /> : null}
        </button>
      </form>
    </>
  );
}
