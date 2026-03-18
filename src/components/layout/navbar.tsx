'use client'

import * as React from 'react'
import { Link } from '@tanstack/react-router'

import ThemeToggle from './ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '#/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b bg-background/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-background/80',
        scrolled ? 'shadow-md' : 'shadow-none',
      )}
    >
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-2">
        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="scouttrace.png"
            alt="ScoutTrace Logo"
            className="size-12 rounded-md object-cover"
          />
          <span className="text-xl font-bold tracking-tight">ScoutTrace</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <Link to="/login" className={buttonVariants({ variant: 'ghost' })}>
            Login
          </Link>
          <Link to="/signup" className={buttonVariants()}>
            Get Started
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}