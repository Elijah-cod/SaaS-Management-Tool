"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, search_controller_1.searchWorkspace);
exports.default = router;
//# sourceMappingURL=search.routes.js.map