"use client"
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export const TerminalComponent = ({ socket }: { socket: Socket }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) {
      return;
    }

    if (typeof window !== "undefined") {
      import("@xterm/xterm").then(({ Terminal }) => {
        import("@xterm/addon-fit").then(({ FitAddon }) => {
          const term = new Terminal();
          const fitAddon = new FitAddon();
          term.loadAddon(fitAddon);
          term.open(terminalRef.current!);
          fitAddon.fit();

          socket.emit("requestTerminal")

          socket.on("terminal", ({ data, terminalID }: { data: string, terminalID: string }) => {
            if (terminalIdRef.current === null) {
              terminalIdRef.current = terminalID;
            }
            if (terminalIdRef.current === terminalID) {
              return term.write(data)
            }
          })

          term.onData((data) => {
            if (terminalIdRef.current !== null) {
              socket.emit('terminalData', {
                data, terminalId: terminalIdRef.current
              });
            }
          });

          return () => {
            term.dispose();
            socket.off("terminal")
            if (terminalIdRef.current !== null) {
              socket.off("terminalData");
            }
          }
        })
      })
    }
  }, [socket, terminalRef])
  return (
    <div className="w-full h-full bg-transparent" ref={terminalRef} />
  )
}

