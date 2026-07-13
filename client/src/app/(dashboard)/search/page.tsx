"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { AlertCircle, CheckSquare2, FolderKanban, Search, SearchX, User, UsersRound } from "lucide-react";
import { useSearchWorkspaceQuery } from "@/features/workspace/api/workspaceApi";
import { DataState, PageHeader, StatusChip } from "@/shared/ui/primitives";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const searchQuery = useSearchWorkspaceQuery(deferredQuery, { skip: deferredQuery.length < 2 });
  const results = searchQuery.data;
  const totalResults = results
    ? results.projects.length + results.tasks.length + results.users.length + results.teams.length
    : 0;

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Search"
        description="Find projects, tasks, members, and teams from one place."
      />

      <div className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={17} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the workspace"
          className="ui-field pl-10"
          autoFocus
          aria-label="Search the workspace"
        />
      </div>

      {deferredQuery.length < 2 ? (
        <DataState icon={Search} title="Search across your workspace" description="Enter at least two characters to find projects, tasks, members, and teams." />
      ) : null}
      {searchQuery.isFetching ? (
        <p className="text-sm text-[var(--muted)]" role="status">Searching for “{deferredQuery}”...</p>
      ) : null}
      {searchQuery.isError ? (
        <DataState
          icon={AlertCircle}
          tone="danger"
          title="Search is unavailable"
          description="The workspace search endpoint did not respond. Check the API connection and retry."
          action={<button type="button" onClick={() => searchQuery.refetch()} className="ui-button-secondary">Retry</button>}
        />
      ) : null}
      {!searchQuery.isFetching && !searchQuery.isError && deferredQuery.length >= 2 && totalResults === 0 ? (
        <DataState icon={SearchX} title="No matching work" description={`Nothing matched “${deferredQuery}”. Try a project name, task title, teammate, or team.`} />
      ) : null}
      {!searchQuery.isError && totalResults > 0 && results ? (
        <div className="space-y-5">
          <p className="text-xs text-[var(--muted)]">{totalResults} result{totalResults === 1 ? "" : "s"}</p>
          <ResultGroup title="Projects" icon={FolderKanban} count={results.projects.length}>
            {results.projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[var(--surface-muted)]">
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{project.name}</p><p className="truncate text-xs text-[var(--muted)]">{project.description ?? "No description"}</p></div>
                <StatusChip label={project.status} tone="neutral" />
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Tasks" icon={CheckSquare2} count={results.tasks.length}>
            {results.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{task.title}</p><p className="text-xs text-[var(--muted)]">{task.ticket ?? `TASK-${task.id}`} · {task.priority ?? "No priority"}</p></div>
                <StatusChip label={task.status} tone={task.status === "Completed" ? "success" : "neutral"} />
              </div>
            ))}
          </ResultGroup>
          <ResultGroup title="Members" icon={User} count={results.users.length}>
            {results.users.map((user) => (
              <div key={user.id} className="px-4 py-3"><p className="text-sm font-semibold">{user.name ?? user.email}</p><p className="text-xs text-[var(--muted)]">{user.role ?? "Member"} · {user.email}</p></div>
            ))}
          </ResultGroup>
          <ResultGroup title="Teams" icon={UsersRound} count={results.teams.length}>
            {results.teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between px-4 py-3"><div><p className="text-sm font-semibold">{team.name}</p><p className="text-xs text-[var(--muted)]">{team.description ?? "Delivery team"}</p></div><span className="text-xs text-[var(--muted)]">{team.memberCount ?? 0} members</span></div>
            ))}
          </ResultGroup>
        </div>
      ) : null}
    </section>
  );
}

function ResultGroup({ title, icon: Icon, count, children }: { title: string; icon: typeof Search; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <section>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]"><Icon size={14} aria-hidden="true" /><h3>{title}</h3><span>{count}</span></div>
      <div className="ui-panel divide-y divide-[var(--border)] overflow-hidden">{children}</div>
    </section>
  );
}
