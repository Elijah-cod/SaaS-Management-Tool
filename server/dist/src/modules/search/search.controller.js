"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspace = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const search_service_1 = require("./search.service");
exports.searchWorkspace = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const results = await (0, search_service_1.searchWorkspaceResources)(query);
    res.json(results);
});
//# sourceMappingURL=search.controller.js.map