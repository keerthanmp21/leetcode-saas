"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemDetailsDrawer } from "@/components/dashboard/problem-details-drawer";
import {
  mockDashboardStats,
  getProblemsGroupedByPattern,
  isSolved,
  type Problem,
  type Pattern,
} from "@/lib/mock-data";

// ─── Difficulty badge ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: Problem["difficulty"] }) {
  const styles = {
    EASY: "bg-emerald-500/15 text-emerald-400",
    MEDIUM: "bg-yellow-500/15 text-yellow-400",
    HARD: "bg-red-500/15 text-red-400",
  };
  const labels = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${styles[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}

// ─── Problem card ──────────────────────────────────────────────────────────────

function ProblemCard({
  problem,
  onSelect,
}: {
  problem: Problem;
  onSelect: (problem: Problem) => void;
}) {
  const solved = isSolved(problem.id);
  const visibleTopics = problem.topics.slice(0, 2);
  const extraTopics = problem.topics.length - 2;

  return (
    <button
      onClick={() => onSelect(problem)}
      className="group relative flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-border/80 hover:bg-accent/40"
    >
      {problem.isPaidOnly && (
        <Lock className="absolute right-3 top-3 size-3.5 text-muted-foreground/60" />
      )}

      <p className="pr-5 text-sm font-medium text-foreground leading-snug group-hover:text-foreground/90">
        {problem.title}
      </p>

      <div className="flex items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="text-xs text-muted-foreground">{problem.acceptanceRate}%</span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {visibleTopics.map((t) => (
          <span
            key={t}
            className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
        {extraTopics > 0 && (
          <span className="text-[11px] text-muted-foreground">+{extraTopics}</span>
        )}
      </div>

      {solved && (
        <p className="flex items-center gap-1 text-xs text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Solved
        </p>
      )}
    </button>
  );
}

// ─── Stats card ────────────────────────────────────────────────────────────────

function StatsCard({
  label,
  value,
  sub,
  barColor,
}: {
  label: string;
  value: number;
  sub: string;
  barColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className={`absolute right-4 top-4 h-10 w-1 rounded-full ${barColor}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

// ─── Pattern row ───────────────────────────────────────────────────────────────

const PATTERN_BORDER: Record<string, string> = {
  "Two Pointer": "border-emerald-500",
  "Binary Search": "border-blue-500",
  "Dynamic Programming": "border-purple-500",
  "Sliding Window": "border-cyan-500",
  "Array": "border-orange-500",
  "HashMap": "border-yellow-500",
  "Tree": "border-lime-500",
  "Graph": "border-indigo-500",
  "Greedy": "border-amber-500",
  "Backtracking": "border-rose-500",
  "Trie": "border-pink-500",
  "Union Find": "border-violet-500",
  "Topological Sort": "border-sky-500",
  "Shortest Path": "border-teal-500",
  "Segment Tree": "border-red-500",
};

function PatternRow({
  pattern,
  problems,
  showUnsolved,
  onSelectProblem,
}: {
  pattern: Pattern;
  problems: Problem[];
  showUnsolved: boolean;
  onSelectProblem: (problem: Problem) => void;
}) {
  const filtered = showUnsolved ? problems.filter((p) => !isSolved(p.id)) : problems;
  if (filtered.length === 0) return null;

  const visible = filtered.slice(0, 4);
  const borderClass = PATTERN_BORDER[pattern.name] ?? "border-emerald-500";

  return (
    <div className={`border-l-2 pl-4 ${borderClass}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{pattern.name}</h3>
        <Link
          href={`/dashboard/patterns/${pattern.id}`}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          View all ({filtered.length})
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((p) => (
          <ProblemCard key={p.id} problem={p} onSelect={onSelectProblem} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "unsolved">("all");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const grouped = getProblemsGroupedByPattern();

  function handleSelectProblem(problem: Problem) {
    setSelectedProblem(problem);
    setDrawerOpen(true);
  }

  return (
    <>
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Solved"
            value={mockDashboardStats.totalSolved}
            sub={`+${mockDashboardStats.solvedThisMonth} this month`}
            barColor="bg-emerald-500"
          />
          <StatsCard
            label="Easy"
            value={mockDashboardStats.easy}
            sub="Completed"
            barColor="bg-emerald-500"
          />
          <StatsCard
            label="Medium"
            value={mockDashboardStats.medium}
            sub="Completed"
            barColor="bg-yellow-500"
          />
          <StatsCard
            label="Hard"
            value={mockDashboardStats.hard}
            sub="Completed"
            barColor="bg-red-500"
          />
        </div>

        {/* Problems by Pattern */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Problems by Pattern</h2>
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
              <Button
                size="sm"
                variant={filter === "all" ? "secondary" : "ghost"}
                className="h-7 px-3 text-xs"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === "unsolved" ? "secondary" : "ghost"}
                className="h-7 px-3 text-xs"
                onClick={() => setFilter("unsolved")}
              >
                Unsolved
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {grouped.map(({ pattern, problems }) => (
              <PatternRow
                key={pattern.id}
                pattern={pattern}
                problems={problems}
                showUnsolved={filter === "unsolved"}
                onSelectProblem={handleSelectProblem}
              />
            ))}
          </div>
        </div>
      </div>

      <ProblemDetailsDrawer
        problem={selectedProblem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}
