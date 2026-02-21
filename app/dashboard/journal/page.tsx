"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, MessageSquareText, Sparkles, X, Loader2, BookOpen } from 'lucide-react';
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

  const handleSaveEntry = async () => {
    if (!newEntryText.trim()) return;
    setIsSaving(true);
    try {
      const res = await createJournal({ text: newEntryText });
      const newJournal: Journal = {
        _id: res.journalId,
        text: newEntryText,
        createdAt: new Date().toISOString(),
        aiInsights: { insight: "" },
      };
      setJournals(prev => [newJournal, ...prev]);
      setNewEntryText("");
      setIsModalOpen(false);
      setTimeout(fetchJournals, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartConversation = async (journalId: string) => {
    try {
      const { sessionId } = await continueJournal(journalId);
      router.push(`/therapy/${sessionId}`);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 space-y-12 min-h-screen">
      {/* HEADER */}
      <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{dateString}</h1>
          <p className="text-muted-foreground italic">What's on your mind today, Vaishnavi?</p>
        </div>

        {/* Full-width Add Journal Section */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full p-8 rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-4 group shadow-sm"
        >
          <div className="p-4 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <span className="text-lg font-semibold text-primary/80">Capture a Thought</span>
        </button>
      </section>

      <hr className="border-border opacity-50" />

      {/* PAST ENTRIES - 2 PER ROW GRID */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary/60" />
          Entries
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {journals.map((entry) => (
            <div key={entry._id} className="relative flex flex-col">
              
              {/* 📂 TOP RIGHT NOTEPAD TAB */}
              <div 
                onClick={() => setExpandedId(expandedId === entry._id ? null : entry._id)}
                className="absolute -top-4 right-6 z-20 cursor-pointer group"
              >
                <div className={`w-20 h-5 rounded-t-xl transition-all duration-300 shadow-sm
                  ${expandedId === entry._id ? 'bg-[#eec681]' : 'bg-[#eec681]/60 group-hover:bg-[#d4a373]'}`} 
                />
              </div>

              {/* FOLDER COVER */}
              <div 
                onClick={() => setExpandedId(expandedId === entry._id ? null : entry._id)}
                className={`relative z-10 cursor-pointer p-6 rounded-2xl rounded-tr-none border transition-all duration-300 shadow-sm flex justify-between items-center
                  ${expandedId === entry._id 
                    ? 'bg-[#f3d5a2] border-[#eec681] text-neutral-900' 
                    : 'bg-[#f3d5a2]/80 border-transparent text-foreground hover:shadow-md hover:-translate-y-1'}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-lg truncate max-w-[180px]">
                    {entry.text.substring(0, 15)}...
                  </span>
                </div>
                {expandedId === entry._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {/* 📄 EXPANDABLE NOTEPAD CONTENT */}
              <AnimatePresence>
                {expandedId === entry._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-1 p-8 bg-[#fffcf8] border-x border-b border-neutral-200 rounded-b-[2rem] shadow-inner relative min-h-[300px] flex flex-col">
                      {/* Lined Paper Effect */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                          backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
                          backgroundSize: '100% 2.5rem',
                          marginTop: '3.5rem'
                        }}
                      />

                      <p className="relative z-10 text-neutral-800 whitespace-pre-wrap leading-[2.5rem] mb-8 font-medium italic">
                        "{entry.text}"
                      </p>

                      {/* AI Insight Box */}
                      {entry.aiInsights?.insight && (
                        <div className="mt-auto relative z-10 bg-white/80 backdrop-blur-sm border border-black/5 rounded-3xl p-6 shadow-sm">
                          <div className="flex items-center gap-2 text-primary mb-3">
                            <Sparkles size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">AI Insight</span>
                          </div>
                          <p className="text-sm leading-relaxed text-neutral-700 italic mb-4">
                            {entry.aiInsights.insight}
                          </p>
                          <Button
                            onClick={() => handleStartConversation(entry._id)}
                            variant="outline"
                            className="w-full gap-2 rounded-xl border-primary/20 hover:bg-primary/5"
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
        </div>
      </section>

      {/* NEW ENTRY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101] p-6">
              <div className="bg-white border border-border rounded-[3rem] shadow-2xl overflow-hidden p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h2 className="text-xl font-bold">New Reflection</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20} /></button>
                </div>
                <textarea
                  autoFocus
                  placeholder="What's unfolding in your world today?"
                  value={newEntryText}
                  onChange={(e) => setNewEntryText(e.target.value)}
                  className="w-full h-80 bg-transparent border-none outline-none focus:ring-0 text-xl leading-relaxed placeholder:text-muted-foreground italic"
                />
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveEntry} disabled={!newEntryText.trim() || isSaving} className="rounded-2xl px-10 py-6 bg-primary text-white font-bold shadow-xl shadow-primary/20">
                    {isSaving ? <Loader2 className="animate-spin" /> : "Save to Archive"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}