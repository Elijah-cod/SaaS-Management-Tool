import type { NextFunction, Request, Response } from "express";

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

type Validator<T> = (value: unknown) => ValidationResult<T>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isIsoDate = (value: string) => !Number.isNaN(Date.parse(value));

const isTaskStatus = (value: string) =>
  ["Backlog", "In Progress", "Review", "Completed"].includes(value);

export const validateBody =
  <T>(validator: Validator<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = validator(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.errors,
      });
    }

    req.body = result.data;
    return next();
  };

export const validateLoginBody: Validator<{
  email: string;
  password: string;
}> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const email = typeof value.email === "string" ? value.email.trim() : "";
  const password =
    typeof value.password === "string" ? value.password.trim() : "";

  const errors = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!email.includes("@")) {
    errors.push("Email must be valid");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email: email.toLowerCase(),
      password,
    },
  };
};

export const validateProjectBody: Validator<{
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const description =
    typeof value.description === "string" ? value.description.trim() : undefined;
  const startDate =
    typeof value.startDate === "string" ? value.startDate.trim() : undefined;
  const endDate =
    typeof value.endDate === "string" ? value.endDate.trim() : undefined;

  const errors = [];

  if (!name) {
    errors.push("Project name is required");
  }

  if (startDate && !isIsoDate(startDate)) {
    errors.push("startDate must be a valid ISO date");
  }

  if (endDate && !isIsoDate(endDate)) {
    errors.push("endDate must be a valid ISO date");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name,
      description,
      startDate,
      endDate,
    },
  };
};

export const validateTaskStatusBody: Validator<{ status: string }> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const status = typeof value.status === "string" ? value.status.trim() : "";

  if (!status) {
    return { success: false, errors: ["Task status is required"] };
  }

  if (!isTaskStatus(status)) {
    return {
      success: false,
      errors: ["Task status must be Backlog, In Progress, Review, or Completed"],
    };
  }

  return {
    success: true,
    data: { status },
  };
};

export const validateTaskAssigneeBody: Validator<{
  assigneeId: string | null;
}> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const assigneeId = value.assigneeId;

  if (assigneeId === null) {
    return { success: true, data: { assigneeId: null } };
  }

  if (typeof assigneeId !== "string" || !/^u\d+$/.test(assigneeId)) {
    return {
      success: false,
      errors: ["assigneeId must be null or a user id like u12"],
    };
  }

  return {
    success: true,
    data: { assigneeId },
  };
};

export const validateTaskCommentBody: Validator<{ body: string }> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const body = typeof value.body === "string" ? value.body.trim() : "";

  if (!body) {
    return { success: false, errors: ["body is required"] };
  }

  if (body.length > 2000) {
    return {
      success: false,
      errors: ["body must be 2000 characters or fewer"],
    };
  }

  return {
    success: true,
    data: { body },
  };
};

export const validateTaskAttachmentBody: Validator<{
  name: string;
  sizeLabel?: string;
}> = (value) => {
  if (!isRecord(value)) {
    return { success: false, errors: ["Request body must be an object"] };
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const sizeLabel =
    typeof value.sizeLabel === "string" ? value.sizeLabel.trim() : undefined;

  const errors = [];

  if (!name) {
    errors.push("name is required");
  }

  if (name.length > 255) {
    errors.push("name must be 255 characters or fewer");
  }

  if (sizeLabel && sizeLabel.length > 120) {
    errors.push("sizeLabel must be 120 characters or fewer");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, sizeLabel },
  };
};
