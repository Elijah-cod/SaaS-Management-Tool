import Link from "next/link";
import ApiAvailability from "@/features/auth/components/ApiAvailability";
import LoginForm from "@/features/auth/components/LoginForm";
import { Boxes, Check, Command } from "lucide-react";

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

          <LoginForm initialError={hasCredentialsError} />

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
