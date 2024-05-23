import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { HOSTED_URL } from "@/config";


export const Output = () => {
  const [url, setUrl] = useState(HOSTED_URL)

  return (
    <Card className="w-full h-1/2 mb-2 flex flex-col items-center justify-center p-2 space-y-2  dark:bg-dark dark:border-darkHover">
      <Input placeholder="http://localhost:3002" value={url} onChange={e => setUrl(e.target.value)} className="dark:bg-dark dark:border-darkHover" />
      <iframe width={"100%"} height={"100%"} src={`${url}`} />
    </Card>
  )
}
