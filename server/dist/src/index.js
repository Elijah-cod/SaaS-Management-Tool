"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_1 = require("./config/env");
const app_1 = require("./app");
const app = (0, app_1.createApp)();
app.listen(env_1.env.port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${env_1.env.port}`);
});
//# sourceMappingURL=index.js.map