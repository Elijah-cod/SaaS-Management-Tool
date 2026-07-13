"use client";

import { useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import ProjectsDataGrid from "@/components/ProjectsDataGrid";
import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "@/features/projects/api/projectsApi";
import { DataState, PageHeader } from "@/shared/ui/primitives";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isFetching, isError, refetch } =
    useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [createProjectError, setCreateProjectError] = useState<string | null>(null);

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  ).length;
  const averageProgress = Math.round(
    projects.reduce((sum, project) => sum + (project.progress ?? 0), 0) /
      Math.max(projects.length, 1)
  );

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectName.trim()) return;

    setIsCreatingProject(true);
    setCreateProjectError(null);

    try {
      await createProject({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      }).unwrap();
      setProjectName("");
      setProjectDescription("");
      setIsComposerOpen(false);
    } catch (error) {
      console.error("Failed to create project", error);
      setCreateProjectError("The project could not be created. Check the API connection and try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description="Track active workstreams, progress, and delivery windows."
        actions={
          <button
            type="button"
            onClick={() => setIsComposerOpen((current) => !current)}
            className={isComposerOpen ? "ui-button-secondary" : "ui-button-primary"}
          >
            {isComposerOpen ? <X size={15} /> : <Plus size={15} />}
            {isComposerOpen ? "Close" : "New project"}
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--border)] pb-4 text-sm">
        <Summary label="Total" value={projects.length} />
        <Summary label="Active" value={activeProjects} />
        <Summary label="Average progress" value={`${averageProgress}%`} />
      </div>

      {isComposerOpen ? (
        <form onSubmit={handleCreateProject} className="ui-panel grid gap-4 p-4 lg:grid-cols-[1fr_1.5fr_auto]">
          <label className="space-y-1.5 text-sm font-semibold">
            <span>Project name</span>
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              className="ui-field"
              placeholder="Mobile onboarding"
              autoFocus
              required
            />
          </label>
          <label className="space-y-1.5 text-sm font-semibold">
            <span>Description</span>
            <input
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              className="ui-field"
              placeholder="What outcome should this project deliver?"
            />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={isCreatingProject} className="ui-button-primary w-full">
              {isCreatingProject ? "Creating..." : "Create project"}
            </button>
          </div>
          {createProjectError ? (
            <p className="text-sm text-[var(--danger)] lg:col-span-3" role="alert">
              {createProjectError}
            </p>
          ) : null}
        </form>
      ) : null}

      {isError ? (
        <DataState
          icon={AlertCircle}
          tone="danger"
          title="Projects are unavailable"
          description="The workspace API did not return project data. Check the service connection, then retry."
          action={<button type="button" onClick={() => refetch()} className="ui-button-secondary">Retry</button>}
        />
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">All projects</h3>
            <p className="text-xs text-[var(--muted)]" role="status">
              {isFetching && !isLoading ? "Refreshing..." : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <ProjectsDataGrid projects={projects} loading={isLoading} />
        </div>
      )}
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-[var(--muted)]">{label}</span>
      <strong className="font-semibold tabular-nums text-[var(--foreground)]">{value}</strong>
    </span>
  );
}
