"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Paperclip, UserPlus, X } from "lucide-react";
import { useGetUsersQuery } from "@/features/workspace/api/workspaceApi";
import { Avatar, StatusChip } from "@/shared/ui/primitives";
import type { Task, TaskAttachment, TaskComment } from "@/types";

interface TaskDetailsSheetProps {
  isOpen: boolean;
  task: Task | null;
  currentUserId: string | null;
  onClose: () => void;
  onTaskChange: (task: Task) => void;
}

export default function TaskDetailsSheet({
  isOpen,
  task,
  currentUserId,
  onClose,
  onTaskChange,
}: TaskDetailsSheetProps) {
  const [commentBody, setCommentBody] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const { data: users = [] } = useGetUsersQuery();
  const sheetRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const creator = useMemo(
    () => users.find((user) => user.id === task?.createdById),
    [task?.createdById, users]
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        )
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!task) return null;

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
    if (!trimmed) return;

    const nextComment: TaskComment = {
      id: `comment-${Date.now()}`,
      authorId: currentUserId ?? task.createdById ?? "u1",
      body: trimmed,
      createdAt: new Date().toISOString(),
    };

    onTaskChange({ ...task, comments: [...(task.comments ?? []), nextComment] });
    setCommentBody("");
  };

  const addAttachmentReference = () => {
    const trimmed = attachmentName.trim();
    if (!trimmed) return;

    const nextAttachment: TaskAttachment = {
      id: `attachment-${Date.now()}`,
      name: trimmed,
      sizeLabel: "File reference",
      addedById: currentUserId ?? task.createdById ?? "u1",
      addedAt: new Date().toISOString(),
    };

    onTaskChange({
      ...task,
      attachments: [...(task.attachments ?? []), nextAttachment],
    });
    setAttachmentName("");
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 h-full w-full cursor-default bg-[var(--overlay)] transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-label="Close task details"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_70px_-24px_rgb(15_23_42_/_0.4)] transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--muted)]">{task.ticket ?? `TASK-${task.id}`}</span>
              <StatusChip label={task.status} tone={task.status === "Completed" ? "success" : "accent"} />
            </div>
            <h3 id="task-details-title" className="mt-2 text-lg font-[650] leading-6 tracking-[-0.02em]">
              {task.title}
            </h3>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="ui-icon-button shrink-0" aria-label="Close task details">
            <X size={17} />
          </button>
        </header>

        <div className="space-y-7 px-5 py-5 sm:px-6">
          <section>
            <p className="text-sm leading-6 text-[var(--muted-strong)]">
              {task.description ?? "No task description has been added."}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-[var(--surface-muted)] p-3 text-xs">
              <div><dt className="text-[var(--muted)]">Created by</dt><dd className="mt-1 font-semibold">{creator?.name ?? "Unknown member"}</dd></div>
              <div><dt className="text-[var(--muted)]">Priority</dt><dd className="mt-1 font-semibold">{task.priority ?? "Unset"}</dd></div>
              <div><dt className="text-[var(--muted)]">Due date</dt><dd className="mt-1 font-semibold">{formatDate(task.dueDate)}</dd></div>
              <div><dt className="text-[var(--muted)]">Type</dt><dd className="mt-1 font-semibold">{task.type ?? "Task"}</dd></div>
            </dl>
          </section>

          <SheetSection icon={UserPlus} title="Assignee">
            <div className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)]">
              {users.map((user) => {
                const selected = task.assigneeId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleAssignee(user.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left ${selected ? "bg-[var(--accent-soft)]" : "bg-[var(--surface)] hover:bg-[var(--surface-muted)]"}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name ?? user.email}</p><p className="truncate text-xs text-[var(--muted)]">{user.role ?? "Member"}</p></div>
                    </div>
                    <span className={`text-xs font-semibold ${selected ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{selected ? "Assigned" : "Assign"}</span>
                  </button>
                );
              })}
            </div>
          </SheetSection>

          <SheetSection icon={MessageSquare} title={`Comments (${task.comments?.length ?? 0})`}>
            <div className="space-y-2">
              {(task.comments ?? []).map((comment) => {
                const author = users.find((user) => user.id === comment.authorId);
                return (
                  <article key={comment.id} className="rounded-lg bg-[var(--surface-muted)] p-3">
                    <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold">{author?.name ?? "Unknown member"}</p><time className="text-[11px] text-[var(--muted)]">{formatDateTime(comment.createdAt)}</time></div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">{comment.body}</p>
                  </article>
                );
              })}
              {(task.comments?.length ?? 0) === 0 ? <p className="text-sm text-[var(--muted)]">No comments yet.</p> : null}
            </div>
            <label className="mt-3 block space-y-1.5"><span className="sr-only">Add a comment</span><textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} placeholder="Add context or a handoff note" className="ui-field min-h-24 resize-y" /></label>
            <button type="button" onClick={addComment} disabled={!commentBody.trim()} className="ui-button-primary mt-2">Add comment</button>
          </SheetSection>

          <SheetSection icon={Paperclip} title={`Attachments (${task.attachments?.length ?? 0})`}>
            <div className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)]">
              {(task.attachments ?? []).map((attachment) => (
                <article key={attachment.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold">{attachment.name}</p><p className="text-xs text-[var(--muted)]">{attachment.sizeLabel}</p></div>
                  <time className="shrink-0 text-[11px] text-[var(--muted)]">{formatDate(attachment.addedAt)}</time>
                </article>
              ))}
              {(task.attachments?.length ?? 0) === 0 ? <p className="px-3 py-4 text-sm text-[var(--muted)]">No attachment references yet.</p> : null}
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">This workspace currently stores attachment names as references. Binary file upload is not enabled.</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input value={attachmentName} onChange={(event) => setAttachmentName(event.target.value)} className="ui-field" placeholder="Filename or document link" aria-label="Attachment name" />
              <button type="button" onClick={addAttachmentReference} disabled={!attachmentName.trim()} className="ui-button-secondary shrink-0">Add reference</button>
            </div>
          </SheetSection>
        </div>
      </aside>
    </div>
  );
}

function SheetSection({ icon: Icon, title, children }: { icon: typeof UserPlus; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2"><Icon size={16} className="text-[var(--muted)]" aria-hidden="true" /><h4 className="text-sm font-semibold">{title}</h4></div>
      {children}
    </section>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
