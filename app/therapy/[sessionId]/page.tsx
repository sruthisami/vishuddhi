"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { useParams } from "next/navigation"
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
} from "@/lib/api/chat"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export default function TherapyPage() {
  const params = useParams()
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [sessionId, setSessionId] = useState<string | null>(params.sessionId as string);

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const newSessionId = await createChatSession()
      const newSession: ChatSession = {
        sessionId: newSessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setSessions((prev) => [newSession, ...prev]);
      setSessionId(newSessionId);
      setMessages([]);
      window.history.pushState({}, "", `/therapy/${newSessionId}`)
    } catch (error) {
      console.error("Failed to create new session:", error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        if (!sessionId || sessionId === "new") {
          const newId = await createChatSession();
          setSessionId(newId);
          window.history.pushState({}, "", `/therapy/${newId}`);
        } else {
          const history = await getChatHistory(sessionId);
          setMessages(Array.isArray(history) ? history.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })) : []);
        }
      } catch (error) {
        setMessages([{ role: "assistant", content: "Trouble loading session.", timestamp: new Date() }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [sessionId]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllChatSessions()
        setSessions(allSessions)
      } catch (error) { console.error(error); }
    }
    loadSessions()
  }, [messages])

  useEffect(() => { setMounted(true) }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping || !sessionId) return;
    const current = message.trim();
    setMessage("");
    setIsTyping(true);
    try {
      setMessages(prev => [...prev, { role: "user", content: current, timestamp: new Date() }]);
      const response = await sendChatMessage(sessionId, current);
      const aiResponse = typeof response === "string" ? JSON.parse(response) : response;
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse.response || "I'm here for you.", timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
    } finally { setIsTyping(false); }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 h-screen flex flex-col overflow-hidden">
      {/* Fixed height container to force internal scrolling */}
      <div className="flex h-[calc(100vh-7rem)] mt-24 mb-4 gap-6 overflow-hidden">

        {/* 1. SCROLLABLE SIDEBAR */}
        <div className="w-80 flex flex-col border rounded-3xl bg-muted/10 overflow-hidden shrink-0">
          <div className="p-5 border-b flex items-center justify-between bg-card/50">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">History</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSession}
              className="flex items-center gap-2 hover:bg-primary/5 px-2 py-1 h-auto"
            >
              <span className="text-[10px] font-bold uppercase text-muted-foreground/50">New Session</span>
              <Plus className="w-3.5 h-3.5 text-muted-foreground/40" />
            </Button>
          </div>

          {/* This is the scroll area for chat sessions */}
          <ScrollArea className="flex-1 w-full h-full">
            <div className="p-3 space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.sessionId}
                  onClick={() => setSessionId(session.sessionId)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl transition-all border",
                    session.sessionId === sessionId
                      ? "bg-white dark:bg-neutral-900 border-border shadow-sm ring-1 ring-primary/10"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare className={cn("w-3.5 h-3.5", session.sessionId === sessionId ? "text-primary" : "text-muted-foreground/30")} />
                    <span className={cn("text-xs font-bold truncate", session.sessionId === sessionId ? "text-foreground" : "")}>
                      {session.messages[0]?.content.slice(0, 22) || "New Discussion"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] opacity-60 font-semibold">
                    <span>{session.messages.length} msgs</span>
                    <span>{session.updatedAt ? formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true }) : "Recent"}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 2. CHATBOT AREA */}
        <div className="flex-1 flex flex-col border rounded-[2.5rem] bg-card overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
               <Bot className="w-5 h-5 text-primary" />
             </div>
             <div>
               <h3 className="text-sm font-bold">Vishuddhi - AI Therapist</h3>
               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Live Session</p>
             </div>
          </div>

          {/* Independent Chat ScrollArea */}
          <ScrollArea className="flex-1 h-full">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 min-h-[400px]">
                <div className="relative text-center">
                  <motion.div className="absolute inset-0 bg-primary/10 blur-3xl" animate="animate" variants={glowAnimation as any} />
                  <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">How may I assist you today?</h4>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-4 max-w-3xl", msg.role === "assistant" ? "" : "ml-auto flex-row-reverse")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === "assistant" ? "bg-primary/10 text-primary border border-primary/20" : "bg-neutral-100 text-neutral-600")}>
                      {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={cn("p-4 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === "assistant" ? "bg-muted/30 border-border border" : "bg-primary text-white")}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse"><Loader2 size={14} className="animate-spin text-primary" /></div>
                    <div className="p-4 rounded-2xl bg-muted/30 italic text-xs text-muted-foreground tracking-wide">Vishuddhi is reflecting...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Footer */}
          <div className="p-6 border-t bg-muted/5">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto items-end">
               <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 bg-white dark:bg-neutral-900 border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none max-h-32 min-h-[56px] transition-all"
                rows={1}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}}
               />
               <Button type="submit" size="icon" className="rounded-xl h-14 w-14 shadow-lg shadow-primary/20" disabled={!message.trim() || isTyping}>
                 <Send className="w-5 h-5" />
               </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}