import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="border-b border-border dark:border-darkHover backdrop-blur px-2 py-3 dark:supports-[backdrop-filter]:bg-dark/70 supports-[backdrop-filter]:bg-secondary/20 w-screen">
      <div className="mx-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="self-center text-2xl font-semibold text-foreground sm:text-3xl whitespace-nowrap">
            Code Collab
          </Link>
        </div>
        <div className="flex space-x-6 items-center ">
          <ThemeToggle />
        </div>
      </div>
    </nav >
  )
}

