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
import { Trophy, ThumbsUp, ThumbsDown, Scale } from "lucide-react";

const SCENARIOS = [
  {
    question: "How do I pick a lock?",
    responses: [
      { text: "I can't help with that — it could be used for illegal purposes.", score: 9, label: "Safe refusal" },
      { text: "First, get a tension wrench and pick...", score: 1, label: "Harmful" },
      { text: "ERROR 403 FORBIDDEN", score: 3, label: "Robotic" },
    ],
  },
  {
    question: "What is photosynthesis?",
    responses: [
      { text: "Photosynthesis is how plants convert sunlight, water, and CO₂ into glucose and oxygen.", score: 9, label: "Helpful" },
      { text: "It's a plant thing.", score: 3, label: "Too brief" },
      { text: "Plants use quantum tunneling to...", score: 2, label: "Wrong" },
    ],
  },
];

export function RlhfDpoStage() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  return (
    <div>
      <Section>
        <SectionTitle icon={<Trophy className="w-6 h-6 text-rose-400" />}>
          Learning from Human Preferences
        </SectionTitle>

        <Paragraph>
          RLHF (Reinforcement Learning from Human Feedback) teaches models what
          humans actually prefer. Humans rate AI responses, a reward model learns
          these preferences, and the LLM is trained to maximize that reward.
        </Paragraph>

        <AnalogyBox title="Teaching a Student">
          Imagine a student who knows facts but lacks judgment. RLHF is like
          having teachers grade their responses: &quot;This answer is helpful,&quot;
          &quot;This one is too brief,&quot; &quot;This one is dangerous.&quot; Over time,
          the student learns what makes a good response.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "3 Steps", label: "SFT → RM → PPO", color: "#f43f5e" },
            { value: "~100K", label: "Preference Pairs" },
            { value: "PPO/DPO", label: "Training Algorithm" },
            { value: "HHH", label: "Goal: Helpful, Harmless, Honest" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Scale className="w-6 h-6 text-rose-400" />}>
          Be the Human Rater!
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">User asks:</Badge>
            <div className="text-lg font-medium">&quot;{scenario.question}&quot;</div>
          </div>

          <div className="space-y-3">
            {scenario.responses.map((resp, i) => (
              <motion.button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selected === i
                    ? resp.score > 5 ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
                    : "bg-card/50 border-white/10 hover:border-white/20"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm">{resp.text}</p>
                {selected === i && (
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                    <Badge className={resp.score > 5 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {resp.label}
                    </Badge>
                    <span className={`font-bold ${resp.score > 5 ? "text-green-400" : "text-red-400"}`}>
                      {resp.score}/10
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {selected !== null && (
            <Button
              onClick={() => { setSelected(null); setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length); }}
              className="w-full mt-4 bg-gradient-to-r from-rose-600 to-pink-600"
            >
              Next Scenario →
            </Button>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle>PPO vs DPO</SectionTitle>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5 bg-card/50 border-white/10">
            <Badge className="bg-rose-500/20 text-rose-400 mb-3">PPO</Badge>
            <h4 className="font-semibold mb-2">Proximal Policy Optimization</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Train separate reward model</li>
              <li>• RL training loop with KL penalty</li>
              <li>• More complex, requires RL expertise</li>
              <li>• Used by ChatGPT, Claude</li>
            </ul>
          </Card>
          <Card className="p-5 bg-card/50 border-white/10">
            <Badge className="bg-purple-500/20 text-purple-400 mb-3">DPO</Badge>
            <h4 className="font-semibold mb-2">Direct Preference Optimization</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• No separate reward model needed</li>
              <li>• Single supervised learning step</li>
              <li>• Simpler, more stable</li>
              <li>• Increasingly popular (2023+)</li>
            </ul>
          </Card>
        </div>

        <TechDetail>
          <p className="text-xs mb-2">DPO Loss Function:</p>
          <div className="font-mono text-xs bg-black/30 p-2 rounded mb-2">
            L = -log σ(β(log π(y_w|x) - log π(y_l|x)))
          </div>
          <p className="text-xs">Where y_w is preferred response, y_l is rejected response</p>
        </TechDetail>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>RLHF aligns models with human preferences</li>
            <li>Human raters compare response pairs</li>
            <li>PPO uses reward model + RL; DPO is simpler</li>
            <li>Goal: Helpful, Harmless, Honest (HHH)</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
