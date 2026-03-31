export default function TimelinePage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Timeline
      </p>
      <h2 className="text-3xl font-semibold">Delivery timeline</h2>
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Add your gantt or milestone view here when the task data model is connected.
        </p>
      </div>
    </section>
  );
}
