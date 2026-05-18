"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, Copy, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  type Problem,
  isSolved,
  getLeetCodeUrl,
  getSolutionApproaches,
} from "@/lib/mock-data";

const MIN_WIDTH = 320;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 480;

export function ProblemDetailsDrawer({
  problem,
  open,
  onOpenChange,
}: {
  problem: Problem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedApproachIdx, setSelectedApproachIdx] = useState(0);
  const [solutionCode, setSolutionCode] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    setSelectedApproachIdx(0);
    setSolutionCode("");
  }, [problem?.id]);

  function handleResizeStart(e: React.MouseEvent) {
    resizeRef.current = { startX: e.clientX, startWidth: width };
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    function onMove(ev: MouseEvent) {
      if (!resizeRef.current) return;
      const delta = resizeRef.current.startX - ev.clientX;
      const next = Math.min(Math.max(resizeRef.current.startWidth + delta, MIN_WIDTH), MAX_WIDTH);
      setWidth(next);
    }

    function onUp() {
      resizeRef.current = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  }

  if (!problem) return null;

  const solved = isSolved(problem.id);
  const leetcodeUrl = getLeetCodeUrl(problem.titleSlug);
  const approaches = getSolutionApproaches(problem.id);
  const selectedApproach = approaches[selectedApproachIdx] ?? null;

  const difficultyStyles = {
    EASY: "bg-emerald-500/15 text-emerald-400",
    MEDIUM: "bg-yellow-500/15 text-yellow-400",
    HARD: "bg-red-500/15 text-red-400",
  };
  const difficultyLabels = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="gap-0"
        style={{ width: `${width}px`, maxWidth: "90vw" }}
        showCloseButton={false}
      >
        {/* Resize handle */}
        <div
          onMouseDown={handleResizeStart}
          className="absolute left-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-emerald-500/40"
        />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <SheetTitle>Problem Details</SheetTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Title + external link + ID */}
          <div>
            <div className="flex items-start gap-1.5">
              <h2 className="text-lg font-bold leading-tight text-foreground">
                {problem.title}
              </h2>
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Problem ID: #{problem.questionId}
            </p>
          </div>

          {/* Solved banner */}
          {solved && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2.5 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              You have solved this problem
            </div>
          )}

          {/* Difficulty */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Difficulty
            </p>
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${difficultyStyles[problem.difficulty]}`}
            >
              {difficultyLabels[problem.difficulty]}
            </span>
          </div>

          {/* Acceptance Rate */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Acceptance Rate
            </p>
            <div className="flex items-center gap-3">
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                  style={{ width: `${problem.acceptanceRate}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-foreground tabular-nums">
                {problem.acceptanceRate}%
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {problem.topics.map((t) => (
                <span
                  key={t}
                  className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {problem.description}
            </p>
          </div>

          {/* Complexity */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] text-muted-foreground">
                Time Complexity
              </p>
              <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                {problem.timeComplexity}
              </p>
            </div>
            <div className="flex-1 rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[11px] text-muted-foreground">
                Space Complexity
              </p>
              <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                {problem.spaceComplexity}
              </p>
            </div>
          </div>

          {/* Solution Patterns */}
          {approaches.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Solution Patterns
              </p>
              <div className="space-y-2">
                {approaches.map((approach, idx) => (
                  <button
                    key={approach.name}
                    onClick={() => setSelectedApproachIdx(idx)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      idx === selectedApproachIdx
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                        : "border-border bg-card text-foreground hover:bg-accent/40"
                    }`}
                  >
                    <p className="text-sm font-medium">{approach.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {approach.description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedApproach && (
                <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                  <p className="text-xs font-semibold text-emerald-400">
                    Pattern: {selectedApproach.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selectedApproach.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Solution code */}
          <textarea
            value={solutionCode}
            onChange={(e) => setSolutionCode(e.target.value)}
            placeholder="Paste your solution code here."
            rows={6}
            className="w-full resize-none rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1">
            <Button
              size="sm"
              className="bg-emerald-500 text-black hover:bg-emerald-400"
            >
              Get AI Solution
            </Button>
            <Button size="sm" variant="outline">
              Save Solution
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex shrink-0 gap-2 border-t border-border px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => navigator.clipboard.writeText(leetcodeUrl)}
          >
            <Copy className="size-3.5" />
            Copy Link
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400"
            onClick={() => window.open(leetcodeUrl, "_blank")}
          >
            <ExternalLink className="size-3.5" />
            View on LeetCode
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
