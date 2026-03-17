"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"

type ThemeMode = "light" | "dark" | "auto"

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "auto"
  }

  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored
  }

  return "auto"
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode
  const root = document.documentElement

  root.classList.remove("light", "dark")
  root.classList.add(resolved)

  if (mode === "auto") {
    root.removeAttribute("data-theme")
  } else {
    root.setAttribute("data-theme", mode)
  }

  root.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = React.useState<ThemeMode>("auto")

  React.useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  React.useEffect(() => {
    if (mode !== "auto") {
      return
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyThemeMode("auto")

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [mode])

  function setTheme(mode: ThemeMode) {
    setMode(mode)
    applyThemeMode(mode)
    window.localStorage.setItem("theme", mode)
  }

  const label =
    mode === "auto"
      ? "Theme mode: system"
      : `Theme mode: ${mode}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={label}
          title={label}
          className="relative"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("auto")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}