"use client"

import { useState, useEffect } from "react"
import { 
  Heart, 
  Droplets, 
  Calendar, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Info, 
  Waves, 
  Circle, 
  Droplet 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useSession } from "@/lib/contexts/session-context"
import { useRouter } from "next/navigation"

export default function Page() {
  const { isAuthenticated } = useSession()
  const router = useRouter()

  const [isLogging, setIsLogging] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [auraInsight, setAuraInsight] = useState("Log your cycle to unlock personalized insights 🌸")

  // Mock data for Week at a Glance - easily replaceable with backend props
  const weekData = [
    { day: "S", date: 15, status: "none" },
    { day: "M", date: 16, status: "none" },
    { day: "T", date: 17, status: "none" },
    { day: "W", date: 18, status: "none" },
    { day: "T", date: 19, status: "none" },
    { day: "F", date: 20, status: "period", current: true },
    { day: "S", date: 21, status: "none" },
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const handleSave = async () => {
    // Simulating API call
    setIsSaved(true)
    setAuraInsight("Data saved! Your insights are updating... ✨")

    setTimeout(() => {
      setIsLogging(false)
      setIsSaved(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* 1. Aura Insight */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm p-4 flex gap-3 items-center">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[10px] font-bold uppercase text-primary tracking-tight">Aura Insight</p>
              <p className="text-sm text-muted-foreground">{auraInsight}</p>
            </div>
          </Card>
        </motion.div>

        {/* 2. Main Tracking Card */}
        <Card className="bg-card border-border p-8 space-y-8 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Tracking begins</h2>
              <Badge variant="secondary" className="font-medium">Tracking Active</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full py-4 border-y border-border/50 text-center">
            <div>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Cycle Day</p>
              <p className="text-xl font-bold">1</p>
            </div>
            <div className="border-x border-border/50">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Next Period</p>
              <p className="text-sm font-bold pt-1">Log data</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Ovulation</p>
              <p className="text-sm font-bold text-primary/40 pt-1">N/A</p>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full rounded-full h-12 border-border hover:bg-accent transition-all"
              onClick={() => setIsLogging(!isLogging)}
            >
              <Droplets className="w-4 h-4 mr-2 text-rose-500" />
              <span className="font-semibold">Log Today</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-300 ${isLogging ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
              {isLogging && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-6 bg-accent/30 border border-border rounded-2xl space-y-8">
                    {/* Date Header */}
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-sm font-medium">Friday, Feb 20</span>
                      <Badge variant="outline" className="text-[10px]">DAY 1</Badge>
                    </div>

                    {/* Flow Selection with Icons */}
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">Flow Intensity</p>
                      <div className="flex gap-2">
                        {[
                          { id: "spotting", label: "Spotting", icon: <Sparkles className="w-4 h-4" /> },
                          { id: "light", label: "Light", icon: <Droplet className="w-4 h-4" /> },
                          { id: "medium", label: "Medium", icon: <Waves className="w-4 h-4" /> },
                          { id: "heavy", label: "Heavy", icon: <Circle className="w-4 h-4 fill-current" /> },
                        ].map((flow) => (
                          <button
                            key={flow.id}
                            onClick={() => setSelectedFlow(flow.id)}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 ${
                              selectedFlow === flow.id
                                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600"
                                : "border-border bg-card hover:border-primary/30"
                            }`}
                          >
                            {flow.icon}
                            <span className="text-[10px] font-semibold">{flow.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Symptoms Selection */}
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">Symptoms</p>
                      <div className="flex flex-wrap gap-2">
                        {["Cramps", "Headache", "Mood Swings", "Fatigue", "Bloating", "Acne", "Back Pain"].map((symptom) => (
                          <button
                            key={symptom}
                            onClick={() => toggleSymptom(symptom)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                              selectedSymptoms.includes(symptom)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary/50"
                            }`}
                          >
                            {symptom}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold" onClick={handleSave} disabled={isSaved}>
                      {isSaved ? (
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                          <Check className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        "Save Period Data"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* 3. Week at a Glance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-bold">Week at a Glance</h3>
          </div>
          <div className="flex justify-between">
            {weekData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground/60">{d.day}</span>
                <div className={`w-10 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all border
                  ${d.current ? 'ring-2 ring-rose-500/20 ring-offset-2 ring-offset-background' : ''}
                  ${d.status === 'period' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-muted/30 text-muted-foreground border-transparent'}
                `}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-rose-500" /> Period logged
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" /> Symptoms only
            </div>
          </div>
        </Card>

        {/* 4. Prediction & Confidence */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <h3 className="text-sm font-bold">Prediction</h3>
            </div>
            <span className="text-xs font-bold text-rose-500">0%</span>
          </div>

          <div className="space-y-3">
            <p className="text-xl font-bold">Log more data</p>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "0%" }} 
                className="bg-rose-500 h-full" 
              />
            </div>
            <p className="text-[11px] text-muted-foreground italic">Log more cycles to improve accuracy</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-accent/20 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Avg Cycle</span>
              </div>
              <p className="text-lg font-extrabold">28 days</p>
            </div>
            <div className="p-4 bg-accent/20 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Droplet className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Avg Duration</span>
              </div>
              <p className="text-lg font-extrabold">5 days</p>
            </div>
          </div>
        </Card>

        {/* 5. Cycle History */}
        <Card className="p-8 text-center border-dashed border-2">
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-bold">Cycle History</h3>
          </div>
          <div className="py-6 flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center">
               <Heart className="w-6 h-6 text-rose-500/40" />
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed">
              No cycles logged yet. Tap <span className="text-rose-500 font-bold">Log Today</span> to start tracking your first period.
            </p>
          </div>
        </Card>

      </div>
    </div>
  )
}