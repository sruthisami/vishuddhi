"use client"
import {
  startPeriod,
  logFlowDay,
  endPeriod,
  getHistory,
  getPrediction,
} from "@/lib/api/period";
import { useState, useEffect } from "react"
import { Fraunces } from "next/font/google";
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
  Droplet,
  BookOpen,
  History,
  Flag
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useSession } from "@/lib/contexts/session-context"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator";

const fraunces = Fraunces({ subsets: ["latin"] });

export default function Page() {
  const { isAuthenticated } = useSession()
  const router = useRouter()
  const [auraInsight, setAuraInsight] = useState("Log your cycle...");
  const [isLogging, setIsLogging] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isActivePeriod, setIsActivePeriod] = useState(false);
  const [weekView, setWeekView] = useState<any[]>([]);

  useEffect(() => {
    if (!prediction) return;
    if (!prediction.nextExpectedDate) {
      setAuraInsight("Log more cycles to unlock predictions");
    } else if (prediction.confidence < 50) {
      setAuraInsight("Your cycle is learning — keep logging");
    } else {
      setAuraInsight("Your cycle rhythm is becoming clear");
    }
  }, [prediction]);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  function toLocalDateKey(date: Date | string) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  
  async function loadData() {
    try {
      const hist = await getHistory();
      const last7 = getLast7Days();
      const flowMap = new Map<string, string>();
      
      hist.forEach((p: any) => {
        flowMap.set(toLocalDateKey(p.startDate), p.startFlow || p.days?.[0]?.flow || "medium");
        p.days?.forEach((d: any) => {
          flowMap.set(toLocalDateKey(d.date), d.flow);
        });
      });

      const mapped = last7.map((d: any) => ({
        ...d,
        flow: flowMap.get(d.iso) || null,
        current: d.iso === toLocalDateKey(new Date()),
      }));

      setWeekView(mapped);
      const pred = await getPrediction();
      setHistory(hist);
      setPrediction(pred);
      const active = hist.find((p: any) => !p.endDate);
      setIsActivePeriod(!!active);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = async () => {
    if (!selectedFlow) return;
    try {
      if (!isActivePeriod) {
        await startPeriod(new Date(), selectedFlow);
      } else {
        await logFlowDay(new Date(), selectedFlow);
      }
      setIsSaved(true);
      await loadData();
      setTimeout(() => {
        setIsLogging(false);
        setIsSaved(false);
      }, 1200);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  function getLast7Days() {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push({
        dateObj: d,
        day: d.toLocaleDateString("en-US", { weekday: "short" })[0],
        date: d.getDate(),
        iso: toLocalDateKey(d),
      });
    }
    return days;
  }

  const getOrdinal = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pt-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center space-y-2 mb-4 mt-16">
          <h1 className={`${fraunces.className} text-4xl font-bold tracking-tight text-foreground`}>
            Cycle Tracker
          </h1>
          <p className="text-muted-foreground italic">Sync with your natural rhythm.</p>
        </div>

        {/* 1. Aura Insight */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Aura Insight</span>
            </div>
            <p className="text-sm text-foreground/80 italic">{auraInsight}</p>
          </Card>
        </motion.div>

        {/* 2. Main Tracking Card */}
        <Card className="bg-card border-border p-8 rounded-3xl shadow-sm space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h2 className={`${fraunces.className} text-3xl font-bold`}>Track Today</h2>
              <Badge variant={isActivePeriod ? "default" : "secondary"} className="rounded-full px-4">
                {isActivePeriod ? "Period Active" : "Log your cycle"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full py-6 border-y border-border/50 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Cycle Day</p>
              <p className="text-2xl font-black text-slate-900">1</p>
            </div>
            <div className="border-l border-border/50">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Next Period</p>
              <p className="text-sm font-bold pt-1 text-rose-500 uppercase tracking-tighter">
                {prediction?.nextExpectedDate ? "Predicted" : "Logging Needed"}
              </p>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full rounded-full h-14 border-border hover:bg-muted transition-all text-base"
              onClick={() => setIsLogging(!isLogging)}
            >
              <Droplets className="w-4 h-4 mr-2 text-rose-500" />
              <span className="font-bold">Update Logs</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-300 ${isLogging ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
              {isLogging && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-4 p-6 bg-muted/30 border border-border rounded-2xl space-y-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest text-center">Flow Intensity</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: "spotting", label: "Spot", icon: <Sparkles className="w-4 h-4" /> },
                          { id: "light", label: "Light", icon: <Droplet className="w-4 h-4" /> },
                          { id: "medium", label: "Mid", icon: <Waves className="w-4 h-4" /> },
                          { id: "heavy", label: "Heavy", icon: <Circle className="w-4 h-4 fill-current" /> },
                        ].map((flow) => (
                          <button
                            key={flow.id}
                            onClick={() => setSelectedFlow(flow.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 ${selectedFlow === flow.id ? "border-rose-500 bg-rose-50 text-rose-600 shadow-sm" : "border-border bg-card hover:border-primary/30"}`}
                          >
                            {flow.icon}
                            <span className="text-[10px] font-bold uppercase">{flow.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full h-12 rounded-full font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20" onClick={handleSave} disabled={isSaved || !selectedFlow}>
                      {isSaved ? <Check className="w-5 h-5 animate-in zoom-in" /> : "Save Today's Flow"}
                    </Button>
                    {isActivePeriod && (
                      <Button
                        variant="ghost"
                        className="w-full h-11 rounded-full font-bold text-rose-600 hover:bg-rose-50"
                        onClick={async () => {
                          if (!confirm("End your current period?")) return;
                          try {
                            setIsSaved(true);
                            await endPeriod(new Date());
                            await loadData();
                            setIsLogging(false);
                            setSelectedFlow(null);
                          } catch (err) { console.error(err); } finally { setIsSaved(false); }
                        }}
                      >
                        End Active Cycle
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* 3. Week View */}
        <Card className="p-6 rounded-3xl border-border shadow-sm bg-card">
          <div className="flex items-center gap-2 mb-6 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Week View</h3>
          </div>
          <div className="flex justify-between md:justify-center gap-2 md:gap-6">
            {weekView.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{d.day}</span>
                <div className={`w-10 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border ${d.current ? 'ring-2 ring-rose-500 ring-offset-2 scale-110 shadow-md' : ''} ${!d.flow ? 'bg-muted/30 border-transparent' : d.flow === 'spotting' ? 'bg-pink-100 text-pink-500 border-pink-200' : 'bg-rose-400 text-white border-rose-500'}`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Prediction */}
        <Card className="p-8 rounded-3xl overflow-hidden bg-card border-border shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <Info className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Prediction</h3>
          </div>
          <div className="flex flex-row items-center gap-10">
            <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-100 rounded-[3rem] px-12 py-10 shadow-inner">
              <span className="text-sm font-bold text-rose-400 uppercase tracking-[0.2em] mb-2">Next</span>
              <span className={`${fraunces.className} text-3xl font-black text-rose-600`}>
                {prediction?.nextExpectedDate ? new Date(prediction.nextExpectedDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "Mar 19"}
              </span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="p-5 bg-muted/40 rounded-2xl border border-border/50 min-h-[80px]">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block tracking-wider">Avg Cycle</span>
                <p className="text-lg font-bold text-slate-900">28 days</p>
              </div>
              <div className="p-5 bg-muted/40 rounded-2xl border border-border/50 min-h-[80px]">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block tracking-wider">Avg Duration</span>
                <p className="text-lg font-bold text-slate-900">5 days</p>
              </div>
            </div>
          </div>
        </Card>

{/* 5. Cycle History - Final UI Revamp */}
<div className="space-y-6 pt-10 pb-20 max-w-2xl mx-auto">
  <h2 className={`${fraunces.className} text-xl font-bold flex items-center gap-2 px-4`}>
    <BookOpen className="w-5 h-5 text-muted-foreground" />
    Recent Cycles
  </h2>

  {/* Main Wrapper Card */}
  <Card className="bg-white border-border shadow-sm p-6 md:p-10 rounded-[2.5rem] overflow-hidden">
    <div className="space-y-12">
      {history.length === 0 ? (
        <div className="p-12 text-center border-dashed border-2 rounded-3xl border-border/50">
          <p className="text-sm text-muted-foreground font-medium">No cycles logged yet.</p>
        </div>
      ) : (
        /* Group by Year */
        Object.entries(
          history.reduce((acc: any, p) => {
            const year = new Date(p.startDate).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(p);
            return acc;
          }, {})
        ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
         .map(([year, cycles]: [string, any]) => (
          <div key={year} className="space-y-10">
            
            {/* YEAR BADGE: Soft Round Reddish Component */}
            <div className="flex justify-start">
              <div className="bg-[#fdf2f4] text-[#d6336c] px-6 py-2 rounded-2xl font-black text-xl tracking-tight border border-[#f8d7da]/30">
                {year}
              </div>
            </div>

            <div className="space-y-10">
              {cycles.map((p: any, i: number) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-end justify-between px-2">
                    
                    {/* LEFT: Month Section */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
                        <History className="w-3.5 h-3.5" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.15em]">Month</span>
                      </div>
                      <span className={`${fraunces.className} text-5xl font-black text-[#2d3436] leading-none`}>
                        {new Date(p.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </span>
                    </div>

                    {/* RIGHT: Completion Section */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Completion</span>
                        <Flag className="w-3.5 h-3.5" />
                      </div>
                      <div className={`${fraunces.className} text-3xl font-black text-[#2d3436] flex items-start`}>
                        {p.endDate ? (
                          <>
                            {new Date(p.endDate).getDate()}
                            <span className="text-sm ml-0.5 mt-1 font-bold">
                              {getOrdinal(new Date(p.endDate).getDate())}
                            </span>
                          </>
                        ) : (
                          <span className="text-rose-500 text-lg animate-pulse">Ongoing</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Separator matching screenshot style */}
                  <Separator className="bg-rose-100/30 h-[1px] w-full" />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
</div>
        </div> 
      </div>
  )
}