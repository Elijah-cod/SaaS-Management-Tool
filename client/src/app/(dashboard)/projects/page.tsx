"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FolderKanban } from "lucide-react";
import ProjectsDataGrid from "@/components/ProjectsDataGrid";
import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "@/app/state/api";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isFetching } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [createProjectError, setCreateProjectError] = useState<string | null>(
    null
  );

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    setIsCreatingProject(true);
    setCreateProjectError(null);

    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      }).unwrap();

      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Failed to create project", error);
      setCreateProjectError("We couldn't create that project. Please try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Projects
          </p>
          <h2 className="text-3xl font-semibold">Delivery portfolio</h2>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Track progress, ownership, due dates, and execution risk across the
            product roadmap.
          </p>
        </div>

        <Link
          href="/projects/1"
          className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Open sample project
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
              <FolderKanban size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total projects
              </p>
              <p className="text-2xl font-semibold">{projects.length}</p>
            </div>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active delivery
          </p>
          <p className="mt-3 text-2xl font-semibold">{activeProjects}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Completed recently
          </p>
          <p className="mt-3 text-2xl font-semibold">{completedProjects}</p>
        </article>
      </div>

      <form
        onSubmit={handleCreateProject}
        className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.2fr_1.8fr_auto]"
      >
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Project name
          </span>
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Client Portal Redesign"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Description
          </span>
          <input
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder="Summarize the scope, objective, or delivery goal"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isCreatingProject}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isCreatingProject ? "Creating..." : "Create project"}
          </button>
        </div>
        {createProjectError ? (
          <p className="text-sm font-medium text-rose-600 dark:text-rose-300 lg:col-span-3">
            {createProjectError}
          </p>
        ) : null}
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project table</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLoading || isFetching
              ? "Loading project data..."
              : "Showing seeded data until the Express API is connected."}
          </p>
        </div>
        <ProjectsDataGrid projects={projects} />
      </div>
    </section>
  );
}
