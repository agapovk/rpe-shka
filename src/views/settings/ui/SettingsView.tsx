"use client";

import { type Team, useTeams } from "@entities/team";
import { ManageCategories } from "@features/manage-categories";
import { ManagePlayers } from "@features/manage-players";
import { TeamForm } from "@features/manage-team";
import { db } from "@shared/db";
import { BottomSheet, Button } from "@shared/ui";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type TeamSheet = { mode: "create" } | { mode: "edit"; team: Team };

export function SettingsView() {
  const teams = useTeams();
  const [sheet, setSheet] = useState<TeamSheet | null>(null);

  async function handleDeleteTeam(team: Team) {
    if (team.id === undefined) {
      return;
    }
    await db.players.where("teamId").equals(team.id).delete();
    await db.teams.delete(team.id);
  }

  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center border-border border-b bg-surface px-4">
        <h1 className="font-semibold text-primary">Settings</h1>
      </header>

      <main className="flex flex-col gap-6 px-4 py-6 pb-24">
        {/* Teams section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Teams
            </h2>
          </div>

          {teams?.map((team) => (
            <div
              className="rounded-xl border border-border bg-surface p-4"
              key={team.id}
            >
              <div className="flex items-center gap-2">
                <span className="flex-1 font-semibold text-primary">
                  {team.name}
                </span>
                <Button
                  onClick={() => setSheet({ mode: "edit", team })}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Pencil />
                </Button>
                <Button
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteTeam(team)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 />
                </Button>
              </div>

              <div className="mt-3 border-border-subtle border-t pt-3">
                <ManagePlayers teamId={team.id!} />
              </div>
            </div>
          ))}

          {teams?.length === 0 && (
            <p className="text-muted-foreground text-sm">No teams yet</p>
          )}

          <Button
            className="h-12 w-full gap-2"
            onClick={() => setSheet({ mode: "create" })}
            type="button"
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add team
          </Button>
        </section>

        {/* Categories section */}
        <section className="flex flex-col gap-3">
          <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Session Categories
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4">
            <ManageCategories />
          </div>
        </section>
      </main>

      <BottomSheet
        onClose={() => setSheet(null)}
        open={sheet !== null}
        title={sheet?.mode === "edit" ? "Edit team" : "New team"}
      >
        {sheet && (
          <TeamForm
            onClose={() => setSheet(null)}
            team={sheet.mode === "edit" ? sheet.team : undefined}
          />
        )}
      </BottomSheet>
    </div>
  );
}
