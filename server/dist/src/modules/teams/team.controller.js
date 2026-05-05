"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const team_service_1 = require("./team.service");
exports.getTeams = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, team_service_1.listTeams)());
});
//# sourceMappingURL=team.controller.js.map