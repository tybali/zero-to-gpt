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
import { Server, Network, Cpu, HardDrive } from "lucide-react";

export function TrainingInfrastructureStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<Server className="w-6 h-6 text-amber-400" />}>
          Building the Compute Cluster
        </SectionTitle>

        <Paragraph>
          Training a frontier LLM requires thousands of GPUs working in perfect
          coordination. This infrastructure is one of the most expensive and complex
          parts of the entire project.
        </Paragraph>

        <AnalogyBox title="An Orchestra of GPUs">
          Training an LLM is like conducting a massive orchestra where thousands
          of musicians (GPUs) must play in perfect synchronization. If one goes
          out of tune or pauses, the entire performance suffers.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "10K+", label: "H100 GPUs", color: "#f59e0b" },
            { value: "400 Gbps", label: "Interconnect" },
            { value: "100+ PB", label: "Storage" },
            { value: "99.9%", label: "Uptime Required" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Network className="w-6 h-6 text-amber-400" />}>
          Parallelism Strategies
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: "Data Parallelism", desc: "Same model on all GPUs, different data batches", icon: "📊" },
            { name: "Tensor Parallelism", desc: "Split individual layers across GPUs", icon: "🔲" },
            { name: "Pipeline Parallelism", desc: "Different layers on different GPUs", icon: "🔗" },
            { name: "Sequence Parallelism", desc: "Split long sequences across GPUs", icon: "📏" },
          ].map((p) => (
            <Card key={p.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <TechDetail title="3D Parallelism (Megatron-LM)">
          <p className="text-xs mb-2">Combines all three parallelism types:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Data Parallel: 8 copies</li>
            <li>Tensor Parallel: 8-way within node</li>
            <li>Pipeline Parallel: 16 stages</li>
            <li>Total: 8 × 8 × 16 = 1024 GPUs</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<HardDrive className="w-6 h-6 text-amber-400" />}>
          Key Frameworks
        </SectionTitle>

        <div className="grid gap-3">
          {[
            { name: "DeepSpeed", org: "Microsoft", feature: "ZeRO optimizer, memory efficiency" },
            { name: "FSDP", org: "PyTorch", feature: "Fully Sharded Data Parallel" },
            { name: "Megatron-LM", org: "NVIDIA", feature: "3D parallelism, efficient attention" },
            { name: "JAX/Pax", org: "Google", feature: "TPU optimization, XLA compilation" },
          ].map((f) => (
            <Card key={f.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({f.org})</span>
                </div>
                <Badge variant="outline" className="text-xs">{f.feature}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Large LLMs require 1000s of GPUs with fast interconnects</li>
            <li>3D parallelism combines data, tensor, and pipeline parallelism</li>
            <li>DeepSpeed ZeRO dramatically reduces memory requirements</li>
            <li>Checkpointing is critical for recovering from failures</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
