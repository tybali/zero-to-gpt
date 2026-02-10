"use client";

import { useState } from "react";
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
import { Filter, Trash2, Shield, Sparkles, CheckCircle } from "lucide-react";

const CLEANING_STEPS = [
  { name: "Deduplication", desc: "Remove near-duplicate documents", removal: "~30%", icon: "🔄" },
  { name: "Language Detection", desc: "Filter to target languages", removal: "~10%", icon: "🌍" },
  { name: "Quality Filtering", desc: "Remove low-quality content", removal: "~25%", icon: "⭐" },
  { name: "Toxicity Removal", desc: "Filter harmful content", removal: "~5%", icon: "🛡️" },
  { name: "PII Scrubbing", desc: "Remove personal information", removal: "~2%", icon: "🔒" },
  { name: "Boilerplate Removal", desc: "Strip ads, navigation, headers", removal: "~15%", icon: "✂️" },
];

const SAMPLE_TEXTS = {
  before: `<html><head><title>Buy Cheap Pills Online!!!</title></head><body>
<nav>Home | About | Contact</nav>
<div class="ad">CLICK HERE FOR FREE IPHONE</div>
<p>The quick brown fox jumps over the lazy dog.</p>
<p>The quick brown fox jumps over the lazy dog.</p>
<p>Call John at 555-123-4567 or email john@email.com</p>
<footer>© 2024 | Privacy Policy</footer>
</body></html>`,
  after: `The quick brown fox jumps over the lazy dog.`,
};

export function DataProcessingStage() {
  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showCleaned, setShowCleaned] = useState(false);

  const runCleaning = () => {
    setProcessing(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= CLEANING_STEPS.length) {
        clearInterval(interval);
        setProcessing(false);
        setShowCleaned(true);
        return;
      }
      setActiveStep(step);
      step++;
    }, 800);
  };

  return (
    <div>
      <Section>
        <SectionTitle icon={<Filter className="w-6 h-6 text-green-400" />}>
          Cleaning the Chaos
        </SectionTitle>

        <Paragraph>
          Raw internet data is incredibly messy. Before training, we must clean,
          filter, and deduplicate the data — often removing <strong>70-90%</strong> of
          what we collected. Quality matters far more than quantity.
        </Paragraph>

        <AnalogyBox title="Panning for Gold">
          Imagine you&apos;ve collected tons of river sand hoping to find gold.
          Most of it is worthless dirt, rocks, and debris. Data cleaning is like
          carefully sifting through everything to extract only the valuable nuggets
          — the high-quality text that will actually teach your model something useful.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "70-90%", label: "Data Removed", color: "#ef4444" },
            { value: "~30%", label: "Duplicates" },
            { value: "99.9%", label: "PII Recall Target" },
            { value: "Weeks", label: "Processing Time" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Trash2 className="w-6 h-6 text-green-400" />}>
          Cleaning Pipeline Simulator
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10 mb-6">
          {!processing && !showCleaned && (
            <Button onClick={runCleaning} className="w-full bg-gradient-to-r from-green-600 to-emerald-600" size="lg">
              <Filter className="w-5 h-5 mr-2" />
              Run Cleaning Pipeline
            </Button>
          )}

          {(processing || showCleaned) && (
            <div className="space-y-4">
              {CLEANING_STEPS.map((step, i) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: i <= activeStep || showCleaned ? 1 : 0.3 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    i === activeStep && processing
                      ? "bg-green-500/10 border-green-500/50"
                      : i < activeStep || showCleaned
                      ? "bg-card border-white/10"
                      : "border-white/5"
                  }`}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs text-muted-foreground">{step.desc}</div>
                  </div>
                  <Badge variant="outline" className="text-red-400">
                    -{step.removal}
                  </Badge>
                  {(i < activeStep || showCleaned) && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </motion.div>
              ))}

              {showCleaned && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
                >
                  <div className="text-xl font-bold text-green-400">Pipeline Complete!</div>
                  <div className="text-sm text-muted-foreground">
                    ~87% of data removed, high-quality corpus ready
                  </div>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowCleaned(false)}>
                    Reset
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-red-500/5 border-red-500/20">
            <h4 className="font-semibold text-red-400 mb-2">Before Cleaning</h4>
            <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-muted-foreground">
              {SAMPLE_TEXTS.before}
            </pre>
          </Card>
          <Card className="p-4 bg-green-500/5 border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2">After Cleaning</h4>
            <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-muted-foreground">
              {SAMPLE_TEXTS.after}
            </pre>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionTitle icon={<Shield className="w-6 h-6 text-green-400" />}>
          Quality Filtering Techniques
        </SectionTitle>

        <div className="space-y-4">
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Perplexity Filtering</h4>
            <p className="text-sm text-muted-foreground">
              Use a small language model to score text quality. High perplexity
              indicates unusual/low-quality text. Remove documents above threshold.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">MinHash Deduplication</h4>
            <p className="text-sm text-muted-foreground">
              Convert documents to hash signatures, find near-duplicates efficiently.
              Removes ~30% of Common Crawl data.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Classifier-based Filtering</h4>
            <p className="text-sm text-muted-foreground">
              Train classifiers to identify spam, adult content, hate speech.
              Often combined with blocklist approaches.
            </p>
          </Card>
        </div>

        <TechDetail>
          <p className="mb-2">Key deduplication techniques:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Exact match:</strong> Hash entire documents (fast, misses variants)</li>
            <li><strong>MinHash/LSH:</strong> Approximate near-duplicate detection, O(1) lookup</li>
            <li><strong>Suffix arrays:</strong> Find repeated substrings at scale</li>
            <li><strong>Embedding similarity:</strong> Semantic deduplication (expensive)</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Expect to remove 70-90% of raw collected data</li>
            <li>Deduplication alone removes ~30% of web data</li>
            <li>Quality filtering using perplexity scores is highly effective</li>
            <li>PII removal is critical for legal and ethical compliance</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
