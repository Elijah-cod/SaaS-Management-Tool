import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockProjects, mockTasks, mockTeams, mockUsers } from "@/lib/mock-data";
import type { Project, Task, Team, User } from "@/types";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
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
        if (result.error) {
          return { data: mockProjects };
        }

        return { data: (result.data as Project[]) ?? mockProjects };
      },
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: "projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      async queryFn({ projectId }, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ(`tasks?projectId=${projectId}`);
        if (result.error) {
          return { data: mockTasks.filter((task) => task.projectId === projectId) };
        }

        return {
          data:
            ((result.data as Task[]) ?? mockTasks).filter(
              (task) => task.projectId === projectId
            ),
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
      ],
    }),
    getUsers: build.query<User[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ("users");
        if (result.error) {
          return { data: mockUsers };
        }

        return { data: (result.data as User[]) ?? mockUsers };
      },
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      async queryFn(_arg, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ("teams");
        if (result.error) {
          return { data: mockTeams };
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
  useUpdateTaskStatusMutation,
  useGetUsersQuery,
  useGetTeamsQuery,
} = api;
