"use client";

import React, { useState, useEffect } from "react";
  interface Journal {
  _id: string;
  text: string;
  createdAt: string;
  aiInsights?: {
    insight?: string;
  };
}

import { Plus, Waves } from "lucide-react";
import { format } from "date-fns";
import NotepadEntry from "@/components/journal/NotepadEntry";

export default function JournalPage() {
const [journals, setJournals] = useState<Journal[]>([]);
const [expandedId, setExpandedId] = useState<string | null>(null);

  // Flow 1: Fetching journals from backend
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch("/api/journal"); // GET /journal
        const data = await res.json();
        setJournals(data);
      } catch (err) {
        console.error("Failed to load journals", err);
      }
    };
    fetchJournals();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 space-y-12">
      <header className="space-y-1">
        <h1 className="text-4xl font-ancizar font-bold">Today</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">
          {format(new Date(), "EEEE, MMMM do")}
        </p>
      </header>

      {/* Today's Entry Horizontal Scroll */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {/* Placeholder for Entry with Image */}
        <div className="relative min-w-[320px] h-[320px] rounded-3xl overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1517842645767-c639042777db" 
            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            alt="Journal background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <p className="text-white/60 text-xs font-bold mb-1">12:14 • Today</p>
            <h3 className="text-white text-xl font-bold font-ancizar">First day at work</h3>
          </div>
        </div>

        {/* Add Entry Card */}
        <button className="min-w-[320px] h-[320px] rounded-3xl border-2 border-dashed border-muted bg-secondary/5 hover:bg-secondary/10 flex flex-col items-center justify-center transition-all group">
          <Plus className="w-12 h-12 text-muted-foreground group-hover:scale-110 transition-transform" />
          <span className="text-muted-foreground font-bold mt-2 font-ancizar">New Reflection</span>
        </button>
      </div>

      {/* Recent Entries Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-muted pb-4">
          <h2 className="text-2xl font-ancizar font-bold">Recent Entries</h2>
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Last 10 Days</span>
        </div>

        <div className="space-y-4">
          {journals.length > 0 ? (
             journals.slice(0, 10).map((journal) => (
               <NotepadEntry 
                 key={journal._id}
                 journal={journal}
                 isOpen={expandedId === journal._id}
                 onToggle={() => setExpandedId(expandedId === journal._id ? null : journal._id)}
               />
             ))
          ) : (
            <p className="text-center text-muted-foreground font-ancizar italic py-10">Your journey begins with your first word.</p>
          )}
        </div>
      </section>
    </div>
  );
}