import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { mockProjects, mockTasks, mockTeams, mockUsers } from "@/lib/mock-data";
import type {
  Project,
  Task,
  TaskAttachment,
  Team,
  User,
} from "@/types";
import type { RootState } from "@/lib/store";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const shouldUseMockData = (error: FetchBaseQueryError | undefined) =>
  process.env.NODE_ENV !== "production" && error?.status === "FETCH_ERROR";

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token =
      state.global.accessToken ??
      (typeof window !== "undefined"
        ? window.localStorage.getItem("accessToken")
        : null);

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (typeof window !== "undefined") {
      headers.set("x-client-origin", window.location.origin);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ("projects");
        if (shouldUseMockData(result.error as FetchBaseQueryError | undefined)) {
          return { data: mockProjects };
        }

        if (result.error) {
          return { error: result.error };
        }

        return { data: (result.data as Project[]) ?? mockProjects };
      },
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: "projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
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
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
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
      invalidatesTags: (result, error, { taskId }) => [
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
      invalidatesTags: (result, error, { taskId }) => [
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
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        "Tasks",
      ],
    }),
    getUsers: build.query<User[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ("users");
        if (shouldUseMockData(result.error as FetchBaseQueryError | undefined)) {
          return { data: mockUsers };
        }

        if (result.error) {
          return { error: result.error };
        }

        return { data: (result.data as User[]) ?? mockUsers };
      },
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ("teams");
        if (shouldUseMockData(result.error as FetchBaseQueryError | undefined)) {
          return { data: mockTeams };
        }

        if (result.error) {
          return { error: result.error };
        }

        return { data: (result.data as Team[]) ?? mockTeams };
      },
      providesTags: ["Teams"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskAssigneeMutation,
  useCreateTaskCommentMutation,
  useCreateTaskAttachmentMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
} = api;
