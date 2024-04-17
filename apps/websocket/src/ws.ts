import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchS3Folder, saveToS3 } from "./awt";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { TerminalManager } from "./pty";

const terminalManager = new TerminalManager();

export function initWs(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    // Auth checks should happen here
    const roomId = socket.handshake.query.roomId as string;

    if (!roomId) {
      socket.disconnect();
      terminalManager.clear(socket.id);
      return;
    }

    await fetchS3Folder(`code/${roomId}`, path.join(__dirname, `../tmp/${roomId}`));
    socket.emit("loaded", {
      rootContent: await fetchDir(path.join(__dirname, `../tmp/${roomId}`), "")
    });
    initHandlers(socket, roomId);
  });
}

function initHandlers(socket: Socket, roomId: string) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("fetchDir", async (dir: string, callback) => {
    const dirPath = path.join(__dirname, `../tmp/${roomId}/${dir}`);
    const contents = await fetchDir(dirPath, dir);
    callback(contents);
  });

  socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
    const fullPath = path.join(__dirname, `../tmp/${roomId}/${filePath}`);
    const data = await fetchFileContent(fullPath);
    callback(data);
  });

  // TODO: contents should be diff, not full file
  // Should be validated for size
  // Should be throttled before updating S3 (or use an S3 mount)
  socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
    const fullPath = path.join(__dirname, `../tmp/${roomId}/${filePath}`);
    await saveFile(fullPath, content);
    await saveToS3(`code/${roomId}`, filePath, content);
  });

  const terminalID = socket.id;

  socket.on("requestTerminal", async () => {
    terminalManager.createPty(terminalID, roomId, (data) => {
      socket.emit('terminal', {
        data, terminalID
      });
    });
  });

  socket.on('disconnect', () => {
    terminalManager.clear(terminalID)
  })

  socket.on("terminalData", async ({ data, terminalId }: { data: string, terminalId: string }) => {
    terminalManager.write(terminalID, data);
  });

}
