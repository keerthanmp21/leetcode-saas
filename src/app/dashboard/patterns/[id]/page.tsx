import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getProblemsGroupedByPattern,
  isSolved,
  getLeetCodeUrl,
  type Problem,
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

// ─── Problem row ───────────────────────────────────────────────────────────────

function ProblemRow({ problem, index }: { problem: Problem; index: number }) {
  const solved = isSolved(problem.id);

  return (
    <a
      href={getLeetCodeUrl(problem.titleSlug)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/40"
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
    </a>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function PatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const grouped = getProblemsGroupedByPattern();
  const entry = grouped.find(({ pattern }) => pattern.id === id);

  if (!entry) notFound();

  const { pattern, problems } = entry;
  const solvedCount = problems.filter((p) => isSolved(p.id)).length;
  const easy = problems.filter((p) => p.difficulty === "EASY").length;
  const medium = problems.filter((p) => p.difficulty === "MEDIUM").length;
  const hard = problems.filter((p) => p.difficulty === "HARD").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{pattern.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {problems.length} problems · {solvedCount} solved
        </p>
      </div>

      {/* Difficulty summary */}
      <div className="flex gap-3">
        <span className="rounded-md bg-emerald-500/15 px-3 py-1.5 text-sm font-medium text-emerald-400">
          Easy {easy}
        </span>
        <span className="rounded-md bg-yellow-500/15 px-3 py-1.5 text-sm font-medium text-yellow-400">
          Medium {medium}
        </span>
        <span className="rounded-md bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400">
          Hard {hard}
        </span>
      </div>

      {/* Problem list */}
      <div className="space-y-2">
        {problems.map((problem, i) => (
          <ProblemRow key={problem.id} problem={problem} index={i} />
        ))}
      </div>
    </div>
  );
}
