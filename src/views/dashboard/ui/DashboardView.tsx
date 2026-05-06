"use client";

import { useMicrocycles } from "@entities/microcycle";
import { type Team, useTeams } from "@entities/team";
import { CreateMicrocycleForm } from "@features/create-microcycle";
import { BottomSheet, Button } from "@shared/ui";
import { ActiveMicrocycleCard } from "@widgets/active-microcycle-card";
import { MicrocycleHistory } from "@widgets/microcycle-history";
import { Layers, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function EmptyTeams() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <Layers className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">
        No teams yet. Create a team in settings to get started.
      </p>
      <Link href="/settings">
        <Button variant="outline">Go to Settings</Button>
      </Link>
    </div>
  );
}

function EmptyMicrocycles({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <Layers className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">
        No microcycles yet. Create one to start tracking workload.
      </p>
      <Button className="h-12 w-full max-w-xs gap-2" onClick={onCreateClick}>
        <Plus className="h-5 w-5" />
        New microcycle
      </Button>
    </div>
  );
}

function TeamSelector({
  teams,
  selectedId,
  onSelect,
}: {
  teams: Team[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  if (teams.length <= 1) {
    return null;
  }
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {teams.map((team) => (
        <button
          className={`shrink-0 rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
            team.id === selectedId
              ? "bg-accent-primary text-background"
              : "bg-elevated text-secondary hover:bg-subtle"
          }`}
          key={team.id}
          onClick={() => onSelect(team.id!)}
          type="button"
        >
          {team.name}
        </button>
      ))}
    </div>
  );
}

function TeamDashboard({ team }: { team: Team }) {
  const microcycles = useMicrocycles(team.id!);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (microcycles === undefined) {
    return null;
  }

  const sorted = [...microcycles].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  const [active, ...history] = sorted;

  return (
    <>
      <main className="flex flex-1 flex-col gap-6 px-4 py-6 pb-24">
        {active ? (
          <>
            <section className="flex flex-col gap-3">
              <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Active microcycle
              </h2>
              <ActiveMicrocycleCard microcycle={active} />
            </section>

            <Button
              className="h-12 w-full gap-2"
              onClick={() => setSheetOpen(true)}
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              New microcycle
            </Button>

            <MicrocycleHistory microcycles={history} />
          </>
        ) : (
          <EmptyMicrocycles onCreateClick={() => setSheetOpen(true)} />
        )}
      </main>

      <BottomSheet
        onClose={() => setSheetOpen(false)}
        open={sheetOpen}
        title="New microcycle"
      >
        <CreateMicrocycleForm
          onClose={() => setSheetOpen(false)}
          teamId={team.id!}
        />
      </BottomSheet>
    </>
  );
}

export function DashboardView() {
  const teams = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  if (teams === undefined) {
    return null;
  }

  if (teams.length === 0) {
    return (
      <div className="flex min-h-full flex-col bg-base">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-border border-b bg-surface px-4">
          <h1 className="font-semibold text-primary">Home</h1>
          <Link href="/settings">
            <Button size="icon-sm" variant="ghost">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </header>
        <EmptyTeams />
      </div>
    );
  }

  const resolvedId = selectedTeamId ?? teams[0].id!;
  const selectedTeam = teams.find((t) => t.id === resolvedId) ?? teams[0];

  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-border border-b bg-surface px-4">
        <h1 className="font-semibold text-primary">Home</h1>
        <Link href="/settings">
          <Button size="icon-sm" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      {teams.length > 1 && (
        <div className="border-border border-b bg-surface px-4 py-3">
          <TeamSelector
            onSelect={setSelectedTeamId}
            selectedId={resolvedId}
            teams={teams}
          />
        </div>
      )}

      <TeamDashboard key={selectedTeam.id} team={selectedTeam} />
    </div>
  );
}
