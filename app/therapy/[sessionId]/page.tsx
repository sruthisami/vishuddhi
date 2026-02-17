"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {Send, Bot, User, Loader2, Sparkles} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { div } from "framer-motion/client"

const glowAnimation = {
    initial: { opacity:0.5, scale:1},
    animate: { 
        opacity: [0.5,1,0.5],
        scale: [1,1.05,1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

export default function TherapyPage(){
    const [message, setMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isChatPaused] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
       if(messagesEndRef.current){
        setTimeout(()=>{
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
        }, 100)
        }
    }

    useEffect(() => {
        if(!isTyping){
            scrollToBottom()
        }
    }, [messages, isTyping])

    return (
        <div className = "relative max-w-7xl mx-auto px-4">
            <div className = "flex h-[calc(100vh-4rem)] mt-20 gap-6">
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background rounded-lg border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                    </div>
                    {/* more stuff comingg */}
                </div>
            </div>
        </div>
    )
}