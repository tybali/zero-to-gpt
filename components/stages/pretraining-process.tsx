"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { BookOpen, TrendingDown, Zap } from "lucide-react";

const TRAINING_EXAMPLES = [
  { prompt: "The capital of France is", answer: "Paris", wrong: ["banana", "seven"] },
  { prompt: "Water freezes at zero degrees", answer: "Celsius", wrong: ["happy", "guitar"] },
  { prompt: "The sun rises in the", answer: "east", wrong: ["kitchen", "cloud"] },
];

export function PretrainingProcessStage() {
  const [currentExample, setCurrentExample] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showLoss, setShowLoss] = useState(false);
  const [lossValues, setLossValues] = useState<number[]>([]);

  const example = TRAINING_EXAMPLES[currentExample];
  const options = [example.answer, ...example.wrong].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (showLoss && lossValues.length === 0) {
      let vals: number[] = [];
      let loss = 11;
      for (let i = 0; i < 25; i++) {
        loss = loss * 0.88 + (Math.random() - 0.3) * 0.5;
        vals.push(Math.max(1.2, loss));
      }
      setLossValues(vals);
    }
  }, [showLoss, lossValues.length]);

  const handleGuess = (option: string) => {
    setGuess(option);
    setScore(prev => ({
      correct: prev.correct + (option === example.answer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextExample = () => {
    setGuess(null);
    setCurrentExample((prev) => (prev + 1) % TRAINING_EXAMPLES.length);
  };

  return (
    <div>
      <Section>
        <SectionTitle icon={<BookOpen className="w-6 h-6 text-yellow-400" />}>
          Learning to Predict
        </SectionTitle>

        <Paragraph>
          Pre-training is where the magic happens. The model learns one simple task:
          <strong> predict the next token</strong>. By doing this trillions of times
          across diverse text, it learns language, facts, reasoning, and more.
        </Paragraph>

        <AnalogyBox title="The World's Longest Fill-in-the-Blank Test">
          Imagine taking a test with trillions of questions, each asking &quot;What
          comes next?&quot; At first, you guess randomly. But after billions of
          examples, patterns emerge. You learn that &quot;The sky is...&quot; is usually
          followed by &quot;blue&quot; not &quot;banana.&quot;
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "~2T", label: "Training Tokens", color: "#fbbf24" },
            { value: "~3 months", label: "Training Time" },
            { value: "$100M+", label: "Compute Cost" },
            { value: "24/7", label: "GPU Utilization" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle>Play the Prediction Game!</SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentExample + 1}/{TRAINING_EXAMPLES.length}
            </span>
            <Badge variant="outline" className="text-yellow-400">
              Score: {score.correct}/{score.total}
            </Badge>
          </div>

          <div className="p-4 bg-background/50 rounded-lg mb-4 text-center text-lg">
            {example.prompt}{" "}
            <span className={`font-bold ${guess ? (guess === example.answer ? "text-green-400" : "text-red-400") : "text-yellow-400"}`}>
              {guess || "___"}
            </span>
          </div>

          {!guess ? (
            <div className="grid grid-cols-3 gap-3">
              {options.map((opt) => (
                <Button key={opt} variant="outline" onClick={() => handleGuess(opt)}>
                  {opt}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-xl font-bold mb-2 ${guess === example.answer ? "text-green-400" : "text-red-400"}`}>
                {guess === example.answer ? "✅ Correct!" : `❌ Answer: ${example.answer}`}
              </div>
              <Button onClick={nextExample} className="bg-gradient-to-r from-yellow-600 to-amber-600">
                Next →
              </Button>
            </div>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle icon={<TrendingDown className="w-6 h-6 text-yellow-400" />}>
          The Loss Curve
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          {!showLoss ? (
            <Button onClick={() => setShowLoss(true)} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600">
              Show Training Loss Curve
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="h-48 flex items-end gap-1">
                {lossValues.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 12) * 100}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t"
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Start (Loss: ~11)</span>
                <span>Training Progress →</span>
                <span>End (Loss: ~1.5)</span>
              </div>
            </motion.div>
          )}
        </Card>

        <TechDetail>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>Loss Function:</strong> Cross-entropy over vocabulary</li>
            <li><strong>Optimizer:</strong> AdamW with β₁=0.9, β₂=0.95</li>
            <li><strong>Learning Rate:</strong> Warmup + cosine decay</li>
            <li><strong>Batch Size:</strong> 4M tokens (gradient accumulation)</li>
          </ul>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Pre-training is next-token prediction at massive scale</li>
            <li>Loss decreases as the model learns patterns</li>
            <li>AdamW with cosine LR schedule is standard</li>
            <li>Checkpointing every few hours protects against failures</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
