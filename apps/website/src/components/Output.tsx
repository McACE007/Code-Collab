import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";


export const Output = () => {
  const [url, setUrl] = useState("http://localhost:3002")

  return (
    <Card className="w-[330px] h-[350px] mb-2 flex flex-col items-center justify-center p-2 space-y-2">
      <Input placeholder="http://localhost:3002" value={url} onChange={e => setUrl(e.target.value)} />
      <iframe width={"100%"} height={"100%"} src={`${url}`} />
    </Card>
  )
}
