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
import { Lightbulb, Zap, Cpu, Layers } from "lucide-react";

const INNOVATIONS = [
  {
    name: "Flash Attention",
    year: 2022,
    speedup: "2-4x",
    description: "IO-aware attention that reduces memory reads/writes",
    impact: "Enables longer context, faster training",
    color: "#f59e0b",
  },
  {
    name: "RoPE",
    year: 2021,
    speedup: "Context extension",
    description: "Rotary Position Embedding for relative positions",
    impact: "Better extrapolation to longer sequences",
    color: "#10b981",
  },
  {
    name: "GQA",
    year: 2023,
    speedup: "1.5-2x inference",
    description: "Grouped-Query Attention shares KV heads",
    impact: "Faster inference with minimal quality loss",
    color: "#8b5cf6",
  },
  {
    name: "MoE",
    year: 2022,
    speedup: "8x parameters/FLOP",
    description: "Mixture of Experts activates subset of weights",
    impact: "Scale parameters without scaling compute",
    color: "#ec4899",
  },
  {
    name: "SwiGLU",
    year: 2020,
    speedup: "Better quality",
    description: "Gated activation function combining Swish + GLU",
    impact: "Improved performance over ReLU/GELU",
    color: "#06b6d4",
  },
  {
    name: "RMSNorm",
    year: 2019,
    speedup: "~10% faster",
    description: "Simplified normalization without mean centering",
    impact: "Faster than LayerNorm, similar quality",
    color: "#84cc16",
  },
];

export function ModernInnovationsStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<Lightbulb className="w-6 h-6 text-purple-400" />}>
          State-of-the-Art Improvements
        </SectionTitle>

        <Paragraph>
          The original 2017 Transformer has been significantly improved. Modern LLMs
          incorporate numerous optimizations that enable longer context, faster
          training, and more efficient inference.
        </Paragraph>

        <AnalogyBox title="Tuning a Race Car">
          The original Transformer is like a solid car that wins races. But engineers
          keep finding ways to make it faster — better aerodynamics (Flash Attention),
          lighter materials (GQA), more efficient engines (MoE). Each improvement
          compounds, and today&apos;s models are dramatically more capable.
        </AnalogyBox>
      </Section>

      <Section>
        <SectionTitle icon={<Zap className="w-6 h-6 text-purple-400" />}>
          Key Innovations
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          {INNOVATIONS.map((innovation) => (
            <Card
              key={innovation.name}
              className="p-5 bg-card/50 border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <Badge style={{ backgroundColor: `${innovation.color}20`, color: innovation.color }}>
                  {innovation.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{innovation.year}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{innovation.description}</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs text-muted-foreground">{innovation.impact}</span>
                <Badge variant="outline" className="text-xs" style={{ color: innovation.color }}>
                  {innovation.speedup}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle icon={<Cpu className="w-6 h-6 text-purple-400" />}>
          Flash Attention Deep Dive
        </SectionTitle>

        <Paragraph>
          Flash Attention is arguably the most impactful recent optimization. Standard
          attention is memory-bound — it reads/writes the full attention matrix to
          GPU memory. Flash Attention uses tiling and recomputation to keep everything
          in fast SRAM.
        </Paragraph>

        <StatGrid
          stats={[
            { value: "2-4x", label: "Speedup", color: "#f59e0b" },
            { value: "5-20x", label: "Memory Savings" },
            { value: "O(N)", label: "Memory (vs O(N²))" },
            { value: "Exact", label: "No Approximation" },
          ]}
        />

        <TechDetail title="How Flash Attention Works">
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Tiles Q, K, V matrices into blocks that fit in SRAM</li>
            <li>Computes attention per-block, accumulates results</li>
            <li>Uses online softmax to avoid storing full attention matrix</li>
            <li>Recomputes attention in backward pass (cheaper than storing)</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Layers className="w-6 h-6 text-purple-400" />}>
          Mixture of Experts (MoE)
        </SectionTitle>

        <Paragraph>
          MoE models like Mixtral have 8x the parameters but only activate a fraction
          per token. A &quot;router&quot; network decides which expert(s) process each token.
        </Paragraph>

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🧠 → 🎯 → 🔧🔧</div>
            <div className="text-sm text-muted-foreground">
              Token → Router → Top-2 Experts (out of 8)
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-2xl font-bold text-purple-400">46.7B</div>
              <div className="text-muted-foreground">Total Params</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">12.9B</div>
              <div className="text-muted-foreground">Active Params</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">3.6x</div>
              <div className="text-muted-foreground">Efficiency Gain</div>
            </div>
          </div>
        </Card>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Flash Attention enables 2-4x speedup and longer context</li>
            <li>RoPE allows context extension beyond training length</li>
            <li>GQA reduces inference costs with minimal quality impact</li>
            <li>MoE scales parameters without proportional compute increase</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
