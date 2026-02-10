"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Brain, Layers, Eye, Zap, ArrowRight } from "lucide-react";

const TRANSFORMER_LAYERS = [
  { name: "Token Embedding", icon: "🔤", desc: "Convert tokens to vectors", detail: "Each token → 4096-dim vector" },
  { name: "Positional Encoding", icon: "📍", desc: "Add position information", detail: "RoPE: Rotary Position Embedding" },
  { name: "Self-Attention", icon: "👀", desc: "Tokens attend to each other", detail: "Multi-head attention (32-128 heads)" },
  { name: "Feed-Forward Network", icon: "⚡", desc: "Process attended info", detail: "2-layer MLP with SwiGLU activation" },
  { name: "Layer Normalization", icon: "⚖️", desc: "Stabilize activations", detail: "RMSNorm (faster than LayerNorm)" },
  { name: "Residual Connection", icon: "🔗", desc: "Skip connections for gradient flow", detail: "x + sublayer(x)" },
  { name: "Output Projection", icon: "📊", desc: "Project to vocabulary size", detail: "Hidden → 50K logits" },
  { name: "Softmax", icon: "🎯", desc: "Convert to probabilities", detail: "Temperature controls randomness" },
];

const ATTENTION_EXAMPLE = {
  sentence: "The cat sat on the mat because it was soft",
  query: "it",
  attentions: [
    { word: "The", score: 0.02 },
    { word: "cat", score: 0.15 },
    { word: "sat", score: 0.05 },
    { word: "on", score: 0.03 },
    { word: "the", score: 0.02 },
    { word: "mat", score: 0.45 },
    { word: "because", score: 0.08 },
    { word: "it", score: 0.05 },
    { word: "was", score: 0.05 },
    { word: "soft", score: 0.10 },
  ],
};

export function TransformerArchitectureStage() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [showAttention, setShowAttention] = useState(false);

  return (
    <div>
      <Section>
        <SectionTitle icon={<Brain className="w-6 h-6 text-purple-400" />}>
          The Architecture That Changed Everything
        </SectionTitle>

        <Paragraph>
          The <strong>Transformer</strong> architecture, introduced in the 2017 paper
          &quot;Attention Is All You Need,&quot; revolutionized NLP. Its key innovation —
          <strong> self-attention</strong> — allows every token to directly attend to
          every other token, enabling parallel processing and capturing long-range
          dependencies.
        </Paragraph>

        <AnalogyBox title="A Room Full of Experts">
          Imagine a room where every word in a sentence is a person. In old systems
          (RNNs), they had to pass notes one by one down a line. With Transformers,
          everyone can talk to everyone simultaneously — dramatically faster and no
          information gets lost along the way.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "96", label: "Layers (GPT-3)", color: "#a855f7" },
            { value: "12,288", label: "Hidden Dim" },
            { value: "96", label: "Attention Heads" },
            { value: "175B", label: "Parameters" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Eye className="w-6 h-6 text-purple-400" />}>
          Self-Attention Visualized
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          <p className="text-sm text-muted-foreground mb-4">
            When processing &quot;{ATTENTION_EXAMPLE.query}&quot;, the model looks at all
            other words. Stronger colors = higher attention:
          </p>

          {!showAttention ? (
            <Button
              onClick={() => setShowAttention(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Attention Patterns
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {ATTENTION_EXAMPLE.attentions.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-2 rounded-lg text-center relative"
                    style={{
                      backgroundColor: `rgba(168, 85, 247, ${item.score})`,
                      border: item.word === "mat" ? "2px solid #a855f7" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="font-medium">{item.word}</div>
                    <div className="text-xs text-muted-foreground">
                      {(item.score * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center text-sm text-purple-400">
                &quot;it&quot; attends most strongly to &quot;mat&quot; (45%) — correctly identifying the referent!
              </div>
            </motion.div>
          )}
        </Card>

        <TechDetail title="Attention Formula">
          <div className="font-mono text-sm mb-2">
            Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>) × V
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Q (Query):</strong> What am I looking for?</li>
            <li><strong>K (Key):</strong> What do I contain?</li>
            <li><strong>V (Value):</strong> What information do I provide?</li>
            <li><strong>√d<sub>k</sub>:</strong> Scaling factor for stable gradients</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle icon={<Layers className="w-6 h-6 text-purple-400" />}>
          Layer-by-Layer Breakdown
        </SectionTitle>

        <div className="space-y-2">
          {TRANSFORMER_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.name}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                activeLayer === i
                  ? "bg-purple-500/10 border-purple-500/50"
                  : "bg-card/50 border-white/10 hover:border-white/20"
              }`}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{layer.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{layer.name}</div>
                  <div className="text-sm text-muted-foreground">{layer.desc}</div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${activeLayer === i ? "rotate-90" : ""}`} />
              </div>
              {activeLayer === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-white/10 text-sm text-purple-400"
                >
                  {layer.detail}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Self-attention enables parallel processing of all tokens</li>
            <li>Multi-head attention captures different relationship types</li>
            <li>Residual connections enable training of very deep networks</li>
            <li>Modern LLMs stack 32-128 transformer layers</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
