"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Flower2, Wind, TreePine, Waves, Music2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const games = [
  {
    id: "breathing",
    title: "Breathing Patterns",
    description: "Follow calming breathing exercises with visual guidance",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    duration: "5 mins",
  },
  {
    id: "garden",
    title: "Zen Garden",
    description: "Create and maintain your digital peaceful space",
    icon: Flower2,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    duration: "10 mins",
  },
  {
    id: "forest",
    title: "Mindful Forest",
    description: "Take a peaceful walk through a virtual forest",
    icon: TreePine,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    duration: "15 mins",
  },
  {
    id: "waves",
    title: "Ocean Waves",
    description: "Match your breath with gentle ocean waves",
    icon: Waves,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    duration: "8 mins",
  },
];

interface AnxietyGamesProps {
  onGamePlayed?: (gameName: string, description: string) => Promise<void>;
}
