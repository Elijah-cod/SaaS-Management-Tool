const teams = [
  { name: "Platform", focus: "Core architecture and backend services" },
  { name: "Growth", focus: "Activation, onboarding, and retention" },
  { name: "Operations", focus: "Support workflows and internal tooling" },
];

export default function TeamsPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Teams
      </p>
      <h2 className="text-3xl font-semibold">Team directory</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {teams.map((team) => (
          <article
            key={team.name}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{team.focus}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
