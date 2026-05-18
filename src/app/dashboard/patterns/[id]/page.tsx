import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProblemsGroupedByPattern, isSolved } from "@/lib/mock-data";
import { PatternProblemsList } from "@/components/dashboard/pattern-problems-list";

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
      <PatternProblemsList problems={problems} />
    </div>
  );
}
