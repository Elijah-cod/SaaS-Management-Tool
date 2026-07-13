"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
if (!process.env.VERCEL) {
    app_1.default.listen(env_1.env.port, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${env_1.env.port}`);
    });
}
exports.default = app_1.default;
//# sourceMappingURL=index.js.map