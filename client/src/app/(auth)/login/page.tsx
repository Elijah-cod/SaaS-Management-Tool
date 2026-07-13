import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import ApiAvailability from "@/features/auth/components/ApiAvailability";
import { ArrowRight, Boxes, Check, Command } from "lucide-react";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const hasCredentialsError = params.error === "credentials";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid lg:grid-cols-[minmax(28rem,0.9fr)_minmax(32rem,1.1fr)]">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-[var(--border)] bg-[var(--surface-muted)] p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--surface)]">
            <Boxes size={18} aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-[-0.015em]">SaaS Manager</span>
        </div>

        <div className="relative max-w-xl">
          <p className="mb-4 text-xs font-semibold text-[var(--accent)]">DELIVERY CONSOLE</p>
          <h1 className="text-4xl font-[650] leading-[1.12] tracking-[-0.04em] xl:text-5xl">
            Keep the team aligned without slowing the work down.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">
            Plan projects, move work through delivery, and keep ownership visible in one focused workspace.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-[var(--muted-strong)]">
            {[
              "Live project and task visibility",
              "Fast, contextual updates",
              "Clear ownership and delivery state",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-[var(--muted)]">
          Built for startup teams moving from idea to shipped.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[26rem]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--surface)]">
              <Boxes size={18} aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-[-0.015em]">SaaS Manager</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--accent)]">WELCOME BACK</p>
            <h2 className="mt-2 text-3xl font-[650] tracking-[-0.035em]">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Continue where your team left off.
            </p>
          </div>

          <div className="mt-5">
            <ApiAvailability />
          </div>

          {hasCredentialsError ? (
            <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-sm leading-6 text-rose-700 dark:text-rose-300" role="alert">
              Sign-in could not be completed. Check the service status above. If it is online, confirm the account credentials and try again.
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
            className="mt-6 space-y-4"
        >
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
          <button
            type="submit"
            className="ui-button-primary w-full"
          >
            Sign in to workspace
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>

          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <div className="flex items-start gap-3 text-xs leading-5 text-[var(--muted)]">
              <Command className="mt-0.5 shrink-0" size={14} aria-hidden="true" />
              <p>
                Demo access uses the seeded account shown in the form. Additional accounts are documented in the{" "}
                <Link href="https://github.com/Elijah-cod/SaaS-Management-Tool" className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]">
                  project repository
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
