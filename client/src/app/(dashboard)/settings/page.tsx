export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Settings
      </p>
      <h2 className="text-3xl font-semibold">Workspace settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Authentication</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Configure providers, access rules, and redirect behavior.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Set workspace defaults, notification behavior, and visual preferences.
          </p>
        </article>
      </div>
    </section>
  );
}
