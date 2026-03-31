import Link from "next/link";
import { signIn } from "@/auth";

export default function LoginPage() {
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

        <form
          action={async (formData) => {
            "use server";

            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/home",
            });
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
