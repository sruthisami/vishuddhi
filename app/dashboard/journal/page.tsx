"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, MessageSquareText, Sparkles, Clock, X, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  createJournal,
  getJournals,
  continueJournal,
} from "@/lib/api/journal";

interface Journal {
  _id: string;
  text: string;
  createdAt: string;
  aiInsights?: {
    insight?: string;
  };
}

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Fetch journals
 const fetchJournals = async () => {
  try {
    const data = await getJournals();
    setJournals(data.slice(0, 10));
  } catch (err) {
    console.error("Failed to fetch journals", err);
  }
};

  useEffect(() => {
    fetchJournals();
  }, []);

  // Save new entry
 const handleSaveEntry = async () => {
  if (!newEntryText.trim()) return;

  setIsSaving(true);

  try {
    const res = await createJournal({ text: newEntryText });

    // optimistic entry
    const newJournal: Journal = {
      _id: res.journalId,
      text: newEntryText,
      createdAt: new Date().toISOString(),
      aiInsights: { insight: "" },
    };

    setJournals(prev => [newJournal, ...prev]);
    setExpandedId(newJournal._id);

    setNewEntryText("");
    setIsModalOpen(false);

    // 🔥 silently refresh after AI finishes
    setTimeout(fetchJournals, 2500);

  } catch (err) {
    console.error(err);
  } finally {
    setIsSaving(false);
  }
};

  // Start journal-focused chat
  const handleStartConversation = async (journalId: string) => {
  try {
    const { sessionId } = await continueJournal(journalId);
    router.push(`/therapy/${sessionId}`);
  } catch (err: any) {
    alert(err.message); // insight missing guard
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 space-y-8 min-h-screen">

      {/* HEADER */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{dateString}</h1>
            <p className="text-muted-foreground italic">What's on your mind today?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Activity Card */}
          <div className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
              <Clock className="w-3 h-3" /> Recent Activity
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {journals.length > 0
                  ? "You've logged your thoughts. Ready for an insight?"
                  : "No entries yet today."}
              </p>
            </div>
          </div>

          {/* Add Journal Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-3 min-h-[160px] group"
          >
            <div className="p-3 rounded-full bg-primary/10 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="font-medium text-primary/80">Add Journal Entry</span>
          </button>
        </div>
      </section>

      <hr className="border-border" />


      {/* PAST ENTRIES - FOLDER STYLE */}
<section className="space-y-6">
  <h2 className="text-xl font-semibold flex items-center gap-2">
    <BookOpen className="w-5 h-5 text-muted-foreground" />
    Past Entries
  </h2>

  {journals.map((entry) => (
    <div key={entry._id} className="relative transition-all duration-300 group">
      
      {/* 📂 FOLDER TAB HEADER */}
      <div 
        onClick={() => setExpandedId(expandedId === entry._id ? null : entry._id)}
        className={`relative z-10 cursor-pointer transition-all duration-300 
          ${expandedId === entry._id ? 'mb-[-1px]' : 'mb-0 hover:-translate-y-1'}`}
      >
        {/* The Tab */}
        <div className={`w-24 h-4 rounded-t-lg ml-6 transition-colors duration-300
          ${expandedId === entry._id ? 'bg-[#eec681] dark:bg-[#d4a373]' : 'bg-[#eec681]/60 dark:bg-[#d4a373]/40'}`} 
        />
        
        {/* The Main Folder Bar */}
        <div className={`flex justify-between items-center p-4 rounded-xl rounded-tl-none shadow-sm border transition-colors duration-300
          ${expandedId === entry._id 
            ? 'bg-[#f3d5a2] dark:bg-[#e4b383] border-[#eec681] text-neutral-900' 
            : 'bg-[#f3d5a2]/80 dark:bg-[#e4b383]/20 border-transparent text-foreground'}`}
        >
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-tight">
              {entry.text.substring(0, 15)}
              {entry.text.length > 15 && <span className="opacity-50">...</span>}
            </span>
          </div>
          {expandedId === entry._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* 📄 LINED PAPER CONTENT */}
      <AnimatePresence>
        {expandedId === entry._id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-2 p-6 pt-8 bg-[#fff9f0] dark:bg-neutral-900 border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b-xl shadow-inner relative">
              
              {/* Lined Paper Effect CSS */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                  backgroundSize: '100% 2rem',
                  marginTop: '1.5rem'
                }}
              />

              <p className="relative z-10 text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap leading-[2rem] mb-8 font-medium">
                {entry.text}
              </p>

              {/* AI Insight Box inside the folder */}
              {entry.aiInsights?.insight && (
  <div className="relative z-10 bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-xl p-5 mt-4">
    
    <div className="flex items-center gap-2 text-primary dark:text-[#d4a373] mb-3">
      <Sparkles size={16} />
      <span className="text-xs font-bold uppercase tracking-tight">
        AI Insight
      </span>
    </div>

    <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
      {entry.aiInsights.insight}
    </p>

    <Button
      onClick={() => handleStartConversation(entry._id)}
      variant="outline"
      className="mt-5 w-full md:w-auto gap-2 border-primary/20 hover:bg-primary/10"
    >
      <MessageSquareText size={16} />
      Talk about this
    </Button>
  </div>
)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}
</section>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[101] p-4"
            >
              <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-muted/40 p-5 border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-bold tracking-wide">
                      {newEntryText.substring(0, 15) || "New Journal Entry"}
                      {newEntryText.length > 15 ? "..." : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="hover:rotate-90 transition-transform"
                  >
                    <X size={20} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  <textarea
                    autoFocus
                    placeholder="Write freely. Your privacy is our priority..."
                    value={newEntryText}
                    onChange={(e) => setNewEntryText(e.target.value)}
                    className="w-full h-80 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground resize-none text-lg leading-relaxed"
                  />

                  <div className="mt-6 flex justify-end border-t border-border pt-6">
                    <Button
                      onClick={handleSaveEntry}
                      disabled={!newEntryText.trim() || isSaving}
                      className="rounded-full px-8 bg-primary hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                    >
                      {isSaving
                        ? <Loader2 className="animate-spin" size={18} />
                        : "Save to Journal"}
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}