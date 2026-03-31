"use client";

import { use } from "react";
import { useGetProjectsQuery, useGetTasksQuery } from "@/app/state/api";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ProjectDetailsContent projectId={Number(id)} />;
}

function ProjectDetailsContent({ projectId }: { projectId: number }) {
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery({ projectId });

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Project
        </p>
        <h2 className="text-3xl font-semibold">Project not found</h2>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This project doesn&apos;t exist in the current seeded dataset yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Project
      </p>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">{project.name}</h2>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          {project.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
          <p className="mt-3 text-2xl font-semibold">{project.status}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Owner</p>
          <p className="mt-3 text-2xl font-semibold">{project.owner}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Progress</p>
          <p className="mt-3 text-2xl font-semibold">{project.progress ?? 0}%</p>
        </article>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Open tasks</h3>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {task.status} · {task.priority ?? "No priority"}
                </p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Due {task.dueDate ?? "TBD"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
