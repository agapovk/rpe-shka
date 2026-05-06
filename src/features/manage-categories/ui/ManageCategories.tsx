"use client";

import { type Category, useCategories } from "@entities/category";
import { DEFAULT_CATEGORIES } from "@shared/config";
import { db } from "@shared/db";
import { BottomSheet, Button, Input } from "@shared/ui";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

interface CategoryFormProps {
  onClose: () => void;
}

function CategoryForm({ onClose }: CategoryFormProps) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const all = await db.categories.orderBy("order").toArray();
    const maxOrder = all.length > 0 ? Math.max(...all.map((c) => c.order)) : 0;
    await db.categories.add({ name: trimmed, order: maxOrder + 1 });
    onClose();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        autoFocus
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name (e.g. MD-4)"
        value={name}
      />
      <Button className="h-12 w-full" type="submit">
        Add category
      </Button>
    </form>
  );
}

async function swapOrder(a: Category, b: Category) {
  await Promise.all([
    db.categories.update(a.id!, { order: b.order }),
    db.categories.update(b.id!, { order: a.order }),
  ]);
}

export function ManageCategories() {
  const categories = useCategories();
  const [sheetOpen, setSheetOpen] = useState(false);

  async function moveUp(index: number) {
    if (!categories || index <= 0) {
      return;
    }
    await swapOrder(categories[index], categories[index - 1]);
  }

  async function moveDown(index: number) {
    if (!categories || index >= categories.length - 1) {
      return;
    }
    await swapOrder(categories[index], categories[index + 1]);
  }

  async function handleDelete(category: Category) {
    if (category.id !== undefined) {
      await db.categories.delete(category.id);
    }
  }

  async function resetToDefaults() {
    await db.categories.clear();
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }

  return (
    <>
      <div className="flex flex-col">
        {categories?.map((category, index) => (
          <div
            className="flex min-h-11 items-center gap-2 border-border-subtle border-b py-1 last:border-0"
            key={category.id}
          >
            <span className="flex-1 font-mono text-primary text-sm uppercase">
              {category.name}
            </span>
            <Button
              disabled={index === 0}
              onClick={() => moveUp(index)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronUp />
            </Button>
            <Button
              disabled={!categories || index === categories.length - 1}
              onClick={() => moveDown(index)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronDown />
            </Button>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(category)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Trash2 />
            </Button>
          </div>
        ))}

        {categories?.length === 0 && (
          <p className="py-2 text-muted-foreground text-sm">
            No categories yet
          </p>
        )}
      </div>

      <div className="mt-1 flex gap-2">
        <Button
          className="gap-1.5 text-muted-foreground"
          onClick={() => setSheetOpen(true)}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
          Add category
        </Button>
        <Button
          className="text-muted-foreground"
          onClick={resetToDefaults}
          size="sm"
          type="button"
          variant="ghost"
        >
          Reset to defaults
        </Button>
      </div>

      <BottomSheet
        onClose={() => setSheetOpen(false)}
        open={sheetOpen}
        title="Add category"
      >
        <CategoryForm onClose={() => setSheetOpen(false)} />
      </BottomSheet>
    </>
  );
}
