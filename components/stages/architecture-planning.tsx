"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
import { Cpu, DollarSign, Users, Server, Zap } from "lucide-react";

const TEAM_ROLES = [
  { role: "ML Research Scientists", count: "5-20", desc: "Design architecture, run experiments" },
  { role: "ML Engineers", count: "10-50", desc: "Build training infrastructure, optimize" },
  { role: "Data Engineers", count: "5-15", desc: "Data pipelines, quality, preprocessing" },
  { role: "Infrastructure/DevOps", count: "5-20", desc: "GPU clusters, networking, storage" },
  { role: "Safety & Alignment", count: "3-10", desc: "Red teaming, RLHF, evaluations" },
  { role: "Product/PM", count: "2-5", desc: "Roadmap, requirements, stakeholders" },
];

const GPU_TYPES = [
  { name: "NVIDIA A100 (40GB)", tflops: 312, memory: "40 GB", cost: "$2/hr" },
  { name: "NVIDIA A100 (80GB)", tflops: 312, memory: "80 GB", cost: "$3/hr" },
  { name: "NVIDIA H100 (80GB)", tflops: 989, memory: "80 GB", cost: "$4/hr" },
  { name: "NVIDIA H200", tflops: 989, memory: "141 GB", cost: "$5/hr" },
];

export function ArchitecturePlanningStage() {
  const [modelSize, setModelSize] = useState([70]);
  const [contextLength, setContextLength] = useState([8]);

  // Simple cost estimation
  const estimatedGPUs = Math.ceil(modelSize[0] * 2); // Rough estimate
  const trainingDays = Math.ceil(modelSize[0] * 0.5);
  const estimatedCost = estimatedGPUs * 3 * 24 * trainingDays; // GPU * $/hr * hrs * days

  return (
    <div>
      <Section>
        <SectionTitle icon={<Cpu className="w-6 h-6 text-violet-400" />}>
          Model Architecture Decisions
        </SectionTitle>

        <Paragraph>
          Before writing a single line of code, you need to make fundamental decisions
          about your model&apos;s architecture. These choices will determine everything
          from training cost to final capabilities.
        </Paragraph>

        <AnalogyBox title="Building a Skyscraper">
          Think of model architecture like designing a building. You need to decide:
          how tall (parameters), how wide (hidden dimensions), how many floors
          (layers), and how the elevators work (attention mechanisms). Once
          construction starts, major changes become extremely expensive.
        </AnalogyBox>
      </Section>

      <Section>
        <SectionTitle>Interactive Cost Estimator</SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Model Size</span>
                <span className="text-sm text-violet-400 font-mono">
                  {modelSize[0]}B parameters
                </span>
              </div>
              <Slider
                value={modelSize}
                onValueChange={setModelSize}
                min={1}
                max={400}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1B (small)</span>
                <span>70B (medium)</span>
                <span>400B (large)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Context Length</span>
                <span className="text-sm text-violet-400 font-mono">
                  {contextLength[0]}K tokens
                </span>
              </div>
              <Slider
                value={contextLength}
                onValueChange={setContextLength}
                min={2}
                max={128}
                step={2}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2K</span>
                <span>32K</span>
                <span>128K</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">
                  ~{estimatedGPUs.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">H100 GPUs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">
                  ~{trainingDays} days
                </div>
                <div className="text-xs text-muted-foreground">Training Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  ${(estimatedCost / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
              </div>
            </div>
          </div>
        </Card>

        <TechDetail title="How These Numbers Are Calculated">
          <p className="mb-2">Training compute is typically measured in FLOPs (floating point operations):</p>
          <div className="bg-black/30 p-3 rounded font-mono text-xs mb-2">
            FLOPs ≈ 6 × N × D
          </div>
          <p className="text-xs mb-2">Where N = parameters, D = training tokens</p>
          <p className="text-xs">
            For a 70B model trained on 2T tokens: ~840 × 10²¹ FLOPs = ~10,000 H100-hours
          </p>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Server className="w-6 h-6 text-violet-400" />}>
          GPU Infrastructure
        </SectionTitle>

        <Paragraph>
          LLM training requires massive GPU clusters. The choice of GPU affects
          training speed, memory constraints, and cost efficiency.
        </Paragraph>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium">GPU</th>
                <th className="text-left py-3 px-4 font-medium">TFLOPs (FP16)</th>
                <th className="text-left py-3 px-4 font-medium">Memory</th>
                <th className="text-left py-3 px-4 font-medium">Cloud Cost</th>
              </tr>
            </thead>
            <tbody>
              {GPU_TYPES.map((gpu) => (
                <tr key={gpu.name} className="border-b border-white/5">
                  <td className="py-3 px-4 font-mono text-xs">{gpu.name}</td>
                  <td className="py-3 px-4">{gpu.tflops}</td>
                  <td className="py-3 px-4">{gpu.memory}</td>
                  <td className="py-3 px-4 text-green-400">{gpu.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBox type="info" title="H100 vs A100">
          The H100 delivers ~3x the training performance of A100 for LLMs due to
          improved Transformer Engine and higher memory bandwidth. For new projects,
          H100s are typically more cost-effective despite higher hourly rates.
        </InfoBox>
      </Section>

      <Section>
        <SectionTitle icon={<Users className="w-6 h-6 text-violet-400" />}>
          Team Structure
        </SectionTitle>

        <Paragraph>
          Building an LLM from scratch requires a multidisciplinary team. Here&apos;s
          a typical composition for a frontier model effort:
        </Paragraph>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_ROLES.map((role) => (
            <Card key={role.role} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{role.role}</h4>
                <Badge variant="outline" className="text-xs">
                  {role.count}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{role.desc}</p>
            </Card>
          ))}
        </div>

        <StatGrid
          stats={[
            { value: "50-150", label: "Total Team Size" },
            { value: "6-18", label: "Months Timeline" },
            { value: "$10-100M", label: "Annual Budget" },
            { value: "24/7", label: "Operations" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Zap className="w-6 h-6 text-violet-400" />}>
          Key Architecture Choices
        </SectionTitle>

        <div className="space-y-4">
          <Card className="p-5 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Decoder-only vs Encoder-Decoder</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Most modern LLMs use decoder-only architecture (GPT-style). It&apos;s simpler,
              scales better, and works well for generation tasks.
            </p>
            <Badge className="bg-violet-500/20 text-violet-400">
              Recommendation: Decoder-only
            </Badge>
          </Card>

          <Card className="p-5 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Attention Mechanism</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Multi-Head Attention (MHA), Grouped-Query Attention (GQA), or
              Multi-Query Attention (MQA). GQA offers a good balance of quality
              and inference speed.
            </p>
            <Badge className="bg-violet-500/20 text-violet-400">
              Recommendation: GQA for production
            </Badge>
          </Card>

          <Card className="p-5 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Positional Encoding</h4>
            <p className="text-sm text-muted-foreground mb-3">
              RoPE (Rotary Position Embedding) is the current standard. It enables
              context length extension after training and has good extrapolation.
            </p>
            <Badge className="bg-violet-500/20 text-violet-400">
              Recommendation: RoPE
            </Badge>
          </Card>

          <Card className="p-5 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">Normalization</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Pre-LayerNorm (Pre-LN) with RMSNorm is standard. More stable training
              than Post-LN, and RMSNorm is faster than full LayerNorm.
            </p>
            <Badge className="bg-violet-500/20 text-violet-400">
              Recommendation: Pre-LN with RMSNorm
            </Badge>
          </Card>
        </div>

        <TechDetail>
          <p className="mb-2">Modern architecture formula (e.g., Llama 2):</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Pre-normalization using RMSNorm</li>
            <li>SwiGLU activation function</li>
            <li>Rotary positional embeddings (RoPE)</li>
            <li>Grouped-Query Attention (GQA)</li>
            <li>No bias terms in linear layers</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Model size determines compute requirements exponentially</li>
            <li>H100 GPUs offer best price/performance for training</li>
            <li>Plan for 50-150 person team for frontier models</li>
            <li>Use decoder-only, GQA, RoPE, and RMSNorm as baseline</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
