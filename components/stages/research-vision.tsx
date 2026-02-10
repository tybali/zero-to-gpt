"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Section,
  SectionTitle,
  Paragraph,
  AnalogyBox,
  TechDetail,
  StatGrid,
  InfoBox,
} from "@/components/shared/stage-layout";
import { ArrowRight, ExternalLink, BookOpen, Lightbulb, Calendar } from "lucide-react";

const TIMELINE_EVENTS = [
  { year: "1950", event: "Turing Test proposed", desc: "Alan Turing asks 'Can machines think?'" },
  { year: "1966", event: "ELIZA chatbot", desc: "First conversational AI (simple pattern matching)" },
  { year: "1997", event: "LSTM invented", desc: "Long Short-Term Memory solves vanishing gradients" },
  { year: "2013", event: "Word2Vec", desc: "Words as vectors — meaning from context" },
  { year: "2017", event: "Transformer", desc: "'Attention Is All You Need' changes everything" },
  { year: "2018", event: "GPT-1 & BERT", desc: "Pre-training + fine-tuning paradigm emerges" },
  { year: "2020", event: "GPT-3", desc: "175B params, few-shot learning, emergent abilities" },
  { year: "2022", event: "ChatGPT", desc: "RLHF makes LLMs usable by everyone" },
  { year: "2023", event: "GPT-4 & Claude", desc: "Multimodal, longer context, better reasoning" },
  { year: "2024", event: "Open weights era", desc: "Llama 3, Mistral, Qwen — open models rival closed" },
];

const KEY_PAPERS = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    venue: "NeurIPS",
    impact: "Introduced the Transformer architecture",
    citations: "100K+",
  },
  {
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    year: 2018,
    venue: "NAACL",
    impact: "Bidirectional pre-training for NLU",
    citations: "80K+",
  },
  {
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    year: 2020,
    venue: "NeurIPS",
    impact: "GPT-3: scaling + in-context learning",
    citations: "30K+",
  },
  {
    title: "Training language models to follow instructions (InstructGPT)",
    authors: "Ouyang et al.",
    year: 2022,
    venue: "NeurIPS",
    impact: "RLHF for instruction following",
    citations: "10K+",
  },
];

const USE_CASES = [
  { icon: "💬", title: "Conversational AI", examples: "ChatGPT, Claude, customer support bots" },
  { icon: "✍️", title: "Content Generation", examples: "Writing, marketing copy, documentation" },
  { icon: "💻", title: "Code Assistance", examples: "GitHub Copilot, Cursor, code review" },
  { icon: "🔍", title: "Search & Retrieval", examples: "Semantic search, RAG systems" },
  { icon: "📊", title: "Data Analysis", examples: "Natural language to SQL, insights" },
  { icon: "🌐", title: "Translation", examples: "Real-time translation, localization" },
  { icon: "📚", title: "Education", examples: "Tutoring, personalized learning" },
  { icon: "🏥", title: "Healthcare", examples: "Medical documentation, diagnosis support" },
];

export function ResearchVisionStage() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(6); // Start at Transformer

  return (
    <div>
      <Section>
        <SectionTitle icon={<Lightbulb className="w-6 h-6 text-indigo-400" />}>
          Why Build a Large Language Model?
        </SectionTitle>

        <Paragraph>
          Before diving into the technical details, let&apos;s understand <strong>why</strong> LLMs
          matter. Large Language Models represent one of the most significant breakthroughs in
          artificial intelligence — they can understand and generate human language with remarkable
          fluency, reason about complex problems, and assist with tasks ranging from writing code
          to explaining quantum physics.
        </Paragraph>

        <AnalogyBox title="Think of it like this...">
          Imagine if you could distill the knowledge from millions of books, websites, and
          conversations into a single system that can answer questions, help you write, and
          even code. That&apos;s essentially what an LLM is — a compressed representation of
          human knowledge that can be queried through natural language.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "175B+", label: "Parameters (GPT-3)" },
            { value: "45TB", label: "Training Data" },
            { value: "$100M+", label: "Training Cost" },
            { value: "10,000+", label: "GPUs Required" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Calendar className="w-6 h-6 text-indigo-400" />}>
          The Journey to Modern LLMs
        </SectionTitle>

        <Paragraph>
          Language AI didn&apos;t appear overnight. It evolved over decades of research, with each
          breakthrough building on previous work. Click on any event to learn more:
        </Paragraph>

        <div className="relative mb-8">
          {/* Timeline */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {TIMELINE_EVENTS.map((event, idx) => (
                <motion.button
                  key={event.year}
                  onClick={() => setActiveTimelineIdx(idx)}
                  className={`relative px-4 py-3 rounded-lg border transition-all ${
                    idx === activeTimelineIdx
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                      : "bg-card/50 border-white/10 text-muted-foreground hover:border-white/20"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-lg font-bold">{event.year}</div>
                  <div className="text-xs truncate max-w-24">{event.event}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active Event Details */}
          <motion.div
            key={activeTimelineIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-card/50 rounded-xl border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div
                className="text-3xl font-bold text-indigo-400"
              >
                {TIMELINE_EVENTS[activeTimelineIdx].year}
              </div>
              <div>
                <h4 className="text-xl font-semibold">
                  {TIMELINE_EVENTS[activeTimelineIdx].event}
                </h4>
                <p className="text-muted-foreground mt-1">
                  {TIMELINE_EVENTS[activeTimelineIdx].desc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <TechDetail title="Key Insight: Why 2017 Changed Everything">
          <p className="mb-3">
            The Transformer architecture (2017) solved two critical problems:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Parallelization:</strong> Unlike RNNs/LSTMs which process tokens
              sequentially, Transformers process all tokens simultaneously. This enabled
              training on massive datasets using thousands of GPUs in parallel.
            </li>
            <li>
              <strong>Long-range dependencies:</strong> Self-attention lets any token
              directly attend to any other token, regardless of distance. RNNs struggled
              with long sequences due to vanishing gradients.
            </li>
          </ul>
          <p className="mt-3 text-indigo-400">
            Result: Training time dropped from weeks to days, model sizes exploded from
            millions to billions of parameters.
          </p>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<BookOpen className="w-6 h-6 text-indigo-400" />}>
          Foundational Research Papers
        </SectionTitle>

        <Paragraph>
          Understanding LLMs means understanding the key papers that shaped the field.
          These four papers are essential reading for anyone serious about language AI:
        </Paragraph>

        <div className="grid gap-4 md:grid-cols-2">
          {KEY_PAPERS.map((paper) => (
            <Card
              key={paper.title}
              className="p-5 bg-card/50 border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">
                  {paper.venue} {paper.year}
                </Badge>
                <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">
                  {paper.citations} citations
                </Badge>
              </div>
              <h4 className="font-semibold mb-1">{paper.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{paper.authors}</p>
              <p className="text-sm text-indigo-400">{paper.impact}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>What Can LLMs Do?</SectionTitle>

        <Paragraph>
          Modern LLMs have become surprisingly versatile. Here are some of the key
          applications driving the AI revolution:
        </Paragraph>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <Card
              key={useCase.title}
              className="p-4 bg-card/50 border-white/10"
            >
              <div className="text-2xl mb-2">{useCase.icon}</div>
              <h4 className="font-semibold text-sm mb-1">{useCase.title}</h4>
              <p className="text-xs text-muted-foreground">{useCase.examples}</p>
            </Card>
          ))}
        </div>

        <InfoBox type="tip" title="Emerging Capabilities">
          LLMs are increasingly being used for agentic workflows — where the model
          plans multi-step tasks, uses tools, and executes actions autonomously.
          This represents a shift from &quot;AI as assistant&quot; to &quot;AI as autonomous agent.&quot;
        </InfoBox>
      </Section>

      <Section>
        <SectionTitle>Defining Your Objectives</SectionTitle>

        <Paragraph>
          Before building an LLM, you need to answer some fundamental questions.
          Your answers will shape every decision that follows:
        </Paragraph>

        <Tabs defaultValue="purpose" className="mb-6">
          <TabsList className="bg-card/50 border border-white/10">
            <TabsTrigger value="purpose">Purpose</TabsTrigger>
            <TabsTrigger value="scale">Scale</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
          </TabsList>

          <TabsContent value="purpose" className="mt-4">
            <Card className="p-6 bg-card/50 border-white/10">
              <h4 className="font-semibold mb-3">What problem are you solving?</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                  <span><strong>General-purpose assistant:</strong> Broad knowledge, conversational, helpful (like ChatGPT/Claude)</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                  <span><strong>Domain-specific expert:</strong> Deep knowledge in one area (legal, medical, finance)</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                  <span><strong>Code generation:</strong> Optimized for programming tasks (Codex, StarCoder)</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                  <span><strong>Research/reasoning:</strong> Complex multi-step problem solving</span>
                </li>
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="scale" className="mt-4">
            <Card className="p-6 bg-card/50 border-white/10">
              <h4 className="font-semibold mb-3">How big should your model be?</h4>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="font-semibold text-green-400">Small (1-7B params)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fast, cheap to run, can run on consumer hardware. Good for specific tasks.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="font-semibold text-yellow-400">Medium (7-70B params)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Balance of capability and cost. Sweet spot for most applications.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400">Large (70B+ params)</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum capability, emergent abilities. Requires significant infrastructure.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="mt-4">
            <Card className="p-6 bg-card/50 border-white/10">
              <h4 className="font-semibold mb-3">What are your constraints?</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-xl">💰</span>
                  <span><strong>Budget:</strong> Training can cost $100K to $100M+ depending on scale</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">⏱️</span>
                  <span><strong>Time:</strong> Pre-training takes weeks to months</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">👥</span>
                  <span><strong>Team:</strong> ML engineers, data scientists, infrastructure experts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">📜</span>
                  <span><strong>Data:</strong> Access to high-quality training data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">⚖️</span>
                  <span><strong>Legal:</strong> Data licensing, privacy, regulatory compliance</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>LLMs emerged from decades of research, with Transformers (2017) being the key breakthrough</li>
            <li>Modern LLMs can perform a wide range of language tasks with surprising capability</li>
            <li>Before building, clearly define your purpose, scale, and constraints</li>
            <li>The gap between open and closed models is rapidly shrinking</li>
          </ul>
        </InfoBox>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Ready to plan your architecture? Let&apos;s dive into the technical decisions.
          </p>
        </div>
      </Section>
    </div>
  );
}
