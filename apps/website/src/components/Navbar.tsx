import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b border-border backdrop-blur px-2 py-3 supports-[backdrop-filter]:bg-secondary/70 w-full">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <Menu />
          <Link href="/" className="flex ms-2 md:me-24">
            <span className="self-center text-xl font-semibold text-foreground sm:text-2xl whitespace-nowrap">
              Code Collab
            </span>
          </Link>
        </div>
        <div className="flex space-x-6 items-center ">
          <Button>Run</Button>
          <ThemeToggle />
        </div>
      </div>
    </nav >
  )
}

