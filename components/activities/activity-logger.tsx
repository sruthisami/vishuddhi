"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activityTypes = [
  { id: "meditation", name: "Meditation" },
  { id: "exercise", name: "Exercise" },
  { id: "walking", name: "Walking" },
  { id: "reading", name: "Reading" },
  { id: "journaling", name: "Journaling" },
  { id: "therapy", name: "Therapy Session" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityLogged: () => void;
}

export function ActivityLogger({ open, onOpenChange, onActivityLogged }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !name) {
      
      return;
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          name,
          duration: duration ? Number(duration) : undefined,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // reset form
      setType("");
      setName("");
      setDuration("");
      setDescription("");

      onActivityLogged();
      onOpenChange(false);

    } catch (err: any) {
      console.error(err);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>Record your wellness activity</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Activity Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Duration (min)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Activity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}