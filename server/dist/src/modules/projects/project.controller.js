"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const project_service_1 = require("./project.service");
exports.getProjects = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const projects = await (0, project_service_1.listProjects)();
    res.json(projects);
});
exports.createProject = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const project = await (0, project_service_1.createProjectRecord)(req.body);
    res.status(201).json(project);
});
//# sourceMappingURL=project.controller.js.map