"use client"

import { SessionProvider } from "@/lib/contexts/session-context"
import { ThemeProvider } from "next-themes"
import React from "react"

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}

export default Providers
