import { AppError } from "../errors/app-error";

export const parsePositiveInt = (value: string, fieldName: string) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`, {
      code: "INVALID_ROUTE_PARAM",
    });
  }

  return parsedValue;
};
