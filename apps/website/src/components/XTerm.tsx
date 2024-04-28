"use client"
import { useTerminal } from "@/hooks/useTerminal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import "./xterm-helper-hide.css"

function XTerm() {
  const { handleClear, handleRunCode, divRef } = useTerminal();

  return (
    <Card className="h-fit w-fit p-2 dark:bg-dark dark:border-darkHover space-y-0.5" ref={divRef}>
      <div className="flex justify-between">
        <Button type="button" onClick={handleRunCode}>Run Code</Button>
        <Button type="button" variant="destructive" onClick={handleClear}>Clear</Button>
      </div>
    </Card>
  )
}

export default XTerm;
