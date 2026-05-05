import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { mockTeams, mockUsers } from "@/lib/mock-data";
import { baseApi, shouldUseMockData } from "@/shared/api/baseApi";
import type { Team, User, WorkspaceSearchResults } from "@/types";

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
    searchWorkspace: build.query<WorkspaceSearchResults, string>({
      query: (query) => `search?q=${encodeURIComponent(query)}`,
      providesTags: ["Search"],
    }),
  }),
});

export const { useGetTeamsQuery, useGetUsersQuery, useSearchWorkspaceQuery } =
  workspaceApi;
