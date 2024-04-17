import { spawn, IPty } from 'node-pty';
import path from "path";

const SHELL = "bash";

export class TerminalManager {
  private terminalSessions: { [id: string]: { terminal: IPty, roomId: string; } } = {};

  constructor() {
    this.terminalSessions = {};
  }

  createPty(id: string, roomId: string, onData: (data: string, id: number) => void) {
    try {

      let term = spawn(SHELL, [], {
        cols: 100,
        rows: 24,
        name: 'xterm-color',
        cwd: path.join(__dirname, `../tmp/${roomId}`)
      });

      term.onData((data: string) => onData(data, term.pid));

      this.terminalSessions[id] = {
        terminal: term,
        roomId
      };

      term.onExit(() => {
        delete this.terminalSessions[term.pid];
      });
      return term;
    } catch (error) {
      console.log(error)
    }
  }

  hasTerminalSession(terminalId: string): boolean {
    return !!this.terminalSessions[terminalId];
  }

  getTerminal(terminalId: string): IPty | undefined {
    return this.terminalSessions[terminalId]?.terminal;
  }

  getRoomId(terminalId: string): string | undefined {
    return this.terminalSessions[terminalId]?.roomId;
  }

  write(terminalId: string, data: string) {
    this.terminalSessions[terminalId]?.terminal.write(data);
  }

  clear(terminalId: string) {
    this.terminalSessions[terminalId]?.terminal.kill();
    delete this.terminalSessions[terminalId];
  }
}
