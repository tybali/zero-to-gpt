"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { STAGES, PHASES, TOTAL_STAGES } from "@/lib/stages-data";
import {
  ArrowRight,
  Brain,
  Code2,
  Layers,
  Rocket,
  Sparkles,
  Zap,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";

const HERO_STATS = [
  { value: "16", label: "Interactive Stages", icon: Layers },
  { value: "8", label: "Learning Phases", icon: Target },
  { value: "~2h", label: "Total Duration", icon: Clock },
  { value: "100+", label: "Concepts Covered", icon: BookOpen },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Deep Technical Coverage",
    description:
      "From transformer architecture internals to production MLOps — understand every layer of LLM development.",
  },
  {
    icon: Code2,
    title: "Interactive Code Playgrounds",
    description:
      "Experiment with real PyTorch code, tokenizers, and training loops in your browser.",
  },
  {
    icon: Sparkles,
    title: "Visual Explanations",
    description:
      "Animated diagrams, attention visualizations, and interactive simulations make complex concepts intuitive.",
  },
  {
    icon: Zap,
    title: "Beginner to Advanced",
    description:
      "Each topic has dual-layer explanations: accessible analogies plus deep technical dives.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Interactive Learning Experience
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              How Large Language
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Models Are Built
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            From <span className="text-foreground font-medium">Day 0</span> to{" "}
            <span className="text-foreground font-medium">Production</span> — an
            interactive journey through research, data, architecture, training,
            alignment, and deployment.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/stages/research-vision">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
              >
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#roadmap">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white/20 hover:bg-white/5"
              >
                View Roadmap
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <stat.icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learn Like Never Before
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Not just reading — experiencing. Every concept comes with
              interactive visualizations and hands-on experiments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors h-full">
                  <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Complete LLM Lifecycle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {TOTAL_STAGES} comprehensive stages across 8 phases — from the
              first research paper to production deployment.
            </p>
          </motion.div>

          {/* Phases */}
          <div className="space-y-12">
            {PHASES.map((phase, phaseIdx) => {
              const phaseStages = STAGES.filter(
                (s) => s.phaseNumber === phase.number
              );
              return (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: phaseIdx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${phase.color}20` }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: phase.color }}>
                        Phase {phase.number}: {phase.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {phaseStages.length} stage{phaseStages.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4 border-l-2" style={{ borderColor: `${phase.color}40` }}>
                    {phaseStages.map((stage) => (
                      <Link key={stage.slug} href={`/stages/${stage.slug}`}>
                        <Card className="p-5 bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-card/80 transition-all cursor-pointer group">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{stage.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground group-hover:text-white transition-colors truncate">
                                {stage.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {stage.subtitle}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge
                                  variant="outline"
                                  className="text-xs border-white/10"
                                >
                                  {stage.duration}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs border-white/10 ${
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
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Understand LLMs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a curious beginner or an ML engineer looking to
            deepen your understanding, this interactive guide will take you
            through every step of building a language model.
          </p>
          <Link href="/stages/research-vision">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
            >
              Begin Your Journey
              <Rocket className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.
          </p>
          <p className="mt-2">
            An educational project exploring the fascinating world of Large
            Language Models.
          </p>
        </div>
      </footer>
    </div>
  );
}
