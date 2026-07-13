"use client";

import { AlertCircle, Users } from "lucide-react";
import { useGetTeamsQuery, useGetUsersQuery } from "@/features/workspace/api/workspaceApi";
import { Avatar, DataState, LoadingRows, PageHeader } from "@/shared/ui/primitives";

export default function UsersPage() {
  const usersQuery = useGetUsersQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const users = usersQuery.data ?? [];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Members"
        description="People with access to this delivery workspace and their current roles."
      />
      {usersQuery.isLoading ? <LoadingRows count={5} /> : null}
      {usersQuery.isError ? (
        <DataState
          icon={AlertCircle}
          tone="danger"
          title="Members are unavailable"
          description="The member directory could not be loaded from the workspace API."
          action={<button type="button" onClick={() => usersQuery.refetch()} className="ui-button-secondary">Retry</button>}
        />
      ) : null}
      {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 ? (
        <DataState icon={Users} title="No members yet" description="Workspace members will appear here once accounts are added." />
      ) : null}
      {users.length > 0 ? (
        <div className="ui-panel overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(10rem,0.8fr)_minmax(9rem,0.6fr)] gap-4 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-xs font-semibold text-[var(--muted)] sm:grid">
            <span>Member</span><span>Role</span><span>Team</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {users.map((user) => (
              <article key={user.id} className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(10rem,0.8fr)_minmax(9rem,0.6fr)] sm:items-center sm:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name ?? "Unnamed member"}</p>
                    <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted-strong)]">{user.role ?? "Member"}</p>
                <p className="text-xs text-[var(--muted)]">{teams.find((team) => team.id === user.teamId)?.name ?? "No team"}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
