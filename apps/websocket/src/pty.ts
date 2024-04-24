import { spawn, IPty } from 'node-pty';
import path from "path";

const SHELL = "bash";

export function createPty(roomId: string, onData: (data: string) => void) {
  try {
    let term = spawn(SHELL, [], {
      cols: 35,
      rows: 22,
      name: 'xterm-color',
      cwd: path.join(__dirname, `../tmp/${roomId}`)
    });

    term.onData((data: string) => {
      return onData(data)
    })

    term.onExit(() => {
      term.kill()
      console.log("User exited terminal", roomId)
    });

    return term;

  } catch (error) {
    console.log(error)
  }
}

