const users = [
  { name: "Amina Hassan", role: "Product Manager" },
  { name: "Daniel Kimani", role: "Frontend Engineer" },
  { name: "Lina Patel", role: "Designer" },
];

export default function UsersPage() {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Users
      </p>
      <h2 className="text-3xl font-semibold">Workspace members</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {users.map((user) => (
          <article
            key={user.name}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
