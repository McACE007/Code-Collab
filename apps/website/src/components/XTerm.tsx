"use client"
import { useSocket } from "@/hooks/useSocket";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm"
import { useEffect, useRef } from "react"
import "./xterm-helper-hide.css"

export default function XTerm() {
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null)
  const divRef = useRef<HTMLDivElement | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!divRef || !divRef.current) return;

    term.current = new Terminal({
      fontSize: 13,
      fontFamily: '"Menlo for Powerline", Menlo, Consolas, "Liberation Mono", Courier, monospace',
      theme: {
        foreground: '#d2d2d2',
        background: '#2b2b2b',
        cursor: '#adadad',
        black: '#000000',
        red: '#d81e00',
        green: '#5ea702',
        yellow: '#cfae00',
        blue: '#427ab3',
        magenta: '#89658e',
        cyan: '#00a7aa',
        white: '#dbded8',
        brightBlack: '#686a66',
        brightRed: '#f54235',
      },
      allowTransparency: true,
      cols: 40,
      rows: 25,
    });
    term.current.open(divRef.current!)
    fitAddon.current = new FitAddon()
    fitAddon.current.fit()

    return () => {
      if (term.current) {
        term.current.dispose()
        term.current = null;
        fitAddon.current?.dispose()
        fitAddon.current = null;
      }
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.emit("requestTerminal");

    socket.on("terminal", (data: string) => {
      term.current?.write(data);
    })

    term.current?.onData((data) => {
      socket.emit("terminalData", data)
    })

    socket.emit('terminalData', 'clear\n');

    return () => {
      socket.off("terminal");
    }
  }, [socket])


  return (
    <div className="w-full h-full px-2 py-3 flex flex-col space-y-10 justify-center" ref={divRef}>
      <iframe width={"330px"} height={"300px"} src={`http://localhost:6000`} />
    </div>
  )
}
