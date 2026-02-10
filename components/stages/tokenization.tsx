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
import { Scissors, Puzzle, Zap } from "lucide-react";

const EXAMPLE_SENTENCES = [
  { text: "Hello, world!", tokens: ["Hello", ",", " world", "!"], ids: [15496, 11, 995, 0] },
  { text: "The cat sat on the mat", tokens: ["The", " cat", " sat", " on", " the", " mat"], ids: [464, 3797, 3332, 319, 262, 2603] },
  { text: "Artificial intelligence", tokens: ["Art", "ificial", " intelligence"], ids: [8001, 9542, 4430] },
  { text: "ChatGPT is amazing!", tokens: ["Chat", "G", "PT", " is", " amazing", "!"], ids: [30567, 38, 11571, 318, 4998, 0] },
];

const TOKENIZER_TYPES = [
  { name: "BPE", fullName: "Byte-Pair Encoding", usage: "GPT, Llama", desc: "Merges frequent byte pairs iteratively" },
  { name: "WordPiece", fullName: "WordPiece", usage: "BERT, DistilBERT", desc: "Likelihood-based subword merging" },
  { name: "SentencePiece", fullName: "SentencePiece", usage: "T5, ALBERT", desc: "Language-agnostic, includes BPE/Unigram" },
  { name: "Tiktoken", fullName: "Tiktoken", usage: "GPT-3.5/4", desc: "OpenAI's fast BPE implementation" },
];

// Simple fake tokenizer for demo
function fakeTokenize(text: string): { token: string; id: number }[] {
  if (!text.trim()) return [];
  const tokens: { token: string; id: number }[] = [];
  const words = text.match(/[\w']+|[^\s\w]/g) || [];
  words.forEach((word, i) => {
    const prefix = i === 0 ? "" : " ";
    tokens.push({
      token: prefix + word,
      id: Math.abs(word.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 17) % 50000,
    });
  });
  return tokens;
}

export function TokenizationStage() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [showTokens, setShowTokens] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customTokens, setCustomTokens] = useState<{ token: string; id: number }[] | null>(null);

  const example = EXAMPLE_SENTENCES[selectedExample];

  return (
    <div>
      <Section>
        <SectionTitle icon={<Scissors className="w-6 h-6 text-teal-400" />}>
          Breaking Language into Pieces
        </SectionTitle>

        <Paragraph>
          Computers can&apos;t read text like humans — they only understand numbers.
          <strong> Tokenization</strong> is the process of converting text into a
          sequence of integers that the model can process. Each unique piece of
          text (a &quot;token&quot;) gets assigned a number from the vocabulary.
        </Paragraph>

        <AnalogyBox title="Like Building Blocks">
          Think of tokens like LEGO bricks. You can build almost anything by
          combining a fixed set of standardized pieces. Similarly, a tokenizer
          breaks any text into a sequence of ~50,000 standard pieces, which can
          then be combined to represent any possible text.
        </AnalogyBox>

        <StatGrid
          stats={[
            { value: "~50K", label: "Vocabulary Size", color: "#14b8a6" },
            { value: "~0.75", label: "Tokens per Word" },
            { value: "BPE", label: "Most Common Algo" },
            { value: "~4 chars", label: "Avg Token Length" },
          ]}
        />
      </Section>

      <Section>
        <SectionTitle icon={<Puzzle className="w-6 h-6 text-teal-400" />}>
          Interactive Tokenizer
        </SectionTitle>
        <InteractiveLabel />

        <Card className="p-6 bg-card/50 border-white/10 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLE_SENTENCES.map((ex, i) => (
              <Button
                key={i}
                variant={selectedExample === i ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedExample(i);
                  setShowTokens(false);
                }}
              >
                Example {i + 1}
              </Button>
            ))}
          </div>

          <div className="p-4 bg-background/50 rounded-lg border border-white/10 mb-4 text-center">
            <span className="text-lg">&quot;{example.text}&quot;</span>
          </div>

          {!showTokens ? (
            <Button
              onClick={() => setShowTokens(true)}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Tokenize This Text!
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {example.tokens.map((token, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-3 py-2 rounded-lg text-center"
                    style={{
                      backgroundColor: `hsl(${(i * 60) % 360}, 50%, 15%)`,
                      border: `2px solid hsl(${(i * 60) % 360}, 60%, 40%)`,
                    }}
                  >
                    <div className="font-mono text-sm font-bold">&quot;{token}&quot;</div>
                    <div className="text-xs text-muted-foreground mt-1">ID: {example.ids[i]}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {example.tokens.length} tokens from {example.text.split(" ").length} words
              </div>
            </motion.div>
          )}
        </Card>

        <Card className="p-6 bg-card/50 border-white/10">
          <h4 className="font-semibold mb-3">Try Your Own Text</h4>
          <input
            type="text"
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              setCustomTokens(null);
            }}
            placeholder="Type any text here..."
            className="w-full p-3 rounded-lg bg-background/50 border border-white/10 mb-3 focus:outline-none focus:border-teal-500"
          />
          <Button
            onClick={() => setCustomTokens(fakeTokenize(customText))}
            disabled={!customText.trim()}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
          >
            Tokenize
          </Button>

          {customTokens && customTokens.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <div className="flex flex-wrap gap-2">
                {customTokens.map((t, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg text-center"
                    style={{
                      backgroundColor: `hsl(${(i * 60) % 360}, 50%, 15%)`,
                      border: `2px solid hsl(${(i * 60) % 360}, 60%, 40%)`,
                    }}
                  >
                    <div className="font-mono text-sm font-bold">&quot;{t.token}&quot;</div>
                    <div className="text-xs text-muted-foreground mt-1">ID: {t.id}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle>How BPE Works</SectionTitle>

        <Paragraph>
          Byte-Pair Encoding (BPE) is the most common tokenization algorithm.
          It works by starting with individual characters, then iteratively
          merging the most frequent pairs.
        </Paragraph>

        <Card className="p-6 bg-card/50 border-white/10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline">Step 1</Badge>
              <span className="font-mono text-sm">t h e → Start with characters</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Step 2</Badge>
              <span className="font-mono text-sm">th e → Merge &quot;t&quot; + &quot;h&quot; (most frequent)</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Step 3</Badge>
              <span className="font-mono text-sm">the → Merge &quot;th&quot; + &quot;e&quot;</span>
            </div>
            <div className="text-sm text-teal-400 mt-2">
              Result: &quot;the&quot; becomes a single token instead of 3 characters
            </div>
          </div>
        </Card>

        <TechDetail>
          <p className="mb-2">BPE Algorithm Steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Start with character-level vocabulary (256 bytes)</li>
            <li>Count all adjacent pair frequencies in corpus</li>
            <li>Merge most frequent pair into new token</li>
            <li>Repeat until vocabulary size reached (~50K)</li>
          </ol>
          <p className="mt-2 text-teal-400">
            Time complexity: O(n × V) where n = corpus size, V = vocab size
          </p>
        </TechDetail>
      </Section>

      <Section>
        <SectionTitle>Tokenizer Comparison</SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          {TOKENIZER_TYPES.map((t) => (
            <Card key={t.name} className="p-4 bg-card/50 border-white/10">
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-teal-500/20 text-teal-400">{t.name}</Badge>
                <span className="text-xs text-muted-foreground">{t.usage}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">{t.fullName}</h4>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <InfoBox type="success" title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Tokenization converts text to integers the model understands</li>
            <li>BPE is the dominant algorithm, balancing efficiency and coverage</li>
            <li>Vocabulary size is typically ~32K-100K tokens</li>
            <li>Common words are single tokens; rare words are split</li>
          </ul>
        </InfoBox>
      </Section>
    </div>
  );
}
