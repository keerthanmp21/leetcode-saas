"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { ProblemDetailsDrawer } from "@/components/dashboard/problem-details-drawer";
import { isSolved, type Problem } from "@/lib/mock-data";

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

// ─── Problem row ───────────────────────────────────────────────────────────────

function ProblemRow({
  problem,
  index,
  onSelect,
}: {
  problem: Problem;
  index: number;
  onSelect: (problem: Problem) => void;
}) {
  const solved = isSolved(problem.id);

  return (
    <button
      onClick={() => onSelect(problem)}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/40"
    >
      <span className="w-6 shrink-0 text-sm text-muted-foreground/60">{index + 1}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{problem.title}</p>
          {problem.isPaidOnly && (
            <Lock className="size-3.5 shrink-0 text-muted-foreground/60" />
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {problem.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {problem.topics.length > 3 && (
            <span className="text-[11px] text-muted-foreground">
              +{problem.topics.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="hidden w-14 text-right text-xs text-muted-foreground sm:block">
          {problem.acceptanceRate}%
        </span>
        {solved ? (
          <span className="flex w-16 items-center justify-end gap-1 text-xs text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Solved
          </span>
        ) : (
          <span className="w-16" />
        )}
      </div>
    </button>
  );
}

// ─── Exported list component ──────────────────────────────────────────────────

export function PatternProblemsList({ problems }: { problems: Problem[] }) {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleSelect(problem: Problem) {
    setSelectedProblem(problem);
    setDrawerOpen(true);
  }

  return (
    <>
      <div className="space-y-2">
        {problems.map((problem, i) => (
          <ProblemRow
            key={problem.id}
            problem={problem}
            index={i}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <ProblemDetailsDrawer
        problem={selectedProblem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}
