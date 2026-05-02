"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRosterStore } from "@/features/roster/roster.store";
import { cn } from "@/lib/utils";

interface EditState {
  id: number;
  name: string;
  num: string;
}

export default function RosterSection() {
  const { players, addPlayer, updatePlayer, removePlayer } = useRosterStore();
  const [editing, setEditing] = useState<EditState | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");

  function startEdit(id: number, name: string, num: number) {
    setEditing({ id, name, num: String(num) });
  }

  function commitEdit() {
    if (!editing) {
      return;
    }
    const num = Number.parseInt(editing.num, 10);
    if (editing.name.trim() && !Number.isNaN(num)) {
      updatePlayer(editing.id, { name: editing.name.trim(), num });
    }
    setEditing(null);
  }

  function commitAdd() {
    const num = Number.parseInt(newNum, 10);
    if (newName.trim() && !Number.isNaN(num)) {
      addPlayer(newName.trim(), num);
    }
    setNewName("");
    setNewNum("");
    setAdding(false);
  }

  const sorted = [...players].sort((a, b) => a.num - b.num);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
          ROSTER · {players.length}
        </span>
        <button
          className="flex items-center gap-1 py-1 font-mono text-[11px] text-accent uppercase tracking-widest underline-offset-4 hover:underline"
          onClick={() => setAdding(true)}
          type="button"
        >
          <Plus className="h-3 w-3" />
          ADD PLAYER
        </button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2">
        {sorted.map((player, i) => (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i > 0 && "border-line border-t"
            )}
            key={player.id}
          >
            {editing?.id === player.id ? (
              <>
                <input
                  className="w-10 shrink-0 bg-transparent font-mono text-[12px] text-text-2 tabular-nums outline-none"
                  onChange={(e) =>
                    setEditing((s) => s && { ...s, num: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditing(null);
                    }
                  }}
                  placeholder="#"
                  value={editing.num}
                />
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text uppercase outline-none"
                  onChange={(e) =>
                    setEditing((s) => s && { ...s, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditing(null);
                    }
                  }}
                  value={editing.name}
                />
                <button
                  aria-label="Save"
                  className="text-accent"
                  onClick={commitEdit}
                  type="button"
                >
                  <Check className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="w-10 shrink-0 font-mono text-[12px] text-text-3 tabular-nums">
                  #{player.num}
                </span>
                <span className="flex-1 truncate font-mono text-[13px] text-text uppercase">
                  {player.name}
                </span>
                <button
                  aria-label="Edit player"
                  className="text-text-3 transition hover:text-text-2"
                  onClick={() => startEdit(player.id, player.name, player.num)}
                  type="button"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label="Remove player"
                  className="text-text-3 transition hover:text-red-400"
                  onClick={() => removePlayer(player.id)}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              players.length > 0 && "border-line border-t"
            )}
          >
            <input
              className="w-10 shrink-0 bg-transparent font-mono text-[12px] text-text-2 tabular-nums outline-none placeholder:text-text-3"
              onChange={(e) => setNewNum(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitAdd();
                }
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                  setNewNum("");
                }
              }}
              placeholder="#"
              value={newNum}
            />
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text uppercase outline-none placeholder:text-text-3 placeholder:normal-case"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitAdd();
                }
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                  setNewNum("");
                }
              }}
              placeholder="Player name"
              value={newName}
            />
            <button
              aria-label="Save player"
              className="text-accent"
              onClick={commitAdd}
              type="button"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              aria-label="Cancel"
              className="text-text-3"
              onClick={() => {
                setAdding(false);
                setNewName("");
                setNewNum("");
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {players.length === 0 && !adding && (
          <div className="px-4 py-8 text-center font-mono text-[12px] text-text-3 tracking-widest">
            Roster is empty
          </div>
        )}
      </div>
    </section>
  );
}
