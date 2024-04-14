import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      </div>
      <Card className="border-border">
        <CardHeader className="text-3xl font-bold text-foreground">
          Join a Room
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Input placeholder="Room ID" />
            <Input placeholder="Username" />
          </div>
          <Button type="button" variant="default" className="w-full">Join</Button>
        </CardContent>
        <CardFooter>
          <Label className="text-foreground">
            Donrt have an Room Id?
          </Label>
          <Button variant="link">Create One</Button>
        </CardFooter>
      </Card>
      <div className="fixed bottom-20 right-32">
        <ThemeToggle />
      </div>
    </div>

  );
}
