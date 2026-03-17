import ThemeToggle from "./ThemeToggle"
import { Button } from "../ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex shrink-0 items-center gap-3">
          <img
            src="scouttrace.png"
            alt="ScoutTrace Logo"
            className="size-16 rounded-md object-cover"
          />
          <h1 className="text-lg font-semibold tracking-tight">ScoutTrace</h1>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Button variant="secondary">Login</Button>
          <Button variant="secondary">Get Started</Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}