"use-client"
import {SessionProvider as NextauthSessionProvider} from 'next-auth/react' 
import {SessionProvider as CustomSessionProvider} from '@/lib/contexts/session-context'
import { ThemeProvider } from 'next-themes'
import React from 'react'

function Providers({ children }: { children: React.ReactNode }) {
  return ( 
    <NextauthSessionProvider>
      <CustomSessionProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
    </CustomSessionProvider>
    </NextauthSessionProvider>
  )
}

export default Providers