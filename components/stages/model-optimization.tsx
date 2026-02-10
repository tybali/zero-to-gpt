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
import { Zap, Minimize2, Cpu } from "lucide-react";

const QUANT_LEVELS = [
  { bits: "FP16", size: "140 GB", speed: "1x", quality: "100%", color: "#22c55e" },
  { bits: "INT8", size: "70 GB", speed: "1.5x", quality: "99.5%", color: "#84cc16" },
  { bits: "INT4", size: "35 GB", speed: "2x", quality: "98%", color: "#eab308" },
  { bits: "INT2", size: "17 GB", speed: "3x", quality: "90%", color: "#f97316" },
];

export function ModelOptimizationStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<Zap className="w-6 h-6 text-red-400" />}>
          Making It Fast and Small
        </SectionTitle>

        <Paragraph>
          A 70B model in FP16 requires 140GB of memory — far too much for most
          deployment scenarios. <strong>Optimization techniques</strong> like
          quantization and pruning make models smaller and faster while preserving
          quality.
        </Paragraph>

        <AnalogyBox title="Packing for a Trip">
          Optimization is like packing a suitcase. The full wardrobe (FP16) won&apos;t
          fit, so you pick versatile items (quantization), leave behind rarely-worn
          clothes (pruning), and roll everything tight (efficient formats). You
          still look great with 1/4 the luggage.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "4x", label: "Size Reduction (INT4)", color: "#ef4444" },
            { value: "2-3x", label: "Speed Increase" },
            { value: "~2%", label: "Quality Loss" },
            { value: "Consumer GPU", label: "Now Possible" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Minimize2 className="w-6 h-6 text-red-400" />}>
          Quantization Levels
        </SectionTitle>

        <div className="space-y-3">
          {QUANT_LEVELS.map((q) => (
            <Card key={q.bits} className="p-4 bg-card/50 border-white/10">
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: `${q.color}20`, color: q.color }} className="font-mono">
                  {q.bits}
                </Badge>
                <div className="flex gap-6 text-sm">
                  <span><span className="text-muted-foreground">Size:</span> {q.size}</span>
                  <span><span className="text-muted-foreground">Speed:</span> {q.speed}</span>
                  <span><span className="text-muted-foreground">Quality:</span> {q.quality}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <TechDetail>
          <p className="text-xs mb-2">Quantization methods:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>GPTQ:</strong> Optimal brain quantization, calibration required</li>
            <li><strong>AWQ:</strong> Activation-aware, protects important weights</li>
            <li><strong>GGUF:</strong> llama.cpp format, CPU-friendly</li>
            <li><strong>bitsandbytes:</strong> Dynamic quantization for training</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Cpu className="w-6 h-6 text-red-400" />}>
          Other Optimization Techniques
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">✂️ Pruning</h4>
            <p className="text-sm text-muted-foreground">
              Remove unimportant weights (near-zero values). Structured pruning
              removes entire neurons/heads for actual speedup.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🎓 Distillation</h4>
            <p className="text-sm text-muted-foreground">
              Train a smaller &quot;student&quot; model to mimic a larger &quot;teacher.&quot;
              Can achieve 90% quality at 10% size.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">🔗 Speculative Decoding</h4>
            <p className="text-sm text-muted-foreground">
              Draft with small model, verify with large model. 2-3x speedup
              with identical outputs.
            </p>
          </Card>
          <Card className="p-4 bg-card/50 border-white/10">
            <h4 className="font-semibold mb-2">📦 KV Cache Compression</h4>
            <p className="text-sm text-muted-foreground">
              Quantize or evict old KV cache entries. Critical for long-context
              inference.
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>INT4 quantization cuts size by 4x with ~2% quality loss</li>
            <li>GPTQ and AWQ are most popular quantization methods</li>
            <li>Distillation creates smaller models that match large ones</li>
            <li>Speculative decoding gives free speedup</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
