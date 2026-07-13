import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold text-[var(--muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-[650] tracking-[-0.025em] text-[var(--foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[72ch] text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatusChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const styles = {
    neutral:
      "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted-strong)]",
    accent:
      "border-[color:var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent)]",
    success:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    danger:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Avatar({
  name,
  size = "md",
}: {
  name?: string | null;
  size?: "sm" | "md";
}) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <span
      aria-label={name ?? "Unassigned"}
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-[var(--surface-strong)] font-semibold text-[var(--muted-strong)] ${
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"
      }`}
    >
      {initials}
    </span>
  );
}

export function DataState({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "danger" | "warning";
}) {
  const iconTone = {
    neutral: "text-[var(--muted)]",
    danger: "text-[var(--danger)]",
    warning: "text-[var(--warning)]",
  }[tone];

  return (
    <div className="ui-panel flex min-h-44 flex-col items-center justify-center px-6 py-8 text-center">
      <Icon className={iconTone} size={22} aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ count = 4 }: { count?: number }) {
  return (
    <div className="ui-panel divide-y divide-[var(--border)] overflow-hidden" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-4 py-3.5">
          <div className="ui-skeleton h-8 w-8 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="ui-skeleton h-3 w-2/5 rounded" />
            <div className="ui-skeleton h-2.5 w-3/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
