import ThemeToggle from "../ThemeToggle"
export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b bg-background backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    
                </div>
                <h1 className="text-lg font-semibold">ScoutTrace</h1>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
            </div>

        </nav>
    )
}