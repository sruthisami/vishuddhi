"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Shield,
  MessageCircle,
  Sparkles,
  LineChart,
  Waves,
  Check,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
} from "lucide-react";
import { Playfair_Display, EB_Garamond } from "next/font/google";
import { Fraunces, Alice } from "next/font/google";

const fraunces = Fraunces({ 
  subsets: ["latin"],
  display: 'swap',
  // Fraunces looks best when you utilize its bold weights for headers
  weight: ["700", "900"], 
});

const alice = Alice({ 
  subsets: ["latin"],
  weight: ["400"],
});

const playfair = Playfair_Display({ subsets: ["latin"], style: 'italic' });
const garamond = EB_Garamond({ subsets: ["latin"], style: 'italic' });

import { motion, useScroll, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Ripple } from "@/components/ui/ripple";
import { 
  CloudRain, 
  Leaf, 
  Wind, 
  Sun, 
  Zap 
} from "lucide-react";

export default function Home() {
  // const emotions = [
  //   { value: 0, label: "😔 Down", color: "from-blue-500/50" },
  //   { value: 25, label: "😊 Content", color: "from-green-500/50" },
  //   { value: 50, label: "😌 Peaceful", color: "from-purple-500/50" },
  //   { value: 75, label: "🤗 Happy", color: "from-yellow-500/50" },
  //   { value: 100, label: "✨ Excited", color: "from-pink-500/50" },
  // ];
const emotions = [
    { 
      value: 0, 
      label: "Down", 
      icon: CloudRain, 
      color: "from-blue-500/50" 
    },
    { 
      value: 25, 
      label: "Content", 
      icon: Leaf, 
      color: "from-green-500/50" 
    },
    { 
      value: 50, 
      label: "Peaceful", 
      icon: Wind, 
      color: "from-purple-500/50" 
    },
    { 
      value: 75, 
      label: "Happy", 
      icon: Sun, 
      color: "from-yellow-500/50" 
    },
    { 
      value: 100, 
      label: "Excited", 
      icon: Zap, 
      color: "from-pink-500/50" 
    },
  ];
  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: "Hi, this is Vishuddhi 👋",
      description:
        "Your AI companion for emotional well-being. I'm here to provide a safe, judgment-free space for you to express yourself.",
      icon: Waves,
    },
    {
      title: "Personalized Support 🌱",
      description:
        "I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.",
      icon: Brain,
    },
    {
      title: "Your Privacy Matters 🛡️",
      description:
        "Our conversations are completely private and secure. I follow strict ethical guidelines and respect your boundaries.",
      icon: Shield,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  const features = [
    {
      icon: HeartPulse,
      title: "24/7 Support",
      description: "Always here to listen and support you, any time of day",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description: "Personalized guidance powered by emotional intelligence",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your conversations are always confidential and encrypted",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: MessageSquareHeart,
      title: "Evidence-Based",
      description: "Therapeutic techniques backed by clinical research",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out
            bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0 animate-pulse delay-700" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>
        <Ripple className="opacity-60" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative space-y-4 text-center"
        >
        <div className="flex flex-col items-center sm:items-start max-w-fit mx-auto">
          {/* Main Header - Fraunces */}
          <h1 className={`${fraunces.className} text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-left leading-[0.9]`}>
            <span className="inline-block text-primary">
              Vishuddhi
            </span>
        </h1>
            
            {/* Phonetic Pronunciation - Aligned to Start of Header */}
           {/* Professional Phonetic Tag - Aligned to Start */}
            <div className="mt-1 ml-1">
              <span className={`${garamond.className} text-xl md:text-2xl text-foreground/60 tracking-wide`}>
                / vi-shuddhi /
              </span>
            </div>
          </div>

          {/* Meaning Description */}
          {/* Container for Definition */}
<div className="max-w-[650px] mx-auto mt-8 space-y-2 text-center sm:text-left">
  {/* Part of Speech - Small, uppercase, serif for that academic feel */}
  <p className={`${playfair.className} text-xs uppercase tracking-[0.2em] text-primary/60 font-semibold`}>
    noun.
  </p>

  {/* The Actual Definition */}
  <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-plus-jakarta">
    The state of <span className="text-foreground font-medium">ultimate purity</span> and clarity. 
    A sanctuary where the inner voice is heard and emotional blocks are cleared, 
    restoring the balance needed to navigate life with a centered mind.
  </p>
  
  {/* Optional: "Example" style often seen in dictionaries */}
  <p className="text-sm italic text-muted-foreground/70 pt-2 border-t border-primary/10">
    "In the silence of Vishuddhi, she finally found the clarity she had been seeking."
  </p>
</div>

          <motion.div
            className="w-full max-w-[600px] mx-auto space-y-6 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
          <div className="flex justify-between items-center px-2">
            {emotions.map((em) => (
              <div
                key={em.value}
                className={`flex flex-col items-center transition-all duration-500 ease-out cursor-pointer hover:scale-105 ${
                  Math.abs(emotion - em.value) < 15
                    ? "opacity-100 scale-110 transform-gpu"
                    : "opacity-50 scale-100"
                }`}
                onClick={() => setEmotion(em.value)}
              >
                <div className="p-2 rounded-full bg-primary/5 mb-1">
                  <em.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  {em.label}
                </div>
              </div>
            ))}
</div>

            <div className="relative px-2">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-500`}
              />
              <Slider
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0])}
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button
            size="lg"
            onClick={() => setShowDialog(true)}
            className="relative group h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-300"
          >
            <span className="relative z-10 font-medium flex items-center gap-2">
              Begin Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
          </motion.div>
        </motion.div>

        
          {/* <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
              <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
            </div>
          </motion.div> */}
      </section>

      {/* Feature section and Dialog remain unchanged */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-4 text-white ">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              How Vishuddhi Helps You
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg">
              Experience a new kind of emotional support, powered by empathetic
              AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-[200px] bg-card/30 dark:bg-card/80 backdrop-blur-sm">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 dark:group-hover:opacity-30`}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                        <feature.icon className="w-5 h-5 text-primary dark:text-primary/90" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg">
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {welcomeSteps[currentStep] && (
                  <div>
                    {React.createElement(welcomeSteps[currentStep].icon, {
                      className: "w-8 h-8 text-primary",
                    })}
                  </div>
                )}
              </div>
              <DialogTitle className="text-2xl text-center">
                {welcomeSteps[currentStep]?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed">
                {welcomeSteps[currentStep]?.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "bg-primary w-4" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                }
              }}
              className="relative group px-6"
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <>
                    Let's Begin
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}