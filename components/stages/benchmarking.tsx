"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Section,
  SectionTitle,
  Paragraph,
  AnalogyBox,
  TechDetail,
  InfoBox,
} from "@/components/shared/stage-layout";
import { BarChart3, Shield, Target } from "lucide-react";

const BENCHMARKS = [
  { name: "MMLU", score: 86.4, category: "Knowledge", desc: "57 subjects from STEM to humanities" },
  { name: "HumanEval", score: 67.0, category: "Coding", desc: "Python function completion" },
  { name: "GSM8K", score: 92.0, category: "Math", desc: "Grade school math word problems" },
  { name: "HellaSwag", score: 95.3, category: "Reasoning", desc: "Commonsense inference" },
  { name: "TruthfulQA", score: 59.0, category: "Safety", desc: "Truthfulness on tricky questions" },
  { name: "MT-Bench", score: 9.0, category: "Chat", desc: "Multi-turn conversation quality" },
];

export function BenchmarkingStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<BarChart3 className="w-6 h-6 text-cyan-400" />}>
          Measuring Intelligence
        </SectionTitle>

        <Paragraph>
          How do you know if your model is actually good? <strong>Benchmarks</strong>
          provide standardized tests to compare models objectively. They cover
          knowledge, reasoning, coding, math, and safety.
        </Paragraph>

        <AnalogyBox title="Standardized Testing for AI">
          Just like students take SATs and GREs, AI models take standardized tests.
          MMLU is like a comprehensive exam covering 57 subjects. HumanEval tests
          coding ability. These scores let us compare models fairly.
        </AnalogyBox>
      </Section>

      <Section>
        <SectionTitle icon={<Target className="w-6 h-6 text-cyan-400" />}>
          Key Benchmarks
        </SectionTitle>

        <div className="space-y-4">
          {BENCHMARKS.map((b) => (
            <Card key={b.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{b.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{b.category}</Badge>
                </div>
                <span className="text-cyan-400 font-mono font-bold">
                  {b.score}{b.name === "MT-Bench" ? "/10" : "%"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{b.desc}</p>
              <Progress value={b.name === "MT-Bench" ? b.score * 10 : b.score} className="h-2" />
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle icon={<Shield className="w-6 h-6 text-cyan-400" />}>
          Safety Evaluations
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🔴 Red Teaming</h4>
            <p className="text-sm text-muted-foreground">
              Human experts try to elicit harmful outputs through adversarial
              prompts, jailbreaks, and edge cases.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🛡️ Automated Attacks</h4>
            <p className="text-sm text-muted-foreground">
              Tools like GCG, AutoDAN generate adversarial prompts at scale
              to test robustness.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">⚖️ Bias Testing</h4>
            <p className="text-sm text-muted-foreground">
              Measure disparities in responses across demographics, topics,
              and perspectives.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🔍 Capability Elicitation</h4>
            <p className="text-sm text-muted-foreground">
              Probe for dangerous capabilities: bio/cyber weapons, deception,
              self-preservation.
            </p>
          </Card>
        </div>

        <TechDetail>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>MMLU:</strong> 5-shot, 57 subjects, ~14K questions</li>
            <li><strong>HumanEval:</strong> 164 Python problems, pass@k metric</li>
            <li><strong>MT-Bench:</strong> GPT-4 as judge, 80 conversations</li>
            <li><strong>Contamination:</strong> Major issue — test data in training</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Benchmarks enable objective model comparison</li>
            <li>MMLU, HumanEval, MT-Bench are most cited</li>
            <li>Safety evals require both automated and human testing</li>
            <li>Benchmark contamination is a growing concern</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
