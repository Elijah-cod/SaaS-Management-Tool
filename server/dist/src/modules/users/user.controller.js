"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const user_service_1 = require("./user.service");
exports.getUsers = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, user_service_1.listUsers)());
});
//# sourceMappingURL=user.controller.js.map