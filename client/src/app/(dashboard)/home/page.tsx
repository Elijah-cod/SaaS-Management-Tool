"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetProjectsQuery } from "@/app/state/api";
import type { DashboardStat } from "@/types";

export default function HomePage() {
  const { data: projects = [] } = useGetProjectsQuery();

  const stats: DashboardStat[] = [
    {
      label: "Active projects",
      value: String(projects.filter((project) => project.status !== "Completed").length),
      helperText: "Live workstreams currently in motion.",
    },
    {
      label: "At risk",
      value: String(projects.filter((project) => project.status === "At Risk").length),
      helperText: "Projects needing closer delivery attention.",
    },
    {
      label: "Average progress",
      value: `${Math.round(
        projects.reduce((sum, project) => sum + (project.progress ?? 0), 0) /
          Math.max(projects.length, 1)
      )}%`,
      helperText: "Execution progress across the seeded portfolio.",
    },
  ];

  const highlightedProjects = projects.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Home
        </p>
        <h2 className="text-3xl font-semibold">Portfolio snapshot</h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Start here with the current project pipeline, delivery pressure, and team momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stat.helperText}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Priority projects</h3>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Start with the projects carrying the most delivery weight this week.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-300"
          >
            View all projects
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlightedProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {project.status}
              </p>
              <h4 className="mt-2 text-lg font-semibold">{project.name}</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {project.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{project.owner}</span>
                <span>{project.progress ?? 0}% complete</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
