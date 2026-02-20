"use client"

import { useEffect, useState } from "react"
import { AudioWaveform, X, Menu, MessageCircle, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SignInButton } from "./auth/sign-in-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "@/lib/contexts/session-context"

function Header() {
    const { isAuthenticated,logout, user } = useSession()
    const navItems = [{ href: "/features", label: "Features" }, { href: "/about", label: "Vishuddhi" }]
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div
            className={`fixed top-0 z-50 w-full transition-all duration-300
      ${scrolled
                    ? "bg-background/80 backdrop-blur-md shadow-md border-b border-primary/10"
                    : "bg-background/60 backdrop-blur-sm"
                }`}
        >
            <header className="relative  mx-auto px-4 ">
                <div className="flex h-16 items-center justify-between" >
                    <Link href="/" className="flex items-center gap-2 space-x-2 transition-opacity hover:opacity-80">
                        <AudioWaveform className="h-7 w-7 text-primary animate-pulse-gentle" />
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">Vishuddhi</span>
                        </div>
                    </Link>
                    <Link href="/dashboard/period">
  <Button variant="ghost">Period Tracker</Button>
</Link>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center space-x-1" >
                            {navItems.map((item) => {
                                return (<Link key={item.href} href={item.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">{item.label}<span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span></Link>)
                            })}
                        </nav>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    className="hidden md:flex gap-2 bg-primary/90 hover:bg-primary"
                  >
                    <Link href="/dashboard">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Start Chat
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <SignInButton />
              )}

                            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">{isMenuOpen ? (<X className="h-5 w-5" />) : (<Menu className="h-5 w-5" />)}</Button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-background/80 backdrop-blur-md border-t border-primary/10">
                        <nav className="flex flex-col p-4 space-y-2">
                            {navItems.map((item) => {
                                return (<Link key={item.href} href={item.href} className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsMenuOpen(false)}>{item.label}</Link>)
                            })}
                        </nav>
                    </div>
                )}
            </header>

        </div>
    )
}

export default Header
