import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { mockTasks } from "@/lib/mock-data";
import { baseApi, shouldUseMockData } from "@/shared/api/baseApi";
import type { Task, TaskAttachment } from "@/types";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], { projectId?: number } | void>({
      async queryFn(arg, _api, _extraOptions, fetchWithBQ) {
        const projectId = arg && "projectId" in arg ? arg.projectId : undefined;
        const result = await fetchWithBQ(
          projectId ? `tasks?projectId=${projectId}` : "tasks"
        );

        if (shouldUseMockData(result.error as FetchBaseQueryError | undefined)) {
          return {
            data:
              projectId === undefined
                ? mockTasks
                : mockTasks.filter((task) => task.projectId === projectId),
          };
        }

        if (result.error) {
          return { error: result.error };
        }

        const tasks = (result.data as Task[]) ?? mockTasks;

        return {
          data:
            projectId === undefined
              ? tasks
              : tasks.filter((task) => task.projectId === projectId),
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              "Tasks",
            ]
          : ["Tasks"],
    }),
    createTask: build.mutation<
      Task,
      {
        title: string;
        description?: string;
        projectId: number;
        status?: string;
        priority?: string;
        dueDate?: string | null;
        assigneeId?: string | null;
        type?: string;
      }
    >({
      query: (body) => ({ url: "tasks", method: "POST", body }),
      invalidatesTags: ["Tasks", "Projects"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: taskId },
        "Tasks",
      ],
    }),
    updateTaskAssignee: build.mutation<
      Task,
      { taskId: number; assigneeId: string | null }
    >({
      query: ({ taskId, assigneeId }) => ({
        url: `tasks/${taskId}/assignee`,
        method: "PATCH",
        body: { assigneeId },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: taskId },
        "Tasks",
      ],
    }),
    createTaskComment: build.mutation<
      Task,
      { taskId: number; authorId: string; body: string }
    >({
      query: ({ taskId, ...body }) => ({
        url: `tasks/${taskId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: taskId },
        "Tasks",
      ],
    }),
    createTaskAttachment: build.mutation<
      Task,
      {
        taskId: number;
        attachment: Pick<TaskAttachment, "name" | "sizeLabel" | "addedById">;
      }
    >({
      query: ({ taskId, attachment }) => ({
        url: `tasks/${taskId}/attachments`,
        method: "POST",
        body: attachment,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: taskId },
        "Tasks",
      ],
    }),
  }),
});

export const {
  useCreateTaskAttachmentMutation,
  useCreateTaskCommentMutation,
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskAssigneeMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
