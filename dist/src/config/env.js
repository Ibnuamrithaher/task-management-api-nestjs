"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
if (fs.existsSync('.env')) {
    dotenv.config();
}
//# sourceMappingURL=env.js.map