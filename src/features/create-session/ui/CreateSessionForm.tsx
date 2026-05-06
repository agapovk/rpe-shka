"use client";

import { useCategories } from "@entities/category";
import { db } from "@shared/db";
import { cn } from "@shared/lib/utils";
import { Button, Input } from "@shared/ui";
import type * as React from "react";
import { useState } from "react";

interface CreateSessionFormProps {
  microcycleId: number;
  onClose: () => void;
}

function todayISODate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CreateSessionForm({
  microcycleId,
  onClose,
}: CreateSessionFormProps) {
  const categories = useCategories();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [date, setDate] = useState(todayISODate());
  const [duration, setDuration] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const durationNum = Number.parseInt(duration, 10);
    if (!(categoryId && date && durationNum) || durationNum <= 0) {
      return;
    }

    await db.sessions.add({
      microcycleId,
      categoryId,
      date: new Date(date),
      duration: durationNum,
    });
    onClose();
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-primary text-sm">Category</span>
        {categories === undefined || categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No categories. Add some in Settings.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                className={cn(
                  "rounded px-3 py-1.5 font-medium text-sm transition-colors",
                  categoryId === cat.id
                    ? "bg-primary text-background"
                    : "bg-elevated text-secondary hover:bg-subtle"
                )}
                key={cat.id}
                onClick={() => setCategoryId(cat.id!)}
                type="button"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-primary text-sm">Date</span>
        <Input
          onChange={(e) => setDate(e.target.value)}
          type="date"
          value={date}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-primary text-sm">Duration (min)</span>
        <Input
          inputMode="numeric"
          min={1}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 90"
          type="number"
          value={duration}
        />
      </div>

      <Button
        className="h-12 w-full"
        disabled={!(categoryId && date && duration)}
        type="submit"
      >
        Add session
      </Button>
    </form>
  );
}
