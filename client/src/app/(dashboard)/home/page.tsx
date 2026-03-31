"use client";

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import HomeBoard from "@/components/HomeBoard";
import { useGetProjectsQuery } from "@/app/state/api";
import type { DashboardStat } from "@/types";

export default function HomePage() {
  const { data: projects = [] } = useGetProjectsQuery();

  const stats: DashboardStat[] = [
    {
      label: "Active projects",
      value: String(
        projects.filter((project) => project.status !== "Completed").length
      ),
      helperText: "Live workstreams currently in motion.",
    },
    {
      label: "At risk",
      value: String(
        projects.filter((project) => project.status === "At Risk").length
      ),
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

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75">
        <div className="flex flex-col gap-8 p-6 md:p-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
              Home Board
              <MoveRight size={14} />
            </div>
            <div className="space-y-3">
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Delivery board built for momentum, not just status reporting.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                Organize the week like a product team: swipe across lanes on
                mobile, drag cards between stages, and keep the most important
                work visible at a glance.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              View all projects
              <ArrowRight size={16} />
            </Link>
            <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-5 py-3 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
              Drag cards between lanes to reprioritize
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-white/70 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-950/30 md:grid-cols-3 md:p-6">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/90"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {stat.helperText}
              </p>
            </article>
          ))}
        </div>
      </div>

      <HomeBoard />
    </section>
  );
}
