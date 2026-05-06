"use client";

import { CategoryBadge } from "@entities/category";
import { MicrocycleBadge, MicrocycleCard } from "@entities/microcycle";
import { PlayerRow } from "@entities/player";
import { SessionRow, SessionStatusBadge } from "@entities/session";
import { TeamBadge, TeamCard } from "@entities/team";
import { Badge, Button, Input } from "@shared/ui";

const MOCK_TEAM = { id: 1, name: "Spartak Moscow", createdAt: new Date() };
const MOCK_CATEGORY = { id: 1, name: "MD-3", order: 3 };
const MOCK_MICROCYCLE = {
  id: 1,
  teamId: 1,
  name: "vs. CSKA",
  createdAt: new Date("2025-04-28"),
};
const MOCK_SESSION = {
  id: 1,
  microcycleId: 1,
  categoryId: 1,
  date: new Date("2025-04-28"),
  duration: 75,
};
const MOCK_PLAYERS = [
  { id: 1, teamId: 1, name: "Ivan Petrov", number: 7 },
  { id: 2, teamId: 1, name: "Aleksei Smirnov", number: 10 },
  { id: 3, teamId: 1, name: "Dmitry Volkov" },
];
const MOCK_CATEGORIES = [
  { id: 1, name: "MD-4", order: 1 },
  { id: 2, name: "MD-3", order: 2 },
  { id: 3, name: "MD", order: 5 },
  { id: 4, name: "Recovery", order: 7 },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-faint text-xs">{label}</span>
      {children}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-base px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 font-semibold text-2xl text-primary">
          Component Preview
        </h1>

        <div className="flex flex-col gap-10">
          {/* ── Team ────────────────────────────── */}
          <Section title="Team">
            <Row label="TeamCard (static)">
              <TeamCard playerCount={16} team={MOCK_TEAM} />
            </Row>
            <Row label="TeamCard (interactive)">
              <TeamCard
                onClick={() => console.log("team clicked")}
                playerCount={16}
                team={MOCK_TEAM}
              />
            </Row>
            <Row label="TeamBadge">
              <div className="flex gap-2">
                <TeamBadge team={MOCK_TEAM} />
                <TeamBadge team={{ name: "Lokomotiv" }} />
              </div>
            </Row>
          </Section>

          {/* ── Player ──────────────────────────── */}
          <Section title="Player">
            <Row label="PlayerRow">
              <div className="divide-y divide-border rounded-lg border border-border bg-surface px-3">
                {MOCK_PLAYERS.map((p) => (
                  <PlayerRow key={p.id} player={p} />
                ))}
              </div>
            </Row>
          </Section>

          {/* ── Microcycle ──────────────────────── */}
          <Section title="Microcycle">
            <Row label="MicrocycleCard (static)">
              <MicrocycleCard microcycle={MOCK_MICROCYCLE} sessionCount={4} />
            </Row>
            <Row label="MicrocycleCard (interactive)">
              <MicrocycleCard
                microcycle={MOCK_MICROCYCLE}
                onClick={() => console.log("microcycle clicked")}
                sessionCount={4}
              />
            </Row>
            <Row label="MicrocycleBadge">
              <div className="flex gap-2">
                <MicrocycleBadge microcycle={MOCK_MICROCYCLE} />
                <MicrocycleBadge microcycle={{ name: "Pre-season W1" }} />
              </div>
            </Row>
          </Section>

          {/* ── Session ─────────────────────────── */}
          <Section title="Session">
            <Row label="SessionRow + SessionStatusBadge">
              <div className="divide-y divide-border rounded-lg border border-border bg-surface px-3">
                <SessionRow
                  category={MOCK_CATEGORY}
                  session={MOCK_SESSION}
                  status="complete"
                />
                <SessionRow
                  category={{ name: "MD" }}
                  session={{ ...MOCK_SESSION, duration: 90 }}
                  status="partial"
                />
                <SessionRow
                  category={{ name: "Recovery" }}
                  session={{ ...MOCK_SESSION, duration: 60 }}
                  status="empty"
                />
              </div>
            </Row>
            <Row label="SessionStatusBadge (all states)">
              <div className="flex gap-2">
                <SessionStatusBadge status="complete" />
                <SessionStatusBadge status="partial" />
                <SessionStatusBadge status="empty" />
              </div>
            </Row>
          </Section>

          {/* ── Category ────────────────────────── */}
          <Section title="Category">
            <Row label="CategoryBadge">
              <div className="flex flex-wrap gap-2">
                {MOCK_CATEGORIES.map((c) => (
                  <CategoryBadge category={c} key={c.id} />
                ))}
              </div>
            </Row>
          </Section>

          {/* ── Shared UI ───────────────────────── */}
          <Section title="Shared UI · Badge">
            <Row label="variants">
              <div className="flex flex-wrap gap-2">
                <Badge>default</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="destructive">destructive</Badge>
                <Badge variant="outline">outline</Badge>
              </div>
            </Row>
          </Section>

          <Section title="Shared UI · Button">
            <Row label="variants">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Default</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="outline">
                  Outline
                </Button>
                <Button size="sm" variant="ghost">
                  Ghost
                </Button>
                <Button size="sm" variant="destructive">
                  Destructive
                </Button>
              </div>
            </Row>
            <Row label="sizes">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="xs">xs</Button>
                <Button size="sm">sm</Button>
                <Button>default</Button>
                <Button size="lg">lg</Button>
              </div>
            </Row>
          </Section>

          <Section title="Shared UI · Input">
            <Row label="default">
              <Input placeholder="Player name" />
            </Row>
            <Row label="with value">
              <Input defaultValue="Ivan Petrov" readOnly />
            </Row>
            <Row label="number">
              <Input className="w-20" placeholder="#" type="number" />
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
}
