"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePositiveInt = void 0;
const app_error_1 = require("../errors/app-error");
const parsePositiveInt = (value, fieldName) => {
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        throw new app_error_1.AppError(400, `${fieldName} must be a positive integer`, {
            code: "INVALID_ROUTE_PARAM",
        });
    }
    return parsedValue;
};
exports.parsePositiveInt = parsePositiveInt;
//# sourceMappingURL=params.js.map