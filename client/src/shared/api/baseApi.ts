import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import {
  selectAccessToken,
  setAccessToken,
} from "@/features/auth/store/sessionSlice";
import { apiBaseUrl } from "@/shared/config/env";
import type { RootState } from "@/shared/store";

export const shouldUseMockData = (error: FetchBaseQueryError | undefined) =>
  process.env.NODE_ENV !== "production" && error?.status === "FETCH_ERROR";

const rawBaseQuery = fetchBaseQuery({
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

let sessionRefreshPromise: Promise<Session | null> | null = null;

const getRefreshedSession = () => {
  if (!sessionRefreshPromise) {
    sessionRefreshPromise = getSession().finally(() => {
      sessionRefreshPromise = null;
    });
  }

  return sessionRefreshPromise;
};

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || typeof window === "undefined") {
    return result;
  }

  const refreshedSession = await getRefreshedSession();

  if (!refreshedSession?.accessToken) {
    return result;
  }

  api.dispatch(setAccessToken(refreshedSession.accessToken));
  result = await rawBaseQuery(args, api, extraOptions);

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "Search"],
  endpoints: () => ({}),
});
