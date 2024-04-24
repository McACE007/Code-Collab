"use client"
import { ComboboxDemo } from "@/components/ComboBox";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [isNew, setIsNew] = useState(false);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [language, setLanguage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    setRoomId(uuid())
  }, [isNew])

  async function handleJoin() {
    if (!roomId || !language) return;

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3001/project`, {
        method: "POST",
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId, language, username
        })
      })
      if (response.status === 200) {
        toast({ title: "Created a new Room successfully" })
      } else {
        toast({ title: "Failed to create a room", description: "Requested room was not created due to some issue with the server. Please try again.", variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: "Failed to create a room", description: "Requested room was not created due to some issue with the server. Please try again.", variant: 'destructive' })
    } finally {
      setLoading(false)
    }
    router.push(`editor/${roomId}`)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]  dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      </div>
      <Card className="border-border">
        <CardHeader className="text-3xl font-bold text-foreground">
          {isNew ? "Create a new Room" : "Join a Room"}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Input placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
            <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            {isNew ? (
              <ComboboxDemo value={language} setValue={setLanguage} />
            ) : null}
          </div>
          <Button type="button" variant="default" className="w-full" onClick={handleJoin}>{isLoading ? <Loader2 className="animate-spin" /> : "Join"}</Button>
        </CardContent>
        <CardFooter>
          <Label className="text-foreground">
            {isNew ? "Already have an Room Id" : "Don't have an Room Id?"}
          </Label>
          <Button variant="link" onClick={() => setIsNew(prev => !prev)}>{!isNew ? "Create One" : "Have an Id"}</Button>
        </CardFooter>
      </Card>
      <div className="fixed bottom-20 right-32">
        <ThemeToggle />
      </div>
    </div>
  );
}
