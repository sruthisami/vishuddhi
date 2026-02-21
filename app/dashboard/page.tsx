"use client"

import { Container } from "@/components/ui/container"
import { CardTitle } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Fraunces } from "next/font/google"
import { 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Heart, 
  BrainCircuit, 
  Activity,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AnxietyGames } from "@/components/games/anxiety-games"
import { MoodForm } from "@/components/mood/mood-form"
import { ActivityLogger } from "@/components/activities/activity-logger"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/contexts/session-context"
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts'

const fraunces = Fraunces({ subsets: ["latin"] })

// Mock Data for Stress Trends
const MOCK_WEEKLY_DATA: Record<string, any[]> = {
  "Feb 15 - Feb 21": [
    { day: "Sun", level: 40 }, { day: "Mon", level: 65 }, { day: "Tue", level: 55 },
    { day: "Wed", level: 80 }, { day: "Thu", level: 60 }, { day: "Fri", level: 45 }, { day: "Sat", level: 30 }
  ],
  "Feb 08 - Feb 14": [
    { day: "Sun", level: 30 }, { day: "Mon", level: 50 }, { day: "Tue", level: 70 },
    { day: "Wed", level: 60 }, { day: "Thu", level: 55 }, { day: "Fri", level: 75 }, { day: "Sat", level: 40 }
  ]
};

const activityData = [
    { name: 'Journaling', value: 30, color: '#8b5cf6' },
    { name: 'Meditation', value: 20, color: '#ec4899' },
    { name: 'Therapy', value: 45, color: '#3b82f6' },
    { name: 'Exercise', value: 60, color: '#10b981' },
];

export default function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showMoodModal, setShowMoodModal] = useState(false)
    const [isSavingMood, setIsSavingMood] = useState(false)
    const [showActivityLogger, setShowActivityLogger] = useState(false)
    
    // Week Navigation State
    const weekKeys = Object.keys(MOCK_WEEKLY_DATA);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const currentWeekData = useMemo(() => MOCK_WEEKLY_DATA[weekKeys[currentWeekIndex]], [currentWeekIndex]);

    const router = useRouter()
    const { user } = useSession()

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const handleStartTherapy = () => router.push("/therapy/new")
    const handleMoodSubmit = async () => {
        setIsSavingMood(true)
        try { setShowMoodModal(false) } catch (error) { console.error(error) } finally { setIsSavingMood(false) }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <Container className="pt-20 pb-8 space-y-12">
                
                {/* Header & Quick Actions (Keep existing logic) */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-2">
                    <h1 className={`${fraunces.className} text-4xl font-bold text-slate-900`}>Welcome back, {user?.name}</h1>
                    <p className="text-muted-foreground font-medium italic">{currentTime.toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric" })}</p>
                </motion.div>

                {/* Quick Actions Card */}
                <div className="max-w-6xl">
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm border border-white/40">
                        <div className="flex flex-col md:flex-row justify-between items-stretch gap-16">
                            <div className="flex-1">
                                <Button className="w-full h-full min-h-[140px] justify-between items-center px-10 py-6 bg-slate-900 hover:bg-slate-800 transition-all rounded-[2rem] group relative overflow-hidden" onClick={handleStartTherapy}>
                                    <div className="flex items-center gap-6 text-left relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white mb-1">Start Therapy</div>
                                            <div className="text-white/50 text-xs font-medium max-w-[180px]">New context-aware AI session</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-white opacity-40 group-hover:translate-x-1 transition-transform relative z-10 right-4" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-72 md:ml-auto">
                                <Button variant="outline" className="h-[68px] flex items-center justify-start gap-3 p-4 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all border-white/60 bg-white/20" onClick={() => setShowMoodModal(true)}>
                                    <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0"><Heart className="w-4 h-4 text-rose-500" /></div>
                                    <div className="text-left"><div className="font-bold text-sm text-slate-800">Track Mood</div><div className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Reflection</div></div>
                                </Button>
                                <Button variant="outline" className="h-[68px] flex items-center justify-start gap-3 p-4 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all border-white/60 bg-white/20" onClick={() => setShowActivityLogger(true)}>
                                    <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><BrainCircuit className="w-4 h-4 text-blue-500" /></div>
                                    <div className="text-left"><div className="font-bold text-sm text-slate-800">AI Check-in</div><div className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Behavioral Audit</div></div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Relief & Pie Chart Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-sm border border-white/40 h-full flex flex-col justify-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.15em]"><Sparkles className="w-3.5 h-3.5" />Relief Tools</div>
                                <div className="w-full"><AnxietyGames /></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-sm border border-white/40 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-8"><Activity className="w-4 h-4 text-primary" /><CardTitle className={`${fraunces.className} text-xl text-slate-800`}>Daily Distribution</CardTitle></div>
                            <div className="flex-1 w-full min-h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie data={activityData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                                            {activityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none cursor-pointer" />))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                                        <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEW: PREDICT STRESS TREND SECTION (Below Anxiety Relief) */}
                <div className="grid grid-cols-1 gap-10 pt-4">
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 shadow-sm border border-white/40">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-rose-500" />
                                    <h2 className={`${fraunces.className} text-2xl font-bold text-slate-800`}>Predictive Stress Trend</h2>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium italic">Contextual analysis of your behavioral audit data</p>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-white/60">
                                <Button 
                                    variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 h-10 w-10"
                                    onClick={() => setCurrentWeekIndex(prev => Math.min(prev + 1, weekKeys.length - 1))}
                                    disabled={currentWeekIndex === weekKeys.length - 1}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 min-w-[140px] text-center">
                                    {weekKeys[currentWeekIndex]}
                                </span>
                                <Button 
                                    variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 h-10 w-10"
                                    onClick={() => setCurrentWeekIndex(prev => Math.max(prev - 1, 0))}
                                    disabled={currentWeekIndex === 0}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={currentWeekData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis 
                                        dataKey="day" axisLine={false} tickLine={false} 
                                        tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} 
                                    />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip 
                                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                                    />
                                    <Line 
                                        type="monotone" dataKey="level" stroke="url(#lineGradient)" 
                                        strokeWidth={4} dot={{ r: 6, fill: '#fff', stroke: '#ec4899', strokeWidth: 2 }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Modals remain the same */}
            <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                    <DialogHeader><DialogTitle className={fraunces.className}>How are you feeling?</DialogTitle></DialogHeader>
                    <MoodForm onSubmit={handleMoodSubmit} isLoading={isSavingMood} />
                </DialogContent>
            </Dialog>
            <ActivityLogger open={showActivityLogger} onOpenChange={setShowActivityLogger} onActivityLogged={() => {}} />
        </div>
    )
}