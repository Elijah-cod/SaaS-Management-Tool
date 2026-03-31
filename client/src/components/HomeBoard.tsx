"use client";

import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { mockTasks, mockUsers } from "@/lib/mock-data";
import type { Task, User } from "@/types";

const columns = [
  { id: "Backlog", title: "Backlog", accent: "text-slate-950 dark:text-white" },
  { id: "In Progress", title: "In Progress", accent: "text-sky-500 dark:text-sky-300" },
  { id: "Review", title: "Review", accent: "text-amber-500 dark:text-amber-300" },
] as const;

const typeColors: Record<string, string> = {
  Feature: "bg-sky-400",
  Infrastructure: "bg-fuchsia-500",
  Bugfix: "bg-rose-500",
  "Design System": "bg-amber-400",
};

const getUserInitials = (user?: User) =>
  user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "NA";

export default function HomeBoard() {
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.filter((task) =>
      columns.some((column) => column.id === task.status)
    )
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === result.source.droppableId) {
      const sourceTasks = tasks.filter(
        (task) => task.status === result.source.droppableId
      );
      const sourceIndexes = tasks.filter(
        (task) => task.status !== result.source.droppableId
      );
      const reorderedTasks = [...sourceTasks];
      const [movedTask] = reorderedTasks.splice(result.source.index, 1);

      if (!movedTask) {
        return;
      }

      reorderedTasks.splice(destination.index, 0, movedTask);

      setTasks([...sourceIndexes, ...reorderedTasks]);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        String(task.id) === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <div
              key={column.id}
              className="min-w-[290px] snap-start rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 md:min-w-[340px] md:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-2xl font-bold tracking-tight ${column.accent}`}>
                  {column.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-4 rounded-[1.75rem] p-1 transition ${
                      snapshot.isDraggingOver
                        ? "bg-sky-50/80 dark:bg-sky-950/30"
                        : "bg-transparent"
                    }`}
                  >
                    {columnTasks.map((task, index) => {
                      const assignees = (task.assigneeIds ?? [])
                        .map((id) => mockUsers.find((user) => user.id === id))
                        .filter((user): user is User => Boolean(user));

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <article
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-20px_rgba(15,23,42,0.28)] transition dark:border-slate-800 dark:bg-slate-950/90 ${
                                dragSnapshot.isDragging
                                  ? "rotate-[1.5deg] shadow-[0_24px_50px_-18px_rgba(14,165,233,0.45)]"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`h-5 w-5 rounded-md ${
                                        typeColors[task.type ?? ""] ?? "bg-slate-400"
                                      }`}
                                    />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {task.type ?? "Task"}
                                    </span>
                                  </div>
                                  <h4 className="max-w-[18ch] text-xl font-semibold leading-tight text-slate-950 dark:text-white md:max-w-[20ch] md:text-[2rem]">
                                    {task.title}
                                  </h4>
                                </div>

                                <button
                                  type="button"
                                  {...dragProvided.dragHandleProps}
                                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                  aria-label={`Drag ${task.title}`}
                                >
                                  <GripVertical size={18} />
                                </button>
                              </div>

                              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                                    {task.ticket ?? `TASK-${task.id}`}
                                  </span>
                                  <div className="flex -space-x-2">
                                    {assignees.map((user, avatarIndex) => (
                                      <span
                                        key={`${task.id}-${user.id}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-slate-900 dark:border-slate-950 ${
                                          avatarIndex % 3 === 0
                                            ? "bg-amber-300"
                                            : avatarIndex % 3 === 1
                                              ? "bg-sky-400"
                                              : "bg-fuchsia-400"
                                        }`}
                                        title={user.name ?? user.email}
                                      >
                                        {getUserInitials(user)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </article>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
