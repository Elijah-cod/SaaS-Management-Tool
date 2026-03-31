const stats = [
  { label: "Active projects", value: "12" },
  { label: "Tasks due this week", value: "38" },
  { label: "Team utilization", value: "84%" },
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Home
        </p>
        <h2 className="text-3xl font-semibold">Portfolio snapshot</h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Start here with the current project pipeline, delivery pressure, and team momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
