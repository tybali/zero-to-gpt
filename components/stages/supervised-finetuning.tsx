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
import { GraduationCap, MessageSquare, Sparkles } from "lucide-react";

export function SupervisedFinetuningStage() {
  return (
    <div>
      <Section>
        <SectionTitle icon={<GraduationCap className="w-6 h-6 text-pink-400" />}>
          Teaching Instructions
        </SectionTitle>

        <Paragraph>
          After pre-training, the model can complete text but doesn&apos;t know how
          to be a helpful assistant. <strong>Supervised Fine-Tuning (SFT)</strong>
          teaches it to follow instructions by training on high-quality
          (instruction, response) pairs.
        </Paragraph>

        <AnalogyBox title="From Reader to Teacher">
          Pre-training is like reading every book in the library. SFT is like
          learning how to be a tutor — understanding questions, giving clear
          explanations, and being helpful rather than just reciting facts.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "10K-100K", label: "SFT Examples", color: "#ec4899" },
            { value: "~1-5 epochs", label: "Training" },
            { value: "Hours-Days", label: "Duration" },
            { value: "Quality > Quantity", label: "Key Insight" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<MessageSquare className="w-6 h-6 text-pink-400" />}>
          Chat Format
        </SectionTitle>

        <Card className="p-4 bg-card/50 border-white/10 font-mono text-sm">
          <div className="text-muted-foreground mb-2">&lt;|system|&gt;</div>
          <div className="pl-4 mb-2 text-blue-400">You are a helpful assistant.</div>
          <div className="text-muted-foreground mb-2">&lt;|user|&gt;</div>
          <div className="pl-4 mb-2">What is the capital of France?</div>
          <div className="text-muted-foreground mb-2">&lt;|assistant|&gt;</div>
          <div className="pl-4 text-green-400">The capital of France is Paris.</div>
        </Card>

        <TechDetail>
          <p className="text-xs mb-2">Key SFT considerations:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Quality matters more than quantity (LIMA paper)</li>
            <li>Diverse task coverage prevents overfitting</li>
            <li>Lower learning rate than pre-training (~1e-5)</li>
            <li>Often combined with LoRA for efficiency</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Sparkles className="w-6 h-6 text-pink-400" />}>
          LoRA: Efficient Fine-Tuning
        </SectionTitle>

        <Paragraph>
          LoRA (Low-Rank Adaptation) trains only small adapter matrices instead
          of updating all model weights. This reduces memory by 100x+ and allows
          fine-tuning on consumer hardware.
        </Paragraph>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-red-500/10 border-red-500/20">
            <h4 className="font-semibold text-red-400 mb-2">Full Fine-Tuning</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Update all 70B parameters</li>
              <li>• Requires 8×H100 GPUs</li>
              <li>• ~500GB memory</li>
              <li>• Expensive, slow</li>
            </ul>
          </Card>
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2">LoRA</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Train ~0.1% of parameters</li>
              <li>• Single GPU possible</li>
              <li>• ~16GB memory</li>
              <li>• Fast, affordable</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>SFT teaches models to follow instructions</li>
            <li>Quality of training data matters more than quantity</li>
            <li>LoRA enables efficient fine-tuning with minimal resources</li>
            <li>Chat templates standardize conversation format</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
