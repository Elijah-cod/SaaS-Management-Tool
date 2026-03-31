export default function SearchPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Search
      </p>
      <h2 className="text-3xl font-semibold">Search projects, tasks, and teams</h2>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <input
          type="search"
          placeholder="Search across the workspace"
          className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none focus:border-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-300"
        />
      </div>
    </section>
  );
}
