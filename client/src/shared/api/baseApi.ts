import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { selectAccessToken } from "@/features/auth/store/sessionSlice";
import { apiBaseUrl } from "@/shared/config/env";
import type { RootState } from "@/shared/store";

export const shouldUseMockData = (error: FetchBaseQueryError | undefined) =>
  process.env.NODE_ENV !== "production" && error?.status === "FETCH_ERROR";

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = selectAccessToken(state);

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    if (typeof window !== "undefined") {
      headers.set("x-client-origin", window.location.origin);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Search"],
  endpoints: () => ({}),
});
