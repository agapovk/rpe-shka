"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useSurveyStore } from "@/features/survey/survey.store";
import { cn } from "@/lib/utils";

export default function CategoriesSection() {
  const { categories, addCategory, updateCategory, removeCategory } =
    useSurveyStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  function startEdit(id: string, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  function commitEdit() {
    if (editingId && editingName.trim()) {
      updateCategory(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  }

  function commitAdd() {
    if (newName.trim()) {
      addCategory(newName.trim());
    }
    setNewName("");
    setAdding(false);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
          CATEGORIES
        </span>
        <button
          className="flex items-center gap-1 py-1 font-mono text-[11px] text-accent uppercase tracking-widest underline-offset-4 hover:underline"
          onClick={() => setAdding(true)}
          type="button"
        >
          <Plus className="h-3 w-3" />
          ADD
        </button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-bg-2">
        {categories.map((cat, i) => (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              i > 0 && "border-line border-t"
            )}
            key={cat.id}
          >
            {editingId === cat.id ? (
              <>
                <input
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text outline-none"
                  onBlur={commitEdit}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditingId(null);
                    }
                  }}
                  value={editingName}
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
                <span className="flex-1 font-mono text-[13px] text-text">
                  {cat.name}
                </span>
                <button
                  aria-label="Edit category"
                  className="text-text-3 transition hover:text-text-2"
                  onClick={() => startEdit(cat.id, cat.name)}
                  type="button"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  aria-label="Delete category"
                  className="text-text-3 transition hover:text-red-400"
                  onClick={() => removeCategory(cat.id)}
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
              categories.length > 0 && "border-line border-t"
            )}
          >
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-text outline-none placeholder:text-text-3"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitAdd();
                }
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
              placeholder="Category name"
              value={newName}
            />
            <button
              aria-label="Save new category"
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
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {categories.length === 0 && !adding && (
          <div className="px-4 py-8 text-center font-mono text-[12px] text-text-3 tracking-widest">
            No categories yet
          </div>
        )}
      </div>
    </section>
  );
}
