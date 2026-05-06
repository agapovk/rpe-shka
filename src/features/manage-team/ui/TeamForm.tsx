"use client";

import type { Team } from "@entities/team";
import { db } from "@shared/db";
import { Button, Input } from "@shared/ui";
import type * as React from "react";
import { useState } from "react";

interface TeamFormProps {
  onClose: () => void;
  team?: Team;
}

export function TeamForm({ team, onClose }: TeamFormProps) {
  const [name, setName] = useState(team?.name ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    if (team?.id === undefined) {
      await db.teams.add({ name: trimmed, createdAt: new Date() });
    } else {
      await db.teams.update(team.id, { name: trimmed });
    }
    onClose();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        autoFocus
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
        value={name}
      />
      <Button className="h-12 w-full" type="submit">
        {team ? "Save changes" : "Create team"}
      </Button>
    </form>
  );
}
