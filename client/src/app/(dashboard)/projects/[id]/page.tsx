"use client";

import Link from "next/link";
import { use } from "react";
import { AlertCircle, ArrowLeft, CalendarDays, CheckSquare2 } from "lucide-react";
import { useGetProjectsQuery } from "@/features/projects/api/projectsApi";
import { useGetTasksQuery } from "@/features/tasks/api/tasksApi";
import { DataState, LoadingRows, PageHeader, StatusChip } from "@/shared/ui/primitives";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProjectDetailsContent projectId={Number(id)} />;
}

function ProjectDetailsContent({ projectId }: { projectId: number }) {
  const projectsQuery = useGetProjectsQuery();
  const tasksQuery = useGetTasksQuery({ projectId }, { skip: !Number.isInteger(projectId) });
  const project = projectsQuery.data?.find((item) => item.id === projectId);

  if (projectsQuery.isLoading || tasksQuery.isLoading) {
    return <LoadingRows count={6} />;
  }

  if (projectsQuery.isError || !project || !Number.isInteger(projectId)) {
    return (
      <DataState
        icon={AlertCircle}
        tone="danger"
        title="Project not found"
        description="This project does not exist or could not be loaded from the workspace."
        action={<Link href="/projects" className="ui-button-secondary"><ArrowLeft size={15} />Back to projects</Link>}
      />
    );
  }

  const tasks = tasksQuery.data ?? [];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Project"
        title={project.name}
        description={project.description ?? "No project description has been added."}
        actions={<Link href="/projects" className="ui-button-secondary"><ArrowLeft size={15} />All projects</Link>}
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] pb-4">
        <StatusChip label={project.status} tone={project.status === "Completed" ? "success" : "accent"} />
        <span className="text-sm text-[var(--muted)]">{project.progress ?? 0}% complete</span>
        <span className="text-sm text-[var(--muted)]">Owner: {project.owner ?? "Unassigned"}</span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Tasks</h3>
          <span className="text-xs text-[var(--muted)]">{tasks.length} total</span>
        </div>
        {tasks.length === 0 ? (
          <DataState
            icon={CheckSquare2}
            title="No tasks in this project"
            description="Create a task from the overview board and assign it to this project."
            action={<Link href="/home" className="ui-button-primary">Open task board</Link>}
          />
        ) : (
          <div className="ui-panel divide-y divide-[var(--border)] overflow-hidden">
            {tasks.map((task) => (
              <article key={task.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-[var(--muted)]">{task.ticket ?? `TASK-${task.id}`}</span>
                    <StatusChip label={task.status} tone={task.status === "Completed" ? "success" : "neutral"} />
                  </div>
                  <h4 className="mt-1.5 truncate text-sm font-semibold">{task.title}</h4>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)]">
                  <CalendarDays size={14} aria-hidden="true" />
                  {formatDate(task.dueDate)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
