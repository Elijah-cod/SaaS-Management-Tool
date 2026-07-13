"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, FolderKanban, ListChecks } from "lucide-react";
import HomeBoard from "@/features/tasks/components/HomeBoard";
import { useGetProjectsQuery } from "@/features/projects/api/projectsApi";
import { useGetTasksQuery } from "@/features/tasks/api/tasksApi";
import { PageHeader } from "@/shared/ui/primitives";

export default function HomePage() {
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  ).length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority?.toLowerCase() === "high" && task.status !== "Completed"
  ).length;

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Delivery overview"
        description="Current work, ownership, and delivery risk across the workspace."
        actions={
          <Link href="/projects" className="ui-button-secondary">
            View projects
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        }
      />

      <div className="ui-panel grid divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <OverviewMetric
          icon={FolderKanban}
          label="Active projects"
          value={activeProjects}
          detail={`${projects.length} total`}
        />
        <OverviewMetric
          icon={ListChecks}
          label="In progress"
          value={inProgressTasks}
          detail={`${tasks.length} tasks`}
        />
        <OverviewMetric
          icon={AlertTriangle}
          label="High priority"
          value={highPriorityTasks}
          detail="Open tasks"
          warning={highPriorityTasks > 0}
        />
      </div>

      <HomeBoard />
    </section>
  );
}

function OverviewMetric({
  icon: Icon,
  label,
  value,
  detail,
  warning = false,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number;
  detail: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className={`flex h-8 w-8 items-center justify-center rounded-md ${warning ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-[var(--surface-muted)] text-[var(--muted-strong)]"}`}>
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-lg font-[650] tabular-nums">{value}</span>
          <span className="truncate text-xs text-[var(--muted)]">{detail}</span>
        </div>
      </div>
    </div>
  );
}
