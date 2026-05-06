"use client";

import { db } from "@shared/db";
import { Button, Input } from "@shared/ui";
import type * as React from "react";
import { useState } from "react";

interface CreateMicrocycleFormProps {
  onClose: () => void;
  teamId: number;
}

export function CreateMicrocycleForm({
  teamId,
  onClose,
}: CreateMicrocycleFormProps) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    await db.microcycles.add({ name: trimmed, teamId, createdAt: new Date() });
    onClose();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        autoFocus
        onChange={(e) => setName(e.target.value)}
        placeholder="Microcycle name (e.g. vs. Spartak)"
        value={name}
      />
      <Button className="h-12 w-full" type="submit">
        Create microcycle
      </Button>
    </form>
  );
}
