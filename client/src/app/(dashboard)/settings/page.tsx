"use client";

import { useSession } from "next-auth/react";
import { Check, Database, Moon, ShieldCheck, Sun } from "lucide-react";
import { selectIsDarkMode, setIsDarkMode } from "@/features/app-shell/store/appShellSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { apiBaseUrl } from "@/shared/config/env";
import { PageHeader } from "@/shared/ui/primitives";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const { data: session } = useSession();

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Personal display preferences and workspace connection details."
      />

      <div className="ui-panel overflow-hidden">
        <SettingSection title="Appearance" description="Stored locally on this device.">
          <div className="grid grid-cols-2 gap-2 sm:w-80">
            <ThemeOption label="Light" icon={Sun} selected={!isDarkMode} onClick={() => dispatch(setIsDarkMode(false))} />
            <ThemeOption label="Dark" icon={Moon} selected={isDarkMode} onClick={() => dispatch(setIsDarkMode(true))} />
          </div>
        </SettingSection>
        <SettingSection title="Account" description="Identity supplied by the current authenticated session.">
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck size={18} className="text-[var(--success)]" aria-hidden="true" />
            <div>
              <p className="font-semibold">{session?.user.name ?? "Workspace member"}</p>
              <p className="text-xs text-[var(--muted)]">{session?.user.email} · {session?.user.role ?? "Member"}</p>
            </div>
          </div>
        </SettingSection>
        <SettingSection title="API connection" description="Public endpoint used by this frontend deployment.">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <Database size={18} className="shrink-0 text-[var(--muted)]" aria-hidden="true" />
            <code className="min-w-0 break-all rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs text-[var(--muted-strong)]">{apiBaseUrl}</code>
          </div>
        </SettingSection>
      </div>
    </section>
  );
}

function SettingSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-[var(--border)] px-4 py-5 last:border-b-0 md:grid-cols-[minmax(12rem,0.65fr)_minmax(0,1.35fr)]">
      <div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p></div>
      <div>{children}</div>
    </div>
  );
}

function ThemeOption({ label, icon: Icon, selected, onClick }: { label: string; icon: typeof Sun; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left ${selected ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:bg-[var(--surface-muted)]"}`}>
      <div className="flex w-full items-center justify-between"><Icon size={16} />{selected ? <Check size={15} /> : null}</div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
