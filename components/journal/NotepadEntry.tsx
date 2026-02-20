
"use client";

import React from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
interface Journal {
  _id: string;
  text: string;
  createdAt: string;
  aiInsights?: {
    insight?: string;
  };
}

interface Props {
  journal: Journal;
  isOpen: boolean;
  onToggle: () => void;
}

export default function NotepadEntry({ journal, isOpen, onToggle }: Props) {
  const router = useRouter();
  // Flow 2: Transition from Journal to Guided Conversation
  const handleTalkAboutThis = async () => {
    try {
      const res = await fetch(`/api/journal/${journal._id}/continue`, { method: "POST" });
      const { sessionId } = await res.json();
      router.push(`/therapy/${sessionId}`); // Redirect to therapy mode
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  return (
    <div className="w-full">
      {/* Folder Tab Top */}
      <div className="ml-auto mr-12 w-28 h-4 bg-muted/30 dark:bg-muted/10 rounded-t-xl" />
      
      {/* Entry Header */}
      <div 
        onClick={onToggle}
        className="cursor-pointer relative z-10 w-full bg-muted/30 dark:bg-muted/10 p-5 rounded-xl flex justify-between items-center hover:bg-muted/40 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <span className="text-lg font-bold font-plus-jakarta">{journal.text || "Untitled Entry"}</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="text-xs font-medium uppercase tracking-tighter">
            {new Date(journal.createdAt).toLocaleDateString()}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Notepad with Black-Neutral Gradient */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1 p-8 rounded-xl bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-black border border-muted shadow-inner space-y-6">
              <p className="text-foreground/80 font-fraunces italic text-xl leading-relaxed">
                "{journal.text}"
              </p>
              
              {/* Insight Section & Flow 2 Bridge */}
              <div className="pt-6 border-t border-muted/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">
                  AI Insight: {journal.aiInsights?.insight || "Reflecting on your growth..."}
                </div>
                <button 
                  onClick={handleTalkAboutThis}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <MessageSquare className="w-4 h-4" />
                  Talk about this entry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}