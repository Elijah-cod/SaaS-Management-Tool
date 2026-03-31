import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const hasCredentialsError = params.error === "credentials";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Sign in to continue
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Use your account credentials to access the dashboard.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100">
          <p className="font-semibold">Demo account</p>
          <p className="mt-1">Email: demo@saasmanager.app</p>
          <p>Password: ChangeMe123!</p>
        </div>

        {hasCredentialsError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            We couldn&apos;t sign you in with those credentials. Try the demo account or update the auth env values.
          </div>
        ) : null}

        <form
          action={async (formData) => {
            "use server";

            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/home",
              });
            } catch (error) {
              if (error instanceof AuthError) {
                redirect("/login?error=credentials");
              }

              throw error;
            }
          }}
          className="mt-8 space-y-4"
        >
          <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-300"
              placeholder="you@company.com"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-300"
              placeholder="Enter your password"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Need account help? <Link href="/settings" className="font-medium text-slate-900 dark:text-white">Visit settings</Link>
        </p>
      </div>
    </main>
  );
}
