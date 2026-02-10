"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Stage } from "@/lib/stages-data";
import { Clock, Lightbulb, Code2, BookOpen } from "lucide-react";

interface StageLayoutProps {
  stage: Stage;
  children: React.ReactNode;
}

export function StageLayout({ stage, children }: StageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className={`relative py-16 px-6 bg-gradient-to-b ${stage.bgGradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className="border-white/20"
                style={{ color: stage.color }}
              >
                Phase {stage.phaseNumber}: {stage.phase}
              </Badge>
              <Badge variant="outline" className="border-white/20">
                <Clock className="w-3 h-3 mr-1" />
                {stage.duration}
              </Badge>
              <Badge
                variant="outline"
                className={`border-white/20 ${
                  stage.difficulty === "beginner"
                    ? "text-green-400"
                    : stage.difficulty === "intermediate"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {stage.difficulty}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-4">
              <span className="text-5xl">{stage.icon}</span>
              <span>{stage.title}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {stage.subtitle}
            </p>

            <p className="text-lg text-muted-foreground/80 max-w-2xl">
              {stage.description}
            </p>

            {/* Key Topics */}
            <div className="flex flex-wrap gap-2 mt-6">
              {stage.keyTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="bg-white/5 hover:bg-white/10"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content */}
      <motion.main
        className="max-w-4xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
}

// Reusable section components
interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return <section className={`mb-12 ${className}`}>{children}</section>;
}

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function SectionTitle({ children, icon }: SectionTitleProps) {
  return (
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      {icon}
      {children}
    </h2>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  );
}

interface AnalogyBoxProps {
  title: string;
  children: React.ReactNode;
}

export function AnalogyBox({ title, children }: AnalogyBoxProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 mb-6">
      <div className="flex gap-4">
        <Lightbulb className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-amber-400 mb-2">{title}</h4>
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </Card>
  );
}

interface TechDetailProps {
  children: React.ReactNode;
  title?: string;
}

export function TechDetail({ children, title = "Technical Deep Dive" }: TechDetailProps) {
  return (
    <Accordion type="single" collapsible className="mb-6">
      <AccordionItem value="tech-detail" className="border-white/10">
        <AccordionTrigger className="text-sm font-medium hover:no-underline">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bg-card/50 rounded-lg p-4 mt-2 font-mono text-sm text-muted-foreground border border-white/10">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface InteractiveLabelProps {
  children?: React.ReactNode;
}

export function InteractiveLabel({ children }: InteractiveLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <span className="mr-1">👆</span> Try it yourself!
      </Badge>
      {children}
    </div>
  );
}

interface StatGridProps {
  stats: { value: string; label: string; color?: string }[];
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <Card key={i} className="p-4 text-center bg-card/50 border-white/10">
          <div
            className="text-2xl font-bold"
            style={{ color: stat.color || "inherit" }}
          >
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}

interface InfoBoxProps {
  type: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}

export function InfoBox({ type, title, children }: InfoBoxProps) {
  const styles = {
    info: {
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    },
    warning: {
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      icon: "⚠️",
    },
    success: {
      bg: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/20",
      icon: "✅",
    },
    tip: {
      bg: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      icon: "💡",
    },
  };

  const style = styles[type];

  return (
    <Card
      className={`p-4 bg-gradient-to-r ${style.bg} ${style.border} mb-4`}
    >
      <div className="flex gap-3">
        <span className="flex-shrink-0">
          {typeof style.icon === "string" ? style.icon : style.icon}
        </span>
        <div>
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </Card>
  );
}
