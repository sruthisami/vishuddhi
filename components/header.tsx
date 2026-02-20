"use client"
import { Fraunces } from "next/font/google";
const fraunces = Fraunces({ subsets: ["latin"] });

import { useEffect, useState } from "react"
import { AudioWaveform, X, Menu, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SignInButton } from "./auth/sign-in-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "@/lib/contexts/session-context"
import { motion } from "framer-motion";

function Header() {
    const { isAuthenticated, logout } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Navigation configuration
    const navLinks = [
        { href: "/dashboard/period", label: "Period Tracker" },
        { href: "/dashboard/journal", label: "Journal" },
        { href: "/dashboard/resources", label: "Resources" }
    ]

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className={`fixed top-0 z-50 w-full transition-all duration-300 ${
            scrolled ? "bg-background/80 backdrop-blur-md shadow-md border-b border-primary/10" : "bg-background/60 backdrop-blur-sm"
        }`}>
            <header className="relative mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* LEFT: Logo & Brand (Redirects to Dashboard) */}
                    <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <AudioWaveform className="h-7 w-7 text-primary animate-pulse-gentle" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                            Vishuddhi
                        </span>
                    </Link>

                    {/* RIGHT: Main Navigation Components */}
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    className={`${fraunces.className} px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-lg`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* UTILITIES: Toggle & Auth */}
                        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                            <ThemeToggle />
                            {isAuthenticated ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Sign out</span>
                                </Button>
                            ) : (
                                <SignInButton />
                            )}
                            
                            {/* MOBILE MENU TRIGGER */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="md:hidden"
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* MOBILE NAVIGATION DRAWER */}
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-background border-t border-border p-4 space-y-2 shadow-xl"
                    >
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </header>
        </div>
    )
}

export default Header