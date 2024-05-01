"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHttp = void 0;
const awt_1 = require("./awt");
const express_1 = __importDefault(require("express"));
function initHttp(app) {
    app.use(express_1.default.json());
    app.post("/project", async (req, res) => {
        const { roomId, language } = req.body;
        if (!roomId) {
            res.status(400).send("Bad request");
            return;
        }
        await (0, awt_1.copyS3Folder)(`base/${language}`, `code/${roomId}`);
        res.send("Project created");
    });
}
exports.initHttp = initHttp;
//# sourceMappingURL=http.js.map