"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200 dark:border-gray-700"
      aria-label="Theme Toggle"
    >
      <div className="relative w-6 h-6">
        <Sun className="absolute h-6 w-6 text-yellow-500 transition-all duration-300 rotate-0 scale-100 dark:rotate-90 dark:scale-0" />
        <Moon className="absolute h-6 w-6 text-blue-500 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  )
} 