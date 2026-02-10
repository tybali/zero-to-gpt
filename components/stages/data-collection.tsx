"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Section,
  SectionTitle,
  Paragraph,
  AnalogyBox,
  TechDetail,
  StatGrid,
  InfoBox,
  InteractiveLabel,
} from "@/components/shared/stage-layout";
import { Globe, Database, BookOpen, Code, FileText, MessageSquare } from "lucide-react";

const DATA_SOURCES = [
  { icon: "🌐", name: "Common Crawl", count: "~3B pages/month", desc: "Open web crawl archive", size: "~400TB", color: "#3b82f6" },
  { icon: "📚", name: "Books", count: "~200K titles", desc: "Public domain + licensed", size: "~50GB", color: "#8b5cf6" },
  { icon: "📰", name: "News & Articles", count: "~500M articles", desc: "News archives, magazines", size: "~100GB", color: "#ec4899" },
  { icon: "💬", name: "Forums & Q&A", count: "~2B posts", desc: "Reddit, StackOverflow", size: "~200GB", color: "#f59e0b" },
  { icon: "🔬", name: "Scientific Papers", count: "~90M papers", desc: "arXiv, PubMed, Semantic Scholar", size: "~80GB", color: "#10b981" },
  { icon: "💻", name: "Code", count: "~50M repos", desc: "GitHub, GitLab", size: "~500GB", color: "#06b6d4" },
  { icon: "📖", name: "Wikipedia", count: "~60M articles", desc: "All languages", size: "~20GB", color: "#6366f1" },
  { icon: "🎭", name: "Creative Writing", count: "~10M works", desc: "Poetry, lyrics, stories", size: "~10GB", color: "#f43f5e" },
];

export function DataCollectionStage() {
  const [collecting, setCollecting] = useState(false);
  const [collected, setCollected] = useState<typeof DATA_SOURCES>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCollection = () => {
    setCollecting(true);
    setCollected([]);
    setTotalTokens(0);
    let idx = 0;

    intervalRef.current = setInterval(() => {
      if (idx >= DATA_SOURCES.length) {
        clearInterval(intervalRef.current!);
        setCollecting(false);
        return;
      }
      const currentIdx = idx;
      setCollected((prev) => [...prev, DATA_SOURCES[currentIdx]]);
      setTotalTokens((prev) => prev + Math.floor(Math.random() * 2000 + 500));
      idx++;
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = () => {
    setCollected([]);
    setTotalTokens(0);
  };

  return (
    <div>
      <Section>
        <SectionTitle icon={<Globe className="w-6 h-6 text-emerald-400" />}>
          Gathering the World&apos;s Knowledge
        </SectionTitle>

        <Paragraph>
          Every LLM starts with data — vast amounts of it. The quality and diversity
          of your training data directly determines what your model can learn.
          Modern LLMs are trained on <strong>trillions of tokens</strong> from
          across the internet and beyond.
        </Paragraph>

        <AnalogyBox title="Filling the World's Biggest Library">
          Imagine trying to build a brain that knows everything. First, you&apos;d
          need to read every book ever written, every website, every conversation.
          That&apos;s what data collection is — assembling humanity&apos;s collective
          knowledge into a format a computer can learn from.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "~15T", label: "Tokens (typical)", color: "#10b981" },
            { value: "~45TB", label: "Raw Text" },
            { value: "300+", label: "Languages" },
            { value: "~8B", label: "Web Pages" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Database className="w-6 h-6 text-emerald-400" />}>
          Data Source Simulator
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          {!collecting && collected.length === 0 && (
            <Button
              onClick={startCollection}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
              size="lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              Start Crawling the Internet!
            </Button>
          )}

          {(collecting || collected.length > 0) && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {collected.map((source, i) => (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: `${source.color}10`,
                      borderColor: `${source.color}30`,
                    }}
                  >
                    <div className="text-2xl mb-2">{source.icon}</div>
                    <div className="text-sm font-semibold" style={{ color: source.color }}>
                      {source.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{source.count}</div>
                  </motion.div>
                ))}
              </div>

              {collecting && (
                <div className="text-center text-sm text-muted-foreground">
                  <div className="animate-pulse">
                    Crawling... {collected.length}/{DATA_SOURCES.length} sources
                  </div>
                  <Progress value={(collected.length / DATA_SOURCES.length) * 100} className="mt-2" />
                </div>
              )}

              {!collecting && collected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="text-2xl font-bold text-emerald-400">
                    ✅ {totalTokens.toLocaleString()} billion tokens collected!
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    From {collected.length} sources across the internet
                  </div>
                  <Button variant="outline" size="sm" className="mt-3" onClick={reset}>
                    Reset Simulation
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle>Major Data Sources</SectionTitle>

        <div className="space-y-4">
          {DATA_SOURCES.map((source) => (
            <Card key={source.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{source.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{source.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {source.size}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{source.desc}</p>
                  <p className="text-xs text-emerald-400 mt-1">{source.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <TechDetail title="Common Crawl Deep Dive">
          <p className="mb-2">Common Crawl is the largest open web archive:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Monthly crawls since 2008, ~3 billion pages per crawl</li>
            <li>Available in WARC format (raw HTML) or WET (extracted text)</li>
            <li>Total archive size: ~400TB compressed</li>
            <li>Requires significant filtering — only 10-15% is usable</li>
            <li>Free to download from AWS S3 (pay for egress)</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle>Data Licensing Considerations</SectionTitle>

        <InfoBox type="warning" title="Legal Complexity">
          Data licensing for LLMs is legally complex and rapidly evolving.
          Major considerations include copyright, fair use, robots.txt compliance,
          and regional regulations (GDPR, CCPA). Many companies face ongoing
          lawsuits over training data usage.
        </InfoBox>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2">✅ Safer Sources</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Public domain books</li>
              <li>• Open-access papers (arXiv)</li>
              <li>• Permissively licensed code</li>
              <li>• Wikipedia (CC-BY-SA)</li>
              <li>• Government documents</li>
            </ul>
          </Card>
          <Card className="p-4 bg-red-500/10 border-red-500/20">
            <h4 className="font-semibold text-red-400 mb-2">⚠️ Riskier Sources</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Copyrighted books</li>
              <li>• Paywalled articles</li>
              <li>• Social media (ToS issues)</li>
              <li>• Proprietary code</li>
              <li>• Personal data/PII</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>LLMs require trillions of tokens from diverse sources</li>
            <li>Common Crawl is the foundation but needs heavy filtering</li>
            <li>Data quality matters more than raw quantity</li>
            <li>Licensing is a major legal consideration</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
