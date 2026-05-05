import { apiBaseUrl } from "@/shared/config/env";

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};

export const authenticateWithApi = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as LoginResponse;
};
