"use client"
import {
  startPeriod,
  logFlowDay,
  endPeriod,
  getHistory,
  getPrediction,
} from "@/lib/api/period";
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
  const [auraInsight, setAuraInsight] = useState("Log your cycle...");
  const [isLogging, setIsLogging] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [prediction, setPrediction] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isActivePeriod, setIsActivePeriod] = useState(false);
  useEffect(() => {
    if (!prediction) return;

    if (!prediction.nextExpectedDate) {
      setAuraInsight("Log more cycles to unlock predictions ");
    } else if (prediction.confidence < 50) {
      setAuraInsight("Your cycle is learning — keep logging ");
    } else {
      setAuraInsight("Your cycle rhythm is becoming clear ");
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
  // Add start date
flowMap.set(
  toLocalDateKey(p.startDate),
  p.startFlow || p.days?.[0]?.flow || "medium"
);
  // Add logged days
  p.days?.forEach((d: any) => {
flowMap.set(toLocalDateKey(d.date), d.flow);  });
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
const [weekView, setWeekView] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSave = async () => {
    if (!selectedFlow) return;

    try {
      if (!isActivePeriod) {
        // Start new period
        await startPeriod(new Date(), selectedFlow);
      } else {
        // Log additional day
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
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">


        {/* 2. Main Tracking Card */}
        <Card className="bg-card border-border p-8 mt-16 space-y-8 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20  bg-rose-500/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Track Your Cycle</h2>
              <Badge variant={isActivePeriod ? "default" : "secondary"}>
  {isActivePeriod ? "In Period" : "Tracking"}
</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full py-4 border-y border-border/50 text-center">
            <div>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Cycle Day</p>
              <p className="text-xl font-bold text-slate-900">1</p>
            </div>
            <div className="border-x border-border/50">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">Next Period</p>
              <p className="text-sm font-bold pt-1">Log data</p>
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
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2 ${selectedFlow === flow.id
                              ? "border-rose-500 bg-rose-50 text-rose-600"
                              : "border-border bg-card hover:border-primary/30"
                              }`}
                          >
                            {flow.icon}
                            <span className="text-[10px] font-semibold">{flow.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold bg-slate-900" onClick={handleSave} disabled={isSaved}>
                      {isSaved ? <Check className="w-5 h-5" /> : "Save Period Data"}
                    </Button>
                    {isActivePeriod && (
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={async () => {
                          if (!confirm("End your current period?")) return;

                          try {
                            setIsSaved(true);
                            await endPeriod(new Date());
                            await loadData();

                            setIsLogging(false);
                            setSelectedFlow(null);
                          } catch (err) {
                            console.error("End period failed", err);
                          } finally {
                            setIsSaved(false);
                          }
                        }}
                      >
                        End Period
                      </Button>
                    )}
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
  {weekView.map((d, i) => (
    <div key={i} className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold text-muted-foreground/60">
        {d.day}
      </span>

      <div
        className={`w-10 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all border
        ${d.current ? 'ring-2 ring-rose-500/20 ring-offset-2 ring-offset-background' : ''}
        ${
          !d.flow
            ? 'bg-muted/30 text-muted-foreground border-transparent'
            : d.flow === 'spotting'
            ? 'bg-pink-100 text-pink-500 border-pink-200'
            : d.flow === 'light'
            ? 'bg-rose-100 text-rose-500 border-rose-200'
            : d.flow === 'medium'
            ? 'bg-rose-400 text-white border-rose-500'
            : 'bg-rose-600 text-white border-rose-700'
        }`}
      >
        {d.date}
      </div>
    </div>
  ))}
</div>
        </Card>

        {/* 4. Prediction & Confidence - NO SLIDER, DATE ON LEFT */}
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <h3 className="text-sm font-bold tracking-tight">Next Period Prediction</h3>
            </div>
           
          </div>

          <div className="flex gap-6 items-center">
            {/* Pink Date Display on Left */}
            <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-100 rounded-2xl w-24 h-24 shrink-0">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Next</span>
              <span className="text-2xl font-black text-rose-600">
                {prediction?.nextExpectedDate
                  ? new Date(prediction.nextExpectedDate).toLocaleDateString("en-US", {
  day: "numeric",
  month: "short",
})
                  : "--"}
              </span>
              
            </div>

            <div className="flex-1 space-y-2">

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Avg Cycle</span>
                  <p className="text-sm font-bold">28 days</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Avg Duration</span>
                  <p className="text-sm font-bold">5 days</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 1. Aura Insight - Adjusted Margin Top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 md:mt-4"
        >
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm p-4 flex gap-3 items-center">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[10px] font-bold uppercase text-primary tracking-tight">Aura Insight</p>
              <p className="text-sm text-muted-foreground">{auraInsight}</p>
            </div>
          </Card>
        </motion.div>

        {/* 5. Cycle History */}
        <Card className="p-8 text-center border-dashed border-2">
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-bold">Cycle History</h3>
          </div>
          <div className="py-6 flex flex-col items-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-200" />
            </div>
            <div className="text-sm text-muted-foreground max-w-[250px] leading-relaxed">
              {history.length === 0 ? (
                <span>No cycles logged yet. Tap Log Today to begin.</span>
              ) : (
                history.slice(0, 3).map((p, i) => (
                  <div key={i}>
                    {new Date(p.startDate).toDateString()} →{" "}
                    {p.endDate ? new Date(p.endDate).toDateString() : "Active"}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}