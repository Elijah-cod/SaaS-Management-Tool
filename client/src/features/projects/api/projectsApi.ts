import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { mockProjects } from "@/lib/mock-data";
import { baseApi, shouldUseMockData } from "@/shared/api/baseApi";
import type { Project } from "@/types";

export const projectsApi = baseApi.injectEndpoints({
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
  }),
});

export const { useCreateProjectMutation, useGetProjectsQuery } = projectsApi;
