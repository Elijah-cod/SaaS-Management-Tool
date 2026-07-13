"use client";

import { AlertCircle, CalendarClock } from "lucide-react";
import { useGetProjectsQuery } from "@/features/projects/api/projectsApi";
import { useGetTasksQuery } from "@/features/tasks/api/tasksApi";
import { DataState, LoadingRows, PageHeader, StatusChip } from "@/shared/ui/primitives";

export default function TimelinePage() {
  const tasksQuery = useGetTasksQuery();
  const { data: projects = [] } = useGetProjectsQuery();

  const tasks = [...(tasksQuery.data ?? [])].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Planning"
        title="Timeline"
        description="Upcoming delivery dates across every active project."
      />

      {tasksQuery.isLoading ? <LoadingRows count={6} /> : null}
      {tasksQuery.isError ? (
        <DataState
          icon={AlertCircle}
          tone="danger"
          title="Timeline is unavailable"
          description="Task dates could not be loaded from the workspace API."
          action={<button type="button" onClick={() => tasksQuery.refetch()} className="ui-button-secondary">Retry</button>}
        />
      ) : null}
      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0 ? (
        <DataState
          icon={CalendarClock}
          title="No delivery dates yet"
          description="Add due dates to tasks and they will appear here in chronological order."
        />
      ) : null}
      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length > 0 ? (
        <div className="ui-panel overflow-hidden">
          <div className="hidden grid-cols-[7rem_minmax(0,1fr)_12rem_8rem] gap-4 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-xs font-semibold text-[var(--muted)] md:grid">
            <span>Due</span>
            <span>Task</span>
            <span>Project</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {tasks.map((task) => {
              const project = projects.find((item) => item.id === task.projectId);
              return (
                <article key={task.id} className="grid gap-2 px-4 py-3.5 md:grid-cols-[7rem_minmax(0,1fr)_12rem_8rem] md:items-center md:gap-4">
                  <time className="text-xs font-medium text-[var(--muted-strong)]">{formatDate(task.dueDate)}</time>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{task.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{task.ticket ?? `TASK-${task.id}`} · {task.priority ?? "No priority"}</p>
                  </div>
                  <p className="truncate text-xs text-[var(--muted)]">{project?.name ?? "Unknown project"}</p>
                  <div><StatusChip label={task.status} tone={task.status === "Completed" ? "success" : "neutral"} /></div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Unscheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
