"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Stage,
  STAGES,
  PHASES,
  getNextStage,
  getPreviousStage,
  getStageProgress,
} from "@/lib/stages-data";

interface StageHeaderProps {
  currentStage: Stage;
}

export function StageHeader({ currentStage }: StageHeaderProps) {
  const prevStage = getPreviousStage(currentStage.slug);
  const nextStage = getNextStage(currentStage.slug);
  const progress = getStageProgress(currentStage.slug);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Navigation */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Home className="w-4 h-4" />
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>All Stages</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
                  <div className="space-y-6">
                    {PHASES.map((phase) => {
                      const phaseStages = STAGES.filter(
                        (s) => s.phaseNumber === phase.number
                      );
                      return (
                        <div key={phase.number}>
                          <div
                            className="text-sm font-semibold mb-2"
                            style={{ color: phase.color }}
                          >
                            {phase.icon} Phase {phase.number}: {phase.name}
                          </div>
                          <div className="space-y-1 pl-2">
                            {phaseStages.map((stage) => (
                              <Link
                                key={stage.slug}
                                href={`/stages/${stage.slug}`}
                              >
                                <div
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    stage.slug === currentStage.slug
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                  }`}
                                >
                                  <span>{stage.icon}</span>
                                  <span className="truncate">{stage.title}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center: Stage Info */}
          <div className="flex-1 text-center hidden sm:block">
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="text-xs border-white/10"
                style={{ color: currentStage.color }}
              >
                Stage {currentStage.id} of {STAGES.length}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {currentStage.icon} {currentStage.title}
              </span>
            </div>
          </div>

          {/* Right: Prev/Next */}
          <div className="flex items-center gap-2">
            {prevStage ? (
              <Link href={`/stages/${prevStage.slug}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Previous</span>
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" disabled className="gap-1">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Previous</span>
              </Button>
            )}

            {nextStage ? (
              <Link href={`/stages/${nextStage.slug}`}>
                <Button
                  size="sm"
                  className="gap-1 bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button
                  size="sm"
                  className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <span className="hidden md:inline">Complete!</span>
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Progress value={progress} className="h-1" />
        </motion.div>
      </div>
    </header>
  );
}
