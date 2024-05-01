"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWs = void 0;
const socket_io_1 = require("socket.io");
const awt_1 = require("./awt");
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
const pty_1 = require("./pty");
const server_1 = require("y-socket.io/dist/server");
function initWs(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const ysocketio = new server_1.YSocketIO(io);
    ysocketio.initialize();
    io.on("connection", async (socket) => {
        // Auth checks should happen here
        const roomId = socket.handshake.query.roomId;
        console.log("User Conneted", socket.id);
        if (!roomId) {
            socket.disconnect();
            return;
        }
        await (0, awt_1.fetchS3Folder)(`code/${roomId}`, path_1.default.join(__dirname, `../tmp/${roomId}`));
        const rootDir = await (0, fs_1.fetchDir)(path_1.default.join(__dirname, `../tmp/${roomId}`), "");
        socket.emit("loaded", {
            rootContent: rootDir
        });
        const ydoc = ysocketio.documents.get(roomId);
        initHandlers(socket, roomId, ydoc, ysocketio);
    });
}
exports.initWs = initWs;
function initHandlers(socket, roomId, ydoc, ysocketio) {
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
    socket.on("fetchDir", async (dir, callback) => {
        const dirPath = path_1.default.join(__dirname, `../tmp/${roomId}/${dir}`);
        const contents = await (0, fs_1.fetchDir)(dirPath, dir);
        callback(contents);
    });
    socket.on("fetchContent", async ({ path: filePath }, callback) => {
        const selectedFileName = filePath.split('/').pop();
        const fullPath = path_1.default.join(__dirname, `../tmp/${roomId}/${filePath}`);
        const data = await (0, fs_1.fetchFileContent)(fullPath);
        const ytext = ydoc?.getText(selectedFileName);
        if (ytext?.length === 0) {
            ytext.insert(0, data);
        }
        callback(data);
    });
    socket.on("updateContent", async ({ path: filePath, content }) => {
        const selectedFileName = filePath.split('/').pop();
        const fullPath = path_1.default.join(__dirname, `../tmp/${roomId}/${filePath}`);
        const ytext = ydoc.getText(selectedFileName);
        await (0, fs_1.saveFile)(fullPath, ytext.toJSON());
        await (0, awt_1.saveToS3)(`code/${roomId}`, filePath, content);
    });
    let ptyTerm;
    socket.on("requestTerminal", async () => {
        ptyTerm = (0, pty_1.createPty)(roomId, (data) => {
            socket.emit('terminal', data);
        });
    });
    socket.on('disconnect', () => {
        if (ptyTerm)
            ptyTerm.kill();
    });
    socket.on("terminalData", (data) => {
        if (ptyTerm)
            ptyTerm.write(data);
    });
}
//# sourceMappingURL=ws.js.map