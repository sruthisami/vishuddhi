"use client"

import React from 'react'
import { Fraunces } from "next/font/google"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Stethoscope, Users } from "lucide-react"
import { Button } from '@/components/ui/button'
// 1. IMPORT useRouter from next/navigation
import { useRouter } from 'next/navigation'

const fraunces = Fraunces({ subsets: ["latin"] })

export default function ResourcesPage() {
  // 2. INITIALIZE the router hook
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Title */}
        <div className="text-center space-y-2">
          <h1 className={`${fraunces.className} text-4xl md:text-5xl font-bold text-foreground`}>
            Resources
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deepen your understanding of the psychological principles and mission behind Vishuddhi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CARD 1: ABOUT VISHUDDHI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col p-0">
              <div className="relative h-52 w-full bg-rose-200/5 flex items-center justify-center overflow-hidden">
                <Users className="w-20 h-20 text-rose-500/20 transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground border-none">
                  Our Mission
                </Badge>
              </div>

              <div className="p-6 pt-4 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">The Project</span>
                </div>
                <h2 className={`${fraunces.className} text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent`}>
                  About Vishuddhi
                </h2>
                <p className="text-lg leading-relaxed text-foreground/80 font-medium">
                  Vishuddhi is an AI-driven mental health companion designed to provide context-aware support.
                </p>
                <p className="text-muted-foreground">
                  We create a sanctuary for self-reflection through personalized AI analysis of your journal entries.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">Empathetic AI</Badge>
                  <Badge variant="secondary">Privacy First</Badge>
                  <Badge variant="secondary">Wellness</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CARD 2: PINK ELEPHANT THEORY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col p-0">
              <div className="relative h-52 w-full bg-[#ffc0cb]/20 flex items-center justify-center overflow-hidden">
                <Brain className="w-16 h-16 text-[#ffc0cb] opacity-50 absolute z-0" />
                <Image 
                  src="/images/pinkele.png" 
                  alt="Pink Elephant Theory"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform group-hover:scale-105 duration-500 z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                <Badge className="absolute bottom-4 left-4 bg-[#ffc0cb] text-black hover:bg-[#ffc0cb]/80 border-none z-30">
                  Theory
                </Badge>
              </div>

              <div className="p-6 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-[#d4a373]">
                  <Brain className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Psychology</span>
                </div>
                <h2 className={`${fraunces.className} text-2xl font-bold text-black`}>
                  Pink Elephant Theory
                </h2>
                <p className="text-muted-foreground leading-relaxed italic border-l-2 border-[#ffc0cb] pl-4 my-4">
                  "Try to pose for yourself this task: not to think of a polar bear, and you will see that the cursed thing will come to mind every minute."
                </p>
                <p className="text-foreground/70 leading-relaxed">
                  The Pink Elephant Theory explains ironic process theory—where deliberate efforts to suppress a thought actually make it more persistent.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* CARD 3: MEDICAL DIRECTORY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full border-border bg-card overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 w-full bg-primary/5 flex items-center justify-center">
                <Stethoscope className="w-12 h-12 text-primary/20" />
                <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground border-none">
                  Directory
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className={`${fraunces.className} text-2xl font-bold`}>
                  Medical Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Access a curated list of 50+ healthcare professionals near VNRVJIET.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl font-bold"
                  // 3. USE router.push for navigation
                  onClick={() => router.push('/dashboard/resources/doctors')}
                >
                  View All Doctors
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
}