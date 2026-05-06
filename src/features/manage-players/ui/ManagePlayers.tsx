"use client";

import { type Player, usePlayers } from "@entities/player";
import { db } from "@shared/db";
import { BottomSheet, Button, Input } from "@shared/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

interface PlayerFormProps {
  onClose: () => void;
  player?: Player;
  teamId: number;
}

function PlayerForm({ teamId, player, onClose }: PlayerFormProps) {
  const [name, setName] = useState(player?.name ?? "");
  const [number, setNumber] = useState(player?.number?.toString() ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    const num = number.trim() ? Number.parseInt(number.trim(), 10) : undefined;

    if (player?.id === undefined) {
      await db.players.add({ teamId, name: trimmedName, number: num });
    } else {
      await db.players.update(player.id, { name: trimmedName, number: num });
    }
    onClose();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <Input
          className="w-20 shrink-0"
          inputMode="numeric"
          onChange={(e) => setNumber(e.target.value)}
          placeholder="#"
          type="number"
          value={number}
        />
        <Input
          autoFocus
          className="flex-1"
          onChange={(e) => setName(e.target.value)}
          placeholder="Player name"
          value={name}
        />
      </div>
      <Button className="h-12 w-full" type="submit">
        {player ? "Save changes" : "Add player"}
      </Button>
    </form>
  );
}

interface ManagePlayersProps {
  teamId: number;
}

type Sheet = { mode: "create" } | { mode: "edit"; player: Player };

export function ManagePlayers({ teamId }: ManagePlayersProps) {
  const players = usePlayers(teamId);
  const [sheet, setSheet] = useState<Sheet | null>(null);

  async function handleDelete(player: Player) {
    if (player.id !== undefined) {
      await db.players.delete(player.id);
    }
  }

  return (
    <>
      <div className="flex flex-col">
        {players?.map((player) => (
          <div
            className="flex min-h-11 items-center gap-2 border-border-subtle border-b py-1 last:border-0"
            key={player.id}
          >
            <span className="w-7 text-center font-mono text-muted-foreground text-xs">
              {player.number ?? "—"}
            </span>
            <span className="flex-1 text-primary text-sm">{player.name}</span>
            <Button
              onClick={() => setSheet({ mode: "edit", player })}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Pencil />
            </Button>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(player)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Trash2 />
            </Button>
          </div>
        ))}

        {players?.length === 0 && (
          <p className="py-2 text-muted-foreground text-sm">No players yet</p>
        )}
      </div>

      <Button
        className="mt-1 gap-1.5 text-muted-foreground"
        onClick={() => setSheet({ mode: "create" })}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Plus className="h-4 w-4" />
        Add player
      </Button>

      <BottomSheet
        onClose={() => setSheet(null)}
        open={sheet !== null}
        title={sheet?.mode === "edit" ? "Edit player" : "Add player"}
      >
        {sheet && (
          <PlayerForm
            onClose={() => setSheet(null)}
            player={sheet.mode === "edit" ? sheet.player : undefined}
            teamId={teamId}
          />
        )}
      </BottomSheet>
    </>
  );
}
