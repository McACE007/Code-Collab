import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchS3Folder, saveToS3 } from "./awt";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { createPty } from "./pty";
import { IPty } from "node-pty";
import { YSocketIO } from "y-socket.io/dist/server"
import * as Y from "yjs"


export function initWs(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://proposal-processor-permissions-application.trycloudflare.com", "https://proposal-processor-permissions-application.trycloudflare.com"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const ysocketio = new YSocketIO(io)

  ysocketio.initialize()

  io.on("connection", async (socket) => {
    // Auth checks should happen here
    const roomId = socket.handshake.query.roomId as string;
    console.log("User Conneted", socket.id)

    if (!roomId) {
      socket.disconnect()
      return;
    }

    await fetchS3Folder(`code/${roomId}`, path.join(__dirname, `../tmp/${roomId}`));
    const rootDir = await fetchDir(path.join(__dirname, `../tmp/${roomId}`), "");
    socket.emit("loaded", {
      rootContent: rootDir
    });

    const ydoc = ysocketio.documents.get(roomId);

    initHandlers(socket, roomId, ydoc, ysocketio);
  });

}

function initHandlers(socket: Socket, roomId: string, ydoc: Y.Doc, ysocketio: YSocketIO) {
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("fetchDir", async (dir: string, callback) => {
    const dirPath = path.join(__dirname, `../tmp/${roomId}/${dir}`);
    const contents = await fetchDir(dirPath, dir);
    callback(contents);
  });

  socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
    const selectedFileName = filePath.split('/').pop()
    const fullPath = path.join(__dirname, `../tmp/${roomId}/${filePath}`);
    const data = await fetchFileContent(fullPath);
    const ytext = ydoc?.getText(selectedFileName);
    if (ytext?.length === 0) {
      ytext.insert(0, data)
    }
    callback(data);
  });

  socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
    const selectedFileName = filePath.split('/').pop()
    const fullPath = path.join(__dirname, `../tmp/${roomId}/${filePath}`);
    const ytext = ydoc.getText(selectedFileName);
    await saveFile(fullPath, ytext.toJSON());
    // await saveToS3(`code/${roomId}`, filePath, content);
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
