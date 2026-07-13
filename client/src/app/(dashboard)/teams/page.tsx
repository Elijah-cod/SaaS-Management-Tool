"use client";

import { AlertCircle, UsersRound } from "lucide-react";
import { useGetTeamsQuery } from "@/features/workspace/api/workspaceApi";
import { DataState, LoadingRows, PageHeader } from "@/shared/ui/primitives";

export default function TeamsPage() {
  const teamsQuery = useGetTeamsQuery();
  const teams = teamsQuery.data ?? [];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Teams"
        description="Delivery groups and the number of people currently assigned to each."
      />
      {teamsQuery.isLoading ? <LoadingRows count={4} /> : null}
      {teamsQuery.isError ? (
        <DataState
          icon={AlertCircle}
          tone="danger"
          title="Teams are unavailable"
          description="The team directory could not be loaded from the workspace API."
          action={<button type="button" onClick={() => teamsQuery.refetch()} className="ui-button-secondary">Retry</button>}
        />
      ) : null}
      {!teamsQuery.isLoading && !teamsQuery.isError && teams.length === 0 ? (
        <DataState icon={UsersRound} title="No teams yet" description="Create a team in the backend to start grouping workspace members." />
      ) : null}
      {teams.length > 0 ? (
        <div className="ui-panel divide-y divide-[var(--border)] overflow-hidden">
          {teams.map((team) => (
            <article key={team.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">{team.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{team.description ?? "Cross-functional delivery team"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)]">
                <UsersRound size={15} aria-hidden="true" />
                {team.memberCount ?? 0} member{team.memberCount === 1 ? "" : "s"}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
