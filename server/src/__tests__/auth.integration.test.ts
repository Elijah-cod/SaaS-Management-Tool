import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "../app";
import { hashPassword, createAccessToken } from "../lib/auth";
import { prisma } from "../lib/prisma";

type PrismaUser = Awaited<ReturnType<typeof prisma.user.findUnique>>;

const originalUserFindUnique = prisma.user.findUnique.bind(prisma.user);
const originalProjectFindMany = prisma.project.findMany.bind(prisma.project);
const originalCommentCreate = prisma.comment.create.bind(prisma.comment);
const originalTaskFindUnique = prisma.task.findUnique.bind(prisma.task);
const prismaUser = prisma.user as unknown as {
  findUnique: typeof originalUserFindUnique;
};
const prismaProject = prisma.project as unknown as {
  findMany: typeof originalProjectFindMany;
};
const prismaComment = prisma.comment as unknown as {
  create: typeof originalCommentCreate;
};
const prismaTask = prisma.task as unknown as {
  findUnique: typeof originalTaskFindUnique;
};

let activeServer: Server | null = null;

const startServer = async () => {
  const app = createApp();
  const server = app.listen(0, "127.0.0.1");
  activeServer = server;

  await new Promise<void>((resolve) => {
    server.on("listening", () => resolve());
  });

  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
};

afterEach(async () => {
  prismaUser.findUnique = originalUserFindUnique;
  prismaProject.findMany = originalProjectFindMany;
  prismaComment.create = originalCommentCreate;
  prismaTask.findUnique = originalTaskFindUnique;

  if (activeServer) {
    await new Promise<void>((resolve, reject) => {
      activeServer?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
    activeServer = null;
  }
});

test("POST /auth/login returns an access token for valid persisted credentials", { concurrency: false }, async () => {
  const passwordHash = await hashPassword("ChangeMe123!");
  const fakeUser: NonNullable<PrismaUser> = {
    userId: 7,
    email: "amina@saasmanager.app",
    name: "Amina Hassan",
    passwordHash,
    role: "Product Manager",
    profilePictureUrl: null,
    teamId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaUser.findUnique = (async () => fakeUser) as unknown as typeof originalUserFindUnique;

  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: "amina@saasmanager.app",
      password: "ChangeMe123!",
    }),
  });

  assert.equal(response.status, 200);
  const payload = (await response.json()) as {
    accessToken: string;
    user: { email: string; role: string };
  };
  assert.ok(payload.accessToken);
  assert.equal(payload.user.email, "amina@saasmanager.app");
  assert.equal(payload.user.role, "Product Manager");
});

test("POST /auth/login rejects an invalid request body", { concurrency: false }, async () => {
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: "not-an-email",
    }),
  });

  assert.equal(response.status, 400);
  const payload = (await response.json()) as { errors: string[] };
  assert.ok(payload.errors.includes("Email must be valid"));
  assert.ok(payload.errors.includes("Password is required"));
});

test("GET /projects requires authentication", { concurrency: false }, async () => {
  const baseUrl = await startServer();
  const response = await fetch(`${baseUrl}/projects`);

  assert.equal(response.status, 401);
});

test("POST /projects rejects users without the required role", { concurrency: false }, async () => {
  const baseUrl = await startServer();
  const token = createAccessToken({
    userId: 3,
    email: "viewer@saasmanager.app",
    role: "Team Member",
  });

  const response = await fetch(`${baseUrl}/projects`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Unauthorized Project",
    }),
  });

  assert.equal(response.status, 403);
});

test("PATCH /tasks/:taskId/status validates allowed lane values", { concurrency: false }, async () => {
  const baseUrl = await startServer();
  const token = createAccessToken({
    userId: 7,
    email: "amina@saasmanager.app",
    role: "Product Manager",
  });

  const response = await fetch(`${baseUrl}/tasks/101/status`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      status: "Done",
    }),
  });

  assert.equal(response.status, 400);
  const payload = (await response.json()) as { errors: string[] };
  assert.ok(
    payload.errors.includes(
      "Task status must be Backlog, In Progress, Review, or Completed"
    )
  );
});

test("POST /tasks/:taskId/comments uses the authenticated user instead of a spoofed author id", { concurrency: false }, async () => {
  let createdCommentUserId = 0;

  prismaComment.create = (async ({
    data,
  }: {
    data: { text: string; taskId: number; userId: number };
  }) => {
    createdCommentUserId = data.userId;

    return {
      id: 1,
      text: data.text,
      taskId: data.taskId,
      userId: data.userId,
    };
  }) as unknown as typeof originalCommentCreate;

  prismaTask.findUnique = (async () => ({
    id: 101,
    title: "Test task",
    description: null,
    status: "Backlog",
    priority: "High",
    tags: "Feature",
    startDate: null,
    dueDate: null,
    points: null,
    projectId: 1,
    authorUserId: 7,
    assignedUserId: 7,
    author: {
      userId: 7,
      email: "amina@saasmanager.app",
      name: "Amina Hassan",
      passwordHash: "hash",
      role: "Product Manager",
      profilePictureUrl: null,
      teamId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignee: {
      userId: 7,
      email: "amina@saasmanager.app",
      name: "Amina Hassan",
      passwordHash: "hash",
      role: "Product Manager",
      profilePictureUrl: null,
      teamId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    attachments: [],
    comments: [],
  })) as unknown as typeof originalTaskFindUnique;

  const baseUrl = await startServer();
  const token = createAccessToken({
    userId: 7,
    email: "amina@saasmanager.app",
    role: "Product Manager",
  });

  const response = await fetch(`${baseUrl}/tasks/101/comments`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      authorId: "u999",
      body: "Ship it",
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(createdCommentUserId, 7);
});
