"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Paperclip, UserPlus, X } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { roleStyles } from "@/features/tasks/lib/task-board";
import { useGetUsersQuery } from "@/features/workspace/api/workspaceApi";
import type { Task, TaskAttachment, TaskComment, User } from "@/types";

interface TaskDetailsSheetProps {
  isOpen: boolean;
  task: Task | null;
  currentUserId: string | null;
  onClose: () => void;
  onTaskChange: (task: Task) => void;
}

const getInitials = (user?: User) =>
  user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "NA";

export default function TaskDetailsSheet({
  isOpen,
  task,
  currentUserId,
  onClose,
  onTaskChange,
}: TaskDetailsSheetProps) {
  const [commentBody, setCommentBody] = useState("");
  const { data: usersData } = useGetUsersQuery();
  const users = usersData ?? mockUsers;

  const creator = useMemo(
    () => users.find((user) => user.id === task?.createdById),
    [task, users]
  );

  if (!task) {
    return null;
  }

  const toggleAssignee = (userId: string) => {
    const nextAssigneeId = task.assigneeId === userId ? null : userId;

    onTaskChange({
      ...task,
      assigneeIds: nextAssigneeId ? [nextAssigneeId] : [],
      assigneeId: nextAssigneeId,
    });
  };

  const addComment = () => {
    const trimmed = commentBody.trim();

    if (!trimmed) {
      return;
    }

    const nextComment: TaskComment = {
      id: `comment-${Date.now()}`,
      authorId: currentUserId ?? task.createdById ?? "u1",
      body: trimmed,
      createdAt: new Date().toISOString(),
    };

    onTaskChange({
      ...task,
      comments: [...(task.comments ?? []), nextComment],
    });
    setCommentBody("");
  };

  const addAttachments = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const nextAttachments: TaskAttachment[] = Array.from(files).map((file) => ({
      id: `attachment-${Date.now()}-${file.name}`,
      name: file.name,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      addedById: currentUserId ?? task.createdById ?? "u1",
      addedAt: new Date().toISOString(),
    }));

    onTaskChange({
      ...task,
      attachments: [...(task.attachments ?? []), ...nextAttachments],
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-white/60 bg-[rgba(255,255,255,0.92)] p-5 shadow-2xl backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-[rgba(10,15,26,0.92)] md:p-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {task.ticket}
            </p>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
              {task.title}
            </h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              {task.description ?? "No task description yet."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close task details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Created by
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400 font-bold text-slate-950">
                {getInitials(creator)}
              </span>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">
                  {creator?.name ?? "Unknown teammate"}
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    roleStyles[creator?.role ?? "default"] ?? roleStyles.default
                  }`}
                >
                  {creator?.role ?? "Team Member"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Current lane
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
              {task.status}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Due {task.dueDate ?? "TBD"} · Priority {task.priority ?? "Unset"}
            </p>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-slate-500" />
            <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
              Assignees
            </h4>
          </div>
          <div className="mt-4 grid gap-3">
            {users.map((user) => {
              const selected = task.assigneeId === user.id;

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleAssignee(user.id)}
                  className={`flex items-center justify-between rounded-[1.25rem] border p-4 text-left transition ${
                    selected
                      ? "border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/40"
                      : "border-slate-200 bg-white/70 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-900 dark:bg-slate-700 dark:text-white">
                      {getInitials(user)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {user.name}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          roleStyles[user.role ?? "default"] ?? roleStyles.default
                        }`}
                      >
                        {user.role ?? "Team Member"}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                    {selected ? "Assigned" : "Assign"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-slate-500" />
            <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
              Comments
            </h4>
          </div>
          <div className="mt-4 space-y-3">
            {(task.comments ?? []).map((comment) => {
              const author = users.find((user) => user.id === comment.authorId);

              return (
                <article
                  key={comment.id}
                  className="rounded-[1.25rem] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {author?.name ?? "Unknown teammate"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        roleStyles[author?.role ?? "default"] ?? roleStyles.default
                      }`}
                    >
                      {author?.role ?? "Team Member"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {comment.body}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 space-y-3">
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Add context, a handoff note, or an implementation update"
              className="min-h-28 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="button"
              onClick={addComment}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Add comment
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <Paperclip size={18} className="text-slate-500" />
            <h4 className="text-lg font-semibold text-slate-950 dark:text-white">
              Attachments
            </h4>
          </div>
          <div className="mt-4 space-y-3">
            {(task.attachments ?? []).map((attachment) => (
              <article
                key={attachment.id}
                className="rounded-[1.25rem] border border-slate-200 bg-white/75 p-4 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Added {new Date(attachment.addedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                    {attachment.sizeLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300 bg-white/75 px-4 py-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(event) => addAttachments(event.target.files)}
            />
            Add attachments
          </label>
        </section>
      </aside>
    </div>
  );
}
