"use client"

import React, { useState } from 'react'
import { Fraunces } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  Stethoscope, 
  Baby, 
  Brain, 
  Activity,
  ChevronRight,
  ArrowLeft // Import ArrowLeft icon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation" // Import useRouter
import { Button } from '@/components/ui/button'

const fraunces = Fraunces({ subsets: ["latin"] })

// Categories and DOCTOR_DATA logic remains the same...
const CATEGORIES = [
  { id: "all", label: "All", icon: Stethoscope },
  { id: "General", label: "General", icon: Activity },
  { id: "Gynecologist", label: "Gynecology", icon: HeartIcon },
  { id: "Psychiatrist", label: "Mental Health", icon: Brain },
  { id: "Pediatrician", label: "Pediatrics", icon: Baby },
]

function HeartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

const DOCTOR_DATA = Array.from({ length: 50 }).map((_, i) => {
  const types = ["General", "Gynecologist", "Psychiatrist", "Pediatrician", "Dermatologist"];
  const locations = ["Bahadurpally", "Gandi Maisamma", "Suraram", "Jeedimetla", "Pragathi Nagar"];
  return {
    id: i,
    name: `Dr. ${["Anjali", "Suresh", "Kavitha", "Rajesh", "Priya", "Vikram"][i % 6]} ${["Reddy", "Verma", "Rao", "Koppula"][i % 4]}`,
    profession: types[i % types.length],
    location: locations[i % locations.length],
    timeToReach: `${(i % 15) + 5} mins`,
    contact: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
  };
});

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter() // Initialize router

  const filteredDoctors = DOCTOR_DATA.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || doc.profession === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Back Arrow Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-start"
        >
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard/resources')}
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
          </Button>
        </motion.div>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary bg-primary/5">
            Medical Directory
          </Badge>
          <h1 className={`${fraunces.className} text-4xl md:text-5xl font-bold`}>
            Support Near You
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto italic">
            "Medicine is a science of uncertainty and an art of probability." — William Osler
          </p>
        </div>

        {/* Search, Tabs, and Grid continue below... */}
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or area..." 
              className="pl-10 rounded-full border-primary/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap justify-center bg-transparent gap-2 h-auto p-0">
              {CATEGORIES.map((cat) => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="rounded-full border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="h-[600px] mt-8 rounded-3xl border border-primary/5 bg-muted/5 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredDoctors.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      layout
                    >
                      <Card className="group hover:shadow-lg transition-all border-primary/5 bg-card overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Stethoscope className="w-5 h-5 text-amber-500/80 group-hover:text-white transition-colors" />
                        </div>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                              {doc.profession}
                            </Badge>
                          </div>
                          <CardTitle className={`${fraunces.className} pt-4 text-xl`}>
                            {doc.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2 text-rose-400" />
                              {doc.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2 text-rose-400" />
                              {doc.timeToReach} away
                            </div>
                            <div className="flex items-center text-sm font-medium text-foreground">
                              <Phone className="w-4 h-4 mr-2 text-primary" />
                              {doc.contact}
                            </div>
                          </div>
                          <button className="w-full py-2 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-primary border border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all">
                            Book Consultation
                            <ChevronRight className="w-3 h-3 ml-2" />
                          </button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}