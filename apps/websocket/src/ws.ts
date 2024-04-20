import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchS3Folder, saveToS3 } from "./awt";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { createPty } from "./pty";
import { IPty } from "node-pty";


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

    console.log("User Conneted", socket.id)

    if (!roomId) {
      socket.disconnect()
      return;
    }


    // await fetchS3Folder(`code/${roomId}`, path.join(__dirname, `../tmp/${roomId}`));
    socket.emit("loaded", {
      rootContent: await fetchDir(path.join(__dirname, `../tmp/${roomId}`), "")
    });
    initHandlers(socket, roomId);
  });
}

function initHandlers(socket: Socket, roomId: string) {
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
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

  let ptyTerm: IPty | undefined;

  socket.on("requestTerminal", async () => {
    ptyTerm = createPty(roomId, (data) => {
      socket.emit('terminal', data);
    });
  });

  socket.on('disconnect', () => {
    if (ptyTerm) ptyTerm.kill()
  })

  socket.on("terminalData", (data) => {
    if (ptyTerm) ptyTerm.write(data)
  });

}
