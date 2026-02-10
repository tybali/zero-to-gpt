"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Section,
  SectionTitle,
  Paragraph,
  AnalogyBox,
  TechDetail,
  StatGrid,
  InfoBox,
} from "@/components/shared/stage-layout";
import { TrendingUp, Calculator, Sparkles } from "lucide-react";

export function ScalingLawsStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<TrendingUp className="w-6 h-6 text-fuchsia-400" />}>
          The Science of Getting Bigger
        </SectionTitle>

        <Paragraph>
          One of the most surprising discoveries in AI is that language model performance
          follows predictable <strong>scaling laws</strong>. Double the compute, and you
          get a predictable improvement. This allows researchers to plan massive training
          runs with confidence.
        </Paragraph>

        <AnalogyBox title="Like Moore's Law for AI">
          Just as Moore&apos;s Law predicted transistor density doubling every 2 years,
          scaling laws predict how model quality improves with more data, parameters,
          and compute. It&apos;s remarkably consistent across orders of magnitude.
        </AnalogyBox>
      </Section>

      <Section>
        <SectionTitle icon={<Calculator className="w-6 h-6 text-fuchsia-400" />}>
          The Chinchilla Insight
        </SectionTitle>

        <Paragraph>
          The 2022 Chinchilla paper showed that many models were undertrained.
          For optimal performance, you should scale parameters AND data together.
          The rule of thumb: ~20 tokens per parameter.
        </Paragraph>

        <Card className="p-6 bg-card/50 border-white/10 mb-6">
          <div className="text-center mb-4 font-mono text-lg">
            Optimal Tokens ≈ 20 × Parameters
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-fuchsia-500/10">
              <div className="text-xl font-bold">7B</div>
              <div className="text-sm text-muted-foreground">Parameters</div>
              <div className="text-fuchsia-400 font-mono text-sm mt-1">→ 140B tokens</div>
            </div>
            <div className="p-4 rounded-lg bg-fuchsia-500/10">
              <div className="text-xl font-bold">70B</div>
              <div className="text-sm text-muted-foreground">Parameters</div>
              <div className="text-fuchsia-400 font-mono text-sm mt-1">→ 1.4T tokens</div>
            </div>
            <div className="p-4 rounded-lg bg-fuchsia-500/10">
              <div className="text-xl font-bold">175B</div>
              <div className="text-sm text-muted-foreground">Parameters</div>
              <div className="text-fuchsia-400 font-mono text-sm mt-1">→ 3.5T tokens</div>
            </div>
          </div>
        </Card>

        <TechDetail>
          <p className="mb-2">Chinchilla Scaling Law:</p>
          <div className="font-mono text-sm mb-2">L(N, D) = A/N^α + B/D^β + C</div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>N = number of parameters</li>
            <li>D = number of training tokens</li>
            <li>α ≈ 0.34, β ≈ 0.28</li>
            <li>Optimal ratio: D ≈ 20N</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Sparkles className="w-6 h-6 text-fuchsia-400" />}>
          Emergent Abilities
        </SectionTitle>

        <Paragraph>
          At certain scale thresholds, models suddenly gain new capabilities that
          weren&apos;t present at smaller scales. These &quot;emergent abilities&quot; include
          multi-step reasoning, chain-of-thought, and in-context learning.
        </Paragraph>

        <div className="space-y-3">
          {[
            { size: "~1B", abilities: "Basic language understanding, simple Q&A" },
            { size: "~10B", abilities: "Few-shot learning, basic reasoning" },
            { size: "~100B", abilities: "Chain-of-thought, complex reasoning, code generation" },
            { size: "~1T", abilities: "Multi-modal, agentic capabilities, expert-level tasks" },
          ].map((tier) => (
            <Card key={tier.size} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-center gap-4">
                <Badge className="bg-fuchsia-500/20 text-fuchsia-400 font-mono">
                  {tier.size}
                </Badge>
                <span className="text-sm text-muted-foreground">{tier.abilities}</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Scaling laws allow prediction of model performance</li>
            <li>Chinchilla: Use ~20 tokens per parameter for optimal training</li>
            <li>Emergent abilities appear at scale thresholds</li>
            <li>Compute-optimal training balances parameters and data</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
