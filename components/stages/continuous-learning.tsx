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
import { RefreshCw, BarChart3, AlertTriangle, GitBranch } from "lucide-react";

export function ContinuousLearningStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<RefreshCw className="w-6 h-6 text-lime-400" />}>
          The Never-Ending Journey
        </SectionTitle>

        <Paragraph>
          Deploying your model isn&apos;t the end — it&apos;s the beginning. Production
          LLMs require continuous monitoring, feedback collection, and periodic
          updates to stay relevant and safe.
        </Paragraph>

        <AnalogyBox title="Like Maintaining a Garden">
          A garden doesn&apos;t tend itself. You must water it (respond to feedback),
          prune dead branches (fix errors), plant new seeds (add capabilities),
          and watch for pests (safety issues). LLMs need the same ongoing care.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "24/7", label: "Monitoring", color: "#84cc16" },
            { value: "Daily", label: "Feedback Review" },
            { value: "Weekly", label: "Safety Audits" },
            { value: "Monthly", label: "Model Updates" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<BarChart3 className="w-6 h-6 text-lime-400" />}>
          Key Metrics to Monitor
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Latency (P50/P99)", desc: "Response time at 50th/99th percentile", icon: "⏱️" },
            { name: "Throughput", desc: "Requests per second, tokens per second", icon: "📈" },
            { name: "Error Rate", desc: "Failed requests, timeouts, 5xx errors", icon: "❌" },
            { name: "User Satisfaction", desc: "Thumbs up/down, regeneration rate", icon: "👍" },
            { name: "Safety Violations", desc: "Harmful outputs, refusal rate", icon: "🛡️" },
            { name: "Cost per Query", desc: "Compute, API calls, storage", icon: "💰" },
          ].map((m) => (
            <Card key={m.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle icon={<AlertTriangle className="w-6 h-6 text-lime-400" />}>
          Drift Detection
        </SectionTitle>

        <Paragraph>
          Models can degrade over time as the world changes. News events, new
          slang, and evolving user needs can make your model less relevant.
        </Paragraph>

        <div className="space-y-3">
          {[
            { type: "Data Drift", desc: "Input distribution shifts from training data", action: "Collect new data, retrain" },
            { type: "Concept Drift", desc: "Meaning of concepts changes over time", action: "Update knowledge, RAG" },
            { type: "Performance Drift", desc: "Quality degrades on new use cases", action: "Fine-tune on feedback" },
          ].map((d) => (
            <Card key={d.type} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{d.type}</div>
                  <div className="text-sm text-muted-foreground">{d.desc}</div>
                </div>
                <Badge variant="outline" className="text-xs text-lime-400">{d.action}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle icon={<GitBranch className="w-6 h-6 text-lime-400" />}>
          MLOps Best Practices
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🔄 Version Control</h4>
            <p className="text-sm text-muted-foreground">
              Track model versions, data versions, and config changes.
              Enable rollback if issues arise.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🧪 A/B Testing</h4>
            <p className="text-sm text-muted-foreground">
              Test new models on subset of traffic before full rollout.
              Compare metrics head-to-head.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">📝 Feedback Loops</h4>
            <p className="text-sm text-muted-foreground">
              Collect user feedback (ratings, edits, regenerations).
              Use for continuous fine-tuning.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🚨 Incident Response</h4>
            <p className="text-sm text-muted-foreground">
              Have playbooks for safety incidents. Enable quick model
              rollback or output filtering.
            </p>
          </Card>
        </div>

        <TechDetail>
          <p className="text-xs mb-2">Continuous learning pipeline:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Collect user feedback → Label → Fine-tune</li>
            <li>Shadow deployment → A/B test → Gradual rollout</li>
            <li>Monitor → Detect drift → Trigger retraining</li>
            <li>Automate with MLflow, Weights & Biases, or custom</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Congratulations! 🎉">
          <p className="mb-2">
            You&apos;ve completed the entire LLM lifecycle journey — from Day 0 research
            to production MLOps!
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>16 stages across 8 phases</li>
            <li>From data collection to continuous learning</li>
            <li>Interactive simulations and technical deep-dives</li>
            <li>Ready to build your own LLM!</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
