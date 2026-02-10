"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Rocket, Server, Zap } from "lucide-react";

const SERVING_FRAMEWORKS = [
  { name: "vLLM", desc: "PagedAttention, continuous batching", speed: "High", ease: "Medium" },
  { name: "TensorRT-LLM", desc: "NVIDIA optimized, best for H100", speed: "Highest", ease: "Low" },
  { name: "Text Generation Inference", desc: "HuggingFace, production-ready", speed: "High", ease: "High" },
  { name: "llama.cpp", desc: "CPU inference, quantization", speed: "Medium", ease: "High" },
];

export function DeploymentServingStage() {
  const [temperature, setTemperature] = useState([0.7]);
  const [generating, setGenerating] = useState(false);
  const [tokens, setTokens] = useState<string[]>([]);

  const RESPONSE = ["The", " moon", " is", " Earth's", " natural", " satellite", ",", " orbiting", " at", " 384,400", " km", "."];

  const generate = () => {
    setGenerating(true);
    setTokens([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= RESPONSE.length) {
        clearInterval(interval);
        setGenerating(false);
        return;
      }
      setTokens(prev => [...prev, RESPONSE[i]]);
      i++;
    }, 100);
  };

  return (
    <div>
      <Section>
        <SectionTitle icon={<Rocket className="w-6 h-6 text-rose-400" />}>
          Launching to the World
        </SectionTitle>

        <Paragraph>
          You&apos;ve trained and optimized your model. Now it needs to serve millions
          of users. <strong>Inference serving</strong> is about making the model
          fast, reliable, and cost-effective at scale.
        </Paragraph>

        <AnalogyBox title="Opening a Restaurant">
          Training is like perfecting recipes. Deployment is opening the restaurant —
          handling rush hour (high concurrency), keeping dishes warm (KV caching),
          and not making customers wait too long (latency optimization).
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "<100ms", label: "P50 Latency Goal", color: "#f43f5e" },
            { value: "1000+", label: "Requests/Second" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "$0.01", label: "Per 1K Tokens" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Zap className="w-6 h-6 text-rose-400" />}>
          Token-by-Token Generation
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Temperature: {temperature[0]}</span>
              <span className="text-xs text-muted-foreground">
                {temperature[0] < 0.3 ? "Deterministic" : temperature[0] > 1 ? "Creative" : "Balanced"}
              </span>
            </div>
            <Slider value={temperature} onValueChange={setTemperature} min={0} max={1.5} step={0.1} />
          </div>

          <div className="p-4 bg-background/50 rounded-lg mb-4 min-h-16">
            <span className="text-muted-foreground">Q: What is the moon?</span>
            <br />
            <span className="text-green-400">A: </span>
            {tokens.map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={i === tokens.length - 1 ? "bg-green-500/30 rounded" : ""}
              >
                {t}
              </motion.span>
            ))}
            {generating && <span className="animate-pulse">▌</span>}
          </div>

          <Button
            onClick={generate}
            disabled={generating}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600"
          >
            {generating ? "Generating..." : "Generate Response"}
          </Button>
        </Card>
      </Section>

      <Section>
        <SectionTitle icon={<Server className="w-6 h-6 text-rose-400" />}>
          Serving Frameworks
        </SectionTitle>

        <div className="space-y-3">
          {SERVING_FRAMEWORKS.map((f) => (
            <Card key={f.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{f.name}</span>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Speed: {f.speed}</Badge>
                  <Badge variant="outline" className="text-xs">Ease: {f.ease}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <TechDetail>
          <p className="text-xs mb-2">Key optimization techniques:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>KV Caching:</strong> Reuse computed attention for previous tokens</li>
            <li><strong>Continuous Batching:</strong> Add new requests mid-generation</li>
            <li><strong>PagedAttention:</strong> Virtual memory for KV cache (vLLM)</li>
            <li><strong>Speculative Decoding:</strong> Draft+verify for 2-3x speedup</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>vLLM and TensorRT-LLM are leading serving frameworks</li>
            <li>KV caching is essential for fast inference</li>
            <li>Continuous batching maximizes GPU utilization</li>
            <li>Target &lt;100ms latency for good user experience</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
