import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS & DATA ────────────────────────────────────────
const STAGES = [
  { id: 0, icon: "🌍", title: "Gather Data", color: "#2d9c6f", bg: "#eefbf4" },
  { id: 1, icon: "✂️", title: "Clean & Tokenize", color: "#c7792a", bg: "#fef6eb" },
  { id: 2, icon: "🧠", title: "Build the Brain", color: "#7c5cbf", bg: "#f3effc" },
  { id: 3, icon: "📖", title: "Pre-Training", color: "#2a7ec7", bg: "#ebf3fe" },
  { id: 4, icon: "👩‍🏫", title: "Fine-Tuning & RLHF", color: "#c74a6e", bg: "#fcedf2" },
  { id: 5, icon: "✨", title: "Inference", color: "#b8860b", bg: "#fdf8eb" },
];

const TOKEN_EXAMPLES = [
  { text: "The cat sat on a mat", tokens: ["The", " cat", " sat", " on", " a", " mat"], ids: [464, 3797, 3332, 319, 257, 2603] },
  { text: "I love ice cream", tokens: ["I", " love", " ice", " cream"], ids: [40, 1842, 4771, 8566] },
  { text: "Artificial intelligence is amazing", tokens: ["Art", "ificial", " intelligence", " is", " amazing"], ids: [8001, 9542, 4430, 318, 4998] },
  { text: "How does a computer think?", tokens: ["How", " does", " a", " computer", " think", "?"], ids: [2437, 857, 257, 3644, 892, 30] },
];

const TRAINING_EXAMPLES = [
  { prompt: "The capital of France is", answer: "Paris", wrong: ["banana", "seven", "purple"] },
  { prompt: "Water freezes at zero degrees", answer: "Celsius", wrong: ["happy", "sandwich", "guitar"] },
  { prompt: "The sun rises in the", answer: "east", wrong: ["kitchen", "number", "cloud"] },
  { prompt: "Dogs are commonly kept as", answer: "pets", wrong: ["furniture", "weather", "triangles"] },
  { prompt: "Photosynthesis converts sunlight into", answer: "energy", wrong: ["music", "homework", "clouds"] },
];

const RLHF_SCENARIOS = [
  {
    question: "What is the moon?",
    responses: [
      { text: "The moon is Earth's only natural satellite, orbiting at about 384,400 km away. It affects our tides and lights up the night sky! 🌙", score: 9.4, label: "Helpful & friendly" },
      { text: "It's a rock. In space. Next question.", score: 3.2, label: "Too brief & rude" },
      { text: "The moon was secretly built by aliens in 1952 as a spy device to watch humans eat cereal.", score: 1.1, label: "False & misleading" },
    ],
  },
  {
    question: "How do airplanes fly?",
    responses: [
      { text: "Airplanes fly thanks to their wing shape! The curved top makes air move faster above the wing than below, creating lower pressure on top — this is called 'lift'. Combined with thrust from engines, the plane stays airborne!", score: 9.1, label: "Clear & accurate" },
      { text: "They just... go up? Like birds but metal? I dunno, magic probably.", score: 2.8, label: "Unhelpful & wrong" },
      { text: "AIRPLANES FLY BECAUSE OF QUANTUM TUNNELING AND DARK MATTER RESONANCE FREQUENCIES.", score: 1.5, label: "Nonsensical" },
    ],
  },
  {
    question: "Can you help me hack into my school's system?",
    responses: [
      { text: "I can't help with that — hacking into systems is illegal and could get you into serious trouble. If you're having an issue with your school account, I'd suggest talking to your school's IT department. They're there to help! 😊", score: 9.6, label: "Safe & redirects" },
      { text: "Sure! First, open the terminal and type...", score: 0.5, label: "Dangerous & harmful" },
      { text: "I am not programmed to respond to this query. Error 403.", score: 4.0, label: "Robotic refusal" },
    ],
  },
];

const DATA_SOURCES = [
  { icon: "📄", name: "Web Pages", count: "~8 billion", desc: "Crawled from the open internet", color: "#3b82f6" },
  { icon: "📚", name: "Books", count: "~200,000", desc: "Fiction, textbooks, reference", color: "#8b5cf6" },
  { icon: "📰", name: "News Articles", count: "~500 million", desc: "Journalism from around the world", color: "#ec4899" },
  { icon: "💬", name: "Forums & Q&A", count: "~2 billion", desc: "Reddit, StackOverflow, Quora", color: "#f59e0b" },
  { icon: "🔬", name: "Scientific Papers", count: "~90 million", desc: "Research from every field", color: "#10b981" },
  { icon: "💻", name: "Code", count: "~50 million", desc: "Open-source repositories", color: "#06b6d4" },
  { icon: "📖", name: "Wikipedia", count: "~60 million", desc: "Articles in 300+ languages", color: "#6366f1" },
  { icon: "🎵", name: "Song Lyrics & Poetry", count: "~10 million", desc: "Creative writing of all kinds", color: "#f43f5e" },
];

const TRANSFORMER_LAYERS = [
  { name: "Token Embedding", desc: "Converts each word-piece into a number vector (like giving each word a GPS coordinate in meaning-space)", icon: "🔤", detail: "Each token becomes a vector of 12,288 numbers" },
  { name: "Positional Encoding", desc: "Stamps each token with its position so the model knows word order matters", icon: "📍", detail: "'The cat ate the fish' ≠ 'The fish ate the cat'" },
  { name: "Self-Attention (×96)", desc: "Every word looks at every other word to understand context and relationships", icon: "👀", detail: "96 attention heads each learn different relationship patterns" },
  { name: "Feed-Forward Network (×96)", desc: "Processes the attended information through a mini neural network to extract deeper meaning", icon: "⚡", detail: "Each layer has ~50 million parameters doing the heavy lifting" },
  { name: "Layer Normalization", desc: "Keeps numbers in a healthy range so training stays stable — like a thermostat for the network", icon: "⚖️", detail: "Prevents exploding/vanishing gradients" },
  { name: "Residual Connections", desc: "Shortcuts that let information skip layers — so earlier insights aren't lost", icon: "🔗", detail: "Like an express elevator bypassing floors" },
  { name: "Final Linear Layer", desc: "Converts the processed information into a probability for every possible next token", icon: "📊", detail: "Outputs ~50,000 probabilities (one per vocab word)" },
  { name: "Softmax Output", desc: "Turns raw scores into proper probabilities that sum to 100% — now the model can 'choose' its answer", icon: "🎯", detail: "Temperature controls how creative vs. safe the choice is" },
];

// ─── UTILITY COMPONENTS ──────────────────────────────────────

function ProgressBar({ stage, onNavigate }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e5e7eb", padding: "10px 20px",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 4 }}>
        {STAGES.map((s, i) => (
          <button key={i} onClick={() => onNavigate(i)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: "4px 2px",
            opacity: i <= stage ? 1 : 0.35, transition: "all 0.3s",
          }}>
            <div style={{
              height: 6, width: "100%", borderRadius: 3,
              background: i < stage ? s.color : i === stage
                ? `linear-gradient(90deg, ${s.color}, ${s.color}88)` : "#ddd",
              transition: "all 0.5s",
            }} />
            <span style={{
              fontSize: 11, fontWeight: i === stage ? 700 : 500,
              color: i === stage ? s.color : "#888",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
            }}>
              {s.icon} {s.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ children, style }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: "28px 32px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
      border: "1px solid #f0f0f0", ...style,
    }}>
      {children}
    </div>
  );
}

function AnalogyBox({ emoji, title, children, color }) {
  return (
    <div style={{
      background: `${color}11`, border: `2px dashed ${color}44`,
      borderRadius: 14, padding: "20px 24px", margin: "16px 0",
      display: "flex", gap: 16, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{
          fontWeight: 700, fontSize: 14, color, marginBottom: 4,
          fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px",
        }}>{title}</div>
        <div style={{
          fontSize: 15, lineHeight: 1.6, color: "#444",
          fontFamily: "'Source Serif 4', Georgia, serif",
        }}>{children}</div>
      </div>
    </div>
  );
}

function TechDetail({ children, color }) {
  return (
    <div style={{
      background: "#1a1a2e", color: "#e0e0e0", borderRadius: 12,
      padding: "18px 22px", margin: "16px 0",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
      lineHeight: 1.7, borderLeft: `4px solid ${color}`,
    }}>
      <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
        🔧 Technical Detail
      </span>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  );
}

function InteractiveLabel({ children }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "#fef3c7", color: "#92400e", borderRadius: 20,
      padding: "5px 14px", fontSize: 12, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
      border: "1px solid #fbbf2444",
    }}>
      <span style={{ fontSize: 14 }}>👆</span> Try it yourself!
    </div>
  );
}

function StatBubble({ value, label, color }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{
        fontSize: 28, fontWeight: 800, color,
        fontFamily: "'DM Sans', sans-serif",
      }}>{value}</div>
      <div style={{
        fontSize: 12, color: "#777", marginTop: 2,
        fontFamily: "'DM Sans', sans-serif",
      }}>{label}</div>
    </div>
  );
}

function Paragraph({ children }) {
  return (
    <p style={{
      fontSize: 16, lineHeight: 1.75, color: "#333",
      fontFamily: "'Source Serif 4', Georgia, serif",
      margin: "12px 0",
    }}>{children}</p>
  );
}

function SectionTitle({ children, color }) {
  return (
    <h3 style={{
      fontSize: 20, fontWeight: 700, color: color || "#222",
      fontFamily: "'DM Sans', sans-serif", margin: "24px 0 12px",
    }}>{children}</h3>
  );
}

// ─── STAGE 0: DATA COLLECTION ────────────────────────────────

function DataCollectionStage() {
  const color = STAGES[0].color;
  const [collected, setCollected] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const intervalRef = useRef(null);

  const startCollecting = () => {
    setIsCollecting(true);
    setCollected([]);
    setTotalTokens(0);
    let idx = 0;
    intervalRef.current = setInterval(() => {
      if (idx >= DATA_SOURCES.length) {
        clearInterval(intervalRef.current);
        setIsCollecting(false);
        setShowFilter(true);
        return;
      }
      setCollected(prev => [...prev, DATA_SOURCES[idx]]);
      setTotalTokens(prev => prev + Math.floor(Math.random() * 80 + 20));
      idx++;
    }, 600);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <Paragraph>
        Every AI starts with <strong>data</strong> — mountains of it. Before a language model can learn anything,
        we need to show it as much human-written text as possible. Think of it like filling the world's biggest
        library, except instead of shelves, we're filling computer hard drives.
      </Paragraph>

      <AnalogyBox emoji="👶" title="Kid-Friendly Analogy" color={color}>
        Imagine you're a baby who wants to learn every language on Earth. First, you'd need to listen to
        billions of conversations, read millions of books, and watch countless videos. That's exactly what
        we do for an AI — except we can do it <em>much</em> faster with computers!
      </AnalogyBox>

      <SectionTitle color={color}>How Much Data?</SectionTitle>
      <Paragraph>
        Modern LLMs like GPT-4, Claude, and Llama are trained on truly staggering amounts of text. We're
        talking about <strong>trillions of words</strong> — enough to fill millions of books. If you tried to
        read it all yourself, reading 24/7, it would take you over 20,000 years!
      </Paragraph>

      <div style={{ display: "flex", gap: 12, margin: "20px 0", flexWrap: "wrap" }}>
        <StatBubble value="~15T" label="tokens (words/pieces)" color={color} />
        <StatBubble value="~570 GB" label="of raw text" color="#666" />
        <StatBubble value="300+" label="languages" color="#666" />
        <StatBubble value="20,000" label="years to read" color="#666" />
      </div>

      <SectionTitle color={color}>Where Does the Data Come From?</SectionTitle>
      <Paragraph>
        Data is collected (or "crawled") from all across the internet and other sources. Press the button
        below to simulate collecting data from different sources:
      </Paragraph>

      <InteractiveLabel />
      <SectionCard>
        {!isCollecting && collected.length === 0 && (
          <button onClick={startCollecting} style={{
            width: "100%", padding: "16px", background: color, color: "white",
            border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "transform 0.2s",
          }}
            onMouseOver={e => e.target.style.transform = "scale(1.02)"}
            onMouseOut={e => e.target.style.transform = "scale(1)"}
          >
            🚀 Start Crawling the Internet!
          </button>
        )}

        {(isCollecting || collected.length > 0) && (
          <div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}>
              {collected.map((src, i) => (
                <div key={i} style={{
                  padding: "14px 16px", borderRadius: 12,
                  border: `2px solid ${src.color}22`, background: `${src.color}08`,
                  animation: "fadeSlideUp 0.4s ease-out",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{src.icon}</div>
                  <div style={{
                    fontWeight: 700, fontSize: 14, color: src.color,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{src.name}</div>
                  <div style={{
                    fontSize: 12, color: "#666", marginTop: 2,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{src.count} items</div>
                  <div style={{
                    fontSize: 11, color: "#999", marginTop: 4,
                    fontFamily: "'Source Serif 4', Georgia, serif",
                  }}>{src.desc}</div>
                </div>
              ))}
            </div>
            {isCollecting && (
              <div style={{
                textAlign: "center", marginTop: 16, color: "#888",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              }}>
                ⏳ Crawling... {collected.length}/{DATA_SOURCES.length} sources
              </div>
            )}
            {!isCollecting && collected.length > 0 && (
              <div style={{
                textAlign: "center", marginTop: 16, padding: 16,
                background: `${color}11`, borderRadius: 12,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color }}>
                  ✅ {totalTokens} billion tokens collected!
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  From {DATA_SOURCES.length} major sources across the internet
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {showFilter && (
        <div style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
          <SectionTitle color={color}>⚠️ But Wait — Not All Data is Good!</SectionTitle>
          <Paragraph>
            The raw internet is messy. It contains spam, duplicates, broken HTML, offensive content,
            private information, and lots of junk. Before training, we have to <strong>filter and
            clean</strong> the data — removing up to 90% of what we collected!
          </Paragraph>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0",
          }}>
            {[
              { icon: "🗑️", label: "Remove duplicates", detail: "~30% of web pages are near-copies" },
              { icon: "🚫", label: "Filter toxic content", detail: "Hate speech, violence, adult content" },
              { icon: "🔒", label: "Remove private data", detail: "Phone numbers, emails, addresses" },
              { icon: "🧹", label: "Strip HTML/code junk", detail: "Navigation menus, ads, scripts" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "14px", borderRadius: 10,
                background: "#fef2f2", border: "1px solid #fecaca",
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#991b1b", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TechDetail color={color}>
        <div><strong style={{ color: "#4ade80" }}>Common Crawl</strong> — the largest open web dataset — contains ~250 billion web pages.</div>
        <div style={{ marginTop: 6 }}>After deduplication and quality filtering, typically only <strong style={{ color: "#fbbf24" }}>~10-15%</strong> of raw data survives.</div>
        <div style={{ marginTop: 6 }}>Training data for GPT-3 was ~570 GB of filtered text. GPT-4 and Claude likely use 10-50× more.</div>
        <div style={{ marginTop: 6 }}>Data quality matters more than quantity — a smaller, cleaner dataset often beats a massive noisy one.</div>
      </TechDetail>
    </div>
  );
}

// ─── STAGE 1: TOKENIZATION ───────────────────────────────────

function TokenizationStage() {
  const color = STAGES[1].color;
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showTokens, setShowTokens] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customTokens, setCustomTokens] = useState(null);
  const example = TOKEN_EXAMPLES[exampleIdx];

  const fakeTokenize = (text) => {
    if (!text.trim()) return null;
    const words = text.match(/[\w']+|[^\s\w]/g) || [];
    return words.map((w, i) => ({
      token: i === 0 ? w : " " + w,
      id: Math.floor(Math.random() * 50000),
    }));
  };

  return (
    <div>
      <Paragraph>
        Computers can't read words like humans do. They only understand numbers. So before training,
        we need to break all text into small pieces called <strong>tokens</strong> and assign each piece a
        number. This process is called <strong>tokenization</strong>.
      </Paragraph>

      <AnalogyBox emoji="🧩" title="Kid-Friendly Analogy" color={color}>
        Imagine you have a giant jigsaw puzzle of the English language. Tokenization is like breaking the
        puzzle into pieces — but instead of random shapes, each piece is a word or part of a word. Then
        you label each piece with a number, so the computer can work with it like a math problem!
      </AnalogyBox>

      <SectionTitle color={color}>What is a Token?</SectionTitle>
      <Paragraph>
        A token isn't always a whole word. Common words like "the" or "is" get their own token, but rare
        or long words get split into smaller pieces. The word "unbelievable" might become ["un", "believ",
        "able"]. This way, the model can handle any word — even ones it's never seen before — by combining
        smaller familiar pieces.
      </Paragraph>

      <div style={{ display: "flex", gap: 12, margin: "20px 0", flexWrap: "wrap" }}>
        <StatBubble value="~50K" label="tokens in vocabulary" color={color} />
        <StatBubble value="~0.75" label="words per token (avg)" color="#666" />
        <StatBubble value="BPE" label="algorithm used" color="#666" />
      </div>

      <SectionTitle color={color}>See Tokenization in Action</SectionTitle>
      <InteractiveLabel />

      <SectionCard>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {TOKEN_EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setExampleIdx(i); setShowTokens(false); }} style={{
              padding: "8px 14px", borderRadius: 8, border: `2px solid ${i === exampleIdx ? color : "#e5e7eb"}`,
              background: i === exampleIdx ? `${color}11` : "white",
              fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              color: i === exampleIdx ? color : "#666", fontWeight: i === exampleIdx ? 700 : 500,
              transition: "all 0.2s",
            }}>
              Example {i + 1}
            </button>
          ))}
        </div>

        <div style={{
          padding: "16px 20px", background: "#f9fafb", borderRadius: 10,
          fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 18,
          color: "#222", textAlign: "center", marginBottom: 16,
        }}>
          "{example.text}"
        </div>

        {!showTokens ? (
          <button onClick={() => setShowTokens(true)} style={{
            width: "100%", padding: "12px", background: color, color: "white",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            ✂️ Tokenize This Sentence!
          </button>
        ) : (
          <div style={{ animation: "fadeSlideUp 0.4s ease-out" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              TOKENS:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {example.tokens.map((t, i) => (
                <div key={i} style={{
                  animation: `fadeSlideUp 0.3s ease-out ${i * 0.1}s both`,
                }}>
                  <div style={{
                    padding: "10px 16px", borderRadius: 10,
                    background: `hsl(${(i * 47) % 360}, 60%, 95%)`,
                    border: `2px solid hsl(${(i * 47) % 360}, 50%, 80%)`,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 15,
                    textAlign: "center",
                  }}>
                    <div style={{ fontWeight: 700 }}>"{t}"</div>
                    <div style={{
                      fontSize: 11, color: "#888", marginTop: 4,
                      borderTop: "1px dashed #ccc", paddingTop: 4,
                    }}>
                      ID: {example.ids[i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              padding: "12px 16px", background: `${color}11`, borderRadius: 8,
              fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif",
            }}>
              📊 {example.tokens.length} tokens from {example.text.split(" ").length} words
              — notice how spaces are included in some tokens!
            </div>
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>Try Your Own Text</SectionTitle>
      <InteractiveLabel />
      <SectionCard>
        <input
          value={customText}
          onChange={e => { setCustomText(e.target.value); setCustomTokens(null); }}
          placeholder="Type any sentence here..."
          style={{
            width: "100%", padding: "14px 18px", borderRadius: 10,
            border: "2px solid #e5e7eb", fontSize: 16,
            fontFamily: "'Source Serif 4', Georgia, serif",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = color}
          onBlur={e => e.target.style.borderColor = "#e5e7eb"}
        />
        <button onClick={() => setCustomTokens(fakeTokenize(customText))} disabled={!customText.trim()} style={{
          marginTop: 10, width: "100%", padding: "12px", background: customText.trim() ? color : "#ccc",
          color: "white", border: "none", borderRadius: 10, fontSize: 15,
          fontWeight: 700, cursor: customText.trim() ? "pointer" : "default",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ✂️ Tokenize!
        </button>
        {customTokens && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, animation: "fadeSlideUp 0.3s" }}>
            {customTokens.map((t, i) => (
              <div key={i} style={{
                padding: "8px 14px", borderRadius: 8,
                background: `hsl(${(i * 47) % 360}, 60%, 95%)`,
                border: `2px solid hsl(${(i * 47) % 360}, 50%, 80%)`,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
              }}>
                <div style={{ fontWeight: 700 }}>"{t.token}"</div>
                <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>ID: {t.id}</div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>How Does BPE Work?</SectionTitle>
      <Paragraph>
        The most common tokenization algorithm is <strong>Byte-Pair Encoding (BPE)</strong>. It starts by
        splitting text into individual characters, then repeatedly merges the most common pairs. For
        example, "t" and "h" appear together so often that they merge into "th", then "th" and "e" merge
        into "the". This builds up a vocabulary of the most useful pieces.
      </Paragraph>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, margin: "20px 0", flexWrap: "wrap",
      }}>
        {["t|h|e", "th|e", "the"].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              padding: "10px 18px", borderRadius: 10,
              background: i === 2 ? `${color}22` : "#f3f4f6",
              border: `2px solid ${i === 2 ? color : "#e5e7eb"}`,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700,
            }}>
              {step.split("|").map((c, j) => (
                <span key={j}>
                  {j > 0 && <span style={{ color: "#ccc", margin: "0 2px" }}>|</span>}
                  <span style={{ color: i === 2 ? color : "#444" }}>{c}</span>
                </span>
              ))}
            </div>
            {i < 2 && <span style={{ fontSize: 20, color: "#aaa" }}>→</span>}
          </div>
        ))}
      </div>

      <TechDetail color={color}>
        <div><strong style={{ color: "#fbbf24" }}>BPE</strong> (Byte-Pair Encoding) starts with ~256 byte-level tokens and iteratively merges.</div>
        <div style={{ marginTop: 6 }}>GPT-style models use ~50,000 tokens. Claude uses a similar-sized vocabulary.</div>
        <div style={{ marginTop: 6 }}>The word "tokenization" itself might tokenize as: ["token", "ization"] — 2 tokens.</div>
        <div style={{ marginTop: 6 }}>Emojis, rare scripts, and code symbols often take multiple tokens each.</div>
      </TechDetail>
    </div>
  );
}

// ─── STAGE 2: TRANSFORMER ARCHITECTURE ───────────────────────

function TransformerStage() {
  const color = STAGES[2].color;
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

  useEffect(() => {
    if (!showDataFlow) return;
    const timer = setInterval(() => {
      setFlowStep(prev => {
        if (prev >= TRANSFORMER_LAYERS.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [showDataFlow]);

  return (
    <div>
      <Paragraph>
        Now comes the magic: building the <strong>neural network architecture</strong>. Modern LLMs use
        a design called a <strong>Transformer</strong>, invented by Google researchers in 2017. It's the
        secret sauce that made today's AI revolution possible.
      </Paragraph>

      <AnalogyBox emoji="🏗️" title="Kid-Friendly Analogy" color={color}>
        Think of building a brain like building a skyscraper. Each floor is a "layer" that processes
        information differently. The ground floor reads the words, middle floors figure out what words mean
        <em> together</em>, and the top floor makes the final decision about what comes next. A model like
        GPT-3 has 96 floors — and 175 billion tiny "knobs" (parameters) that all need to be tuned perfectly!
      </AnalogyBox>

      <SectionTitle color={color}>The Key Innovation: Attention</SectionTitle>
      <Paragraph>
        The big breakthrough of Transformers is called <strong>Self-Attention</strong>. In older models, words
        were processed one at a time, left to right. With attention, every word can look at every other word
        at the same time. This is like the difference between reading a book one word at a time vs. being able
        to see the whole page at once.
      </Paragraph>

      <SectionCard style={{ margin: "20px 0" }}>
        <div style={{ textAlign: "center", margin: "8px 0 16px" }}>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 18, color: "#444",
          }}>
            "The <span style={{ background: "#dbeafe", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>cat</span> sat on the <span style={{ background: "#dbeafe", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>mat</span> because <span style={{ background: "#fef3c7", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>it</span> was soft"
          </div>
          <div style={{ marginTop: 12 }}>
            <svg width="320" height="60" viewBox="0 0 320 60">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
              </defs>
              <path d="M 230 45 Q 230 15, 80 15" stroke={color} strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.7" />
              <path d="M 230 45 Q 230 25, 175 25" stroke={color} strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.4" />
              <text x="232" y="58" fontSize="13" fill="#92400e" fontFamily="DM Sans" fontWeight="600">"it"</text>
              <text x="68" y="12" fontSize="11" fill={color} fontFamily="DM Sans">strong link</text>
              <text x="165" y="22" fontSize="11" fill={color} fontFamily="DM Sans" opacity="0.6">weak</text>
            </svg>
          </div>
          <div style={{
            fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif", marginTop: 4,
          }}>
            Attention helps the model understand that "it" refers to "mat" — not "cat"!
          </div>
        </div>
      </SectionCard>

      <SectionTitle color={color}>Inside the Transformer</SectionTitle>
      <Paragraph>
        Let's look at each layer of the transformer, from input to output.
        Click on any layer to learn more, or press the button to watch data flow through the whole network!
      </Paragraph>

      <InteractiveLabel />
      <SectionCard>
        {!showDataFlow && (
          <button onClick={() => { setShowDataFlow(true); setFlowStep(0); }} style={{
            width: "100%", padding: "12px", background: color, color: "white",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 16,
          }}>
            ⚡ Watch Data Flow Through the Network
          </button>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRANSFORMER_LAYERS.map((layer, i) => {
            const isActive = showDataFlow && i <= flowStep;
            const isCurrent = showDataFlow && i === flowStep;
            const isExpanded = expandedLayer === i;
            return (
              <div key={i}>
                <button onClick={() => setExpandedLayer(isExpanded ? null : i)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                  border: `2px solid ${isCurrent ? color : isActive ? `${color}44` : "#e5e7eb"}`,
                  background: isCurrent ? `${color}15` : isActive ? `${color}08` : "#fafafa",
                  transition: "all 0.4s", textAlign: "left",
                  boxShadow: isCurrent ? `0 0 20px ${color}22` : "none",
                }}>
                  <span style={{
                    fontSize: 24, width: 40, height: 40, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: isActive ? `${color}22` : "#f3f4f6",
                    borderRadius: 10, flexShrink: 0,
                    transition: "all 0.4s",
                  }}>
                    {layer.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14, color: isActive ? color : "#444",
                      fontFamily: "'DM Sans', sans-serif", transition: "color 0.4s",
                    }}>{layer.name}</div>
                    <div style={{
                      fontSize: 13, color: "#777", marginTop: 2,
                      fontFamily: "'Source Serif 4', Georgia, serif",
                    }}>{layer.desc}</div>
                  </div>
                  <span style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.3s", fontSize: 16, color: "#aaa",
                  }}>▼</span>
                </button>
                {isExpanded && (
                  <div style={{
                    margin: "4px 0 4px 54px", padding: "12px 16px",
                    background: `${color}08`, borderRadius: 10, borderLeft: `3px solid ${color}`,
                    fontSize: 13, color: "#555", fontFamily: "'JetBrains Mono', monospace",
                    animation: "fadeSlideUp 0.2s ease-out",
                  }}>
                    {layer.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showDataFlow && flowStep >= TRANSFORMER_LAYERS.length - 1 && (
          <div style={{
            textAlign: "center", marginTop: 16, padding: 16,
            background: `${color}11`, borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", animation: "fadeSlideUp 0.5s",
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>
              🎉 Complete! Data has flowed through all layers!
            </div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
              This entire process happens in milliseconds for each token
            </div>
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>Scale of Modern Models</SectionTitle>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 10, margin: "16px 0",
      }}>
        {[
          { name: "GPT-2", params: "1.5B", layers: 48, year: 2019 },
          { name: "GPT-3", params: "175B", layers: 96, year: 2020 },
          { name: "GPT-4", params: "~1.8T*", layers: "~120*", year: 2023 },
          { name: "Llama 3", params: "405B", layers: 126, year: 2024 },
        ].map((m, i) => (
          <div key={i} style={{
            padding: 16, borderRadius: 12, textAlign: "center",
            background: i === 2 ? `${color}11` : "#f9fafb",
            border: `2px solid ${i === 2 ? color : "#e5e7eb"}`,
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color, fontFamily: "'DM Sans', sans-serif" }}>{m.name}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#222", fontFamily: "'DM Sans', sans-serif", margin: "4px 0" }}>{m.params}</div>
            <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>{m.layers} layers · {m.year}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
        * GPT-4 specs are estimated/leaked — OpenAI hasn't confirmed exact numbers
      </div>

      <TechDetail color={color}>
        <div>The original 2017 Transformer paper: <strong style={{ color: "#a78bfa" }}>"Attention Is All You Need"</strong> by Vaswani et al.</div>
        <div style={{ marginTop: 6 }}>Self-attention complexity is O(n²) with sequence length — this is why context windows have limits.</div>
        <div style={{ marginTop: 6 }}>Modern models use <strong style={{ color: "#fbbf24" }}>Flash Attention</strong>, <strong style={{ color: "#fbbf24" }}>Rotary Position Embeddings (RoPE)</strong>, and other optimizations.</div>
        <div style={{ marginTop: 6 }}>175B parameters at FP16 = ~350 GB of GPU memory just for the weights alone.</div>
      </TechDetail>
    </div>
  );
}

// ─── STAGE 3: PRE-TRAINING ───────────────────────────────────

function PreTrainingStage() {
  const color = STAGES[3].color;
  const [currentExample, setCurrentExample] = useState(0);
  const [guess, setGuess] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showLossChart, setShowLossChart] = useState(false);
  const [lossValues, setLossValues] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const ex = TRAINING_EXAMPLES[currentExample];

  useEffect(() => {
    const opts = [ex.answer, ...ex.wrong].sort(() => Math.random() - 0.5);
    setShuffledOptions(opts);
  }, [currentExample]);

  useEffect(() => {
    if (showLossChart && lossValues.length === 0) {
      let vals = [];
      let loss = 11;
      for (let i = 0; i < 30; i++) {
        loss = loss * 0.88 + (Math.random() - 0.3) * 0.3;
        vals.push(Math.max(0.8, loss));
      }
      setLossValues(vals);
    }
  }, [showLossChart]);

  const handleGuess = (option) => {
    setGuess(option);
    setScore(prev => ({
      correct: prev.correct + (option === ex.answer ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextExample = () => {
    setGuess(null);
    setCurrentExample(prev => (prev + 1) % TRAINING_EXAMPLES.length);
  };

  return (
    <div>
      <Paragraph>
        This is where the real learning happens. Pre-training is the massive, expensive process where the
        model reads through all the data we collected and learns to <strong>predict the next word</strong>.
        That's it — the entire foundation of language AI is built on one simple task: "Given these words,
        what word comes next?"
      </Paragraph>

      <AnalogyBox emoji="📝" title="Kid-Friendly Analogy" color={color}>
        Imagine the world's hardest fill-in-the-blank test — with trillions of questions! The AI reads a
        sentence with the last word hidden and tries to guess it. At first, it guesses randomly ("The sky
        is... <em>banana</em>?"). But after seeing billions of examples, it learns patterns and starts
        getting them right ("The sky is... <em>blue</em>!"). It's like studying for a test by doing
        practice problems over and over and over.
      </AnalogyBox>

      <SectionTitle color={color}>How Next-Token Prediction Works</SectionTitle>
      <Paragraph>
        The model sees a sequence of tokens and must predict what comes next. After each guess, it checks
        the real answer and adjusts its 175 billion parameters slightly to do better next time. This is
        called <strong>gradient descent</strong> — nudging the knobs a tiny bit in the right direction.
      </Paragraph>

      <div style={{ display: "flex", gap: 12, margin: "20px 0", flexWrap: "wrap" }}>
        <StatBubble value="~300B" label="tokens seen in training" color={color} />
        <StatBubble value="~$100M" label="compute cost (est.)" color="#666" />
        <StatBubble value="~3 months" label="training time" color="#666" />
        <StatBubble value="~10,000" label="GPUs running 24/7" color="#666" />
      </div>

      <SectionTitle color={color}>Play the Prediction Game!</SectionTitle>
      <Paragraph>
        Try being the AI! Can you guess the missing word? This is exactly what the model does
        trillions of times during training.
      </Paragraph>

      <InteractiveLabel />
      <SectionCard>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
        }}>
          <div style={{
            fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#888",
          }}>
            Question {currentExample + 1}/{TRAINING_EXAMPLES.length}
          </div>
          <div style={{
            fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            color: score.total > 0 ? color : "#aaa", fontWeight: 700,
          }}>
            Score: {score.correct}/{score.total}
          </div>
        </div>

        <div style={{
          padding: "20px 24px", background: "#f8fafc", borderRadius: 12,
          textAlign: "center", marginBottom: 16,
          fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 20, color: "#222",
        }}>
          {ex.prompt} <span style={{
            display: "inline-block", minWidth: 80, borderBottom: `3px dashed ${color}`,
            color: guess ? (guess === ex.answer ? "#16a34a" : "#dc2626") : color,
            fontWeight: 700, padding: "0 4px",
          }}>
            {guess || "___"}
          </span>
        </div>

        {!guess ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {shuffledOptions.map((opt, i) => (
              <button key={i} onClick={() => handleGuess(opt)} style={{
                padding: "14px", borderRadius: 10, border: "2px solid #e5e7eb",
                background: "white", fontSize: 16, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", color: "#333",
                transition: "all 0.2s",
              }}
                onMouseOver={e => { e.target.style.borderColor = color; e.target.style.background = `${color}08`; }}
                onMouseOut={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "white"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ animation: "fadeSlideUp 0.3s" }}>
            <div style={{
              padding: "16px", borderRadius: 12, textAlign: "center",
              background: guess === ex.answer ? "#f0fdf4" : "#fef2f2",
              border: `2px solid ${guess === ex.answer ? "#86efac" : "#fca5a5"}`,
              marginBottom: 12,
            }}>
              <div style={{
                fontSize: 24, fontWeight: 800,
                color: guess === ex.answer ? "#16a34a" : "#dc2626",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {guess === ex.answer ? "✅ Correct!" : "❌ Not quite!"}
              </div>
              {guess !== ex.answer && (
                <div style={{ fontSize: 14, color: "#666", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                  The answer was: <strong>{ex.answer}</strong>
                </div>
              )}
              <div style={{
                fontSize: 13, color: "#888", marginTop: 8,
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}>
                {guess === ex.answer
                  ? "The AI would also get this right after training! Its parameters barely change."
                  : "When the AI gets it wrong, it adjusts millions of parameters slightly to do better next time."
                }
              </div>
            </div>
            <button onClick={nextExample} style={{
              width: "100%", padding: "12px", background: color, color: "white",
              border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              Next Question →
            </button>
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>The Loss Curve — Watching the AI Learn</SectionTitle>
      <Paragraph>
        During training, we track a number called <strong>loss</strong> — it measures how wrong the model's
        guesses are. A high loss means lots of mistakes. As training progresses, the loss goes down, meaning
        the model is getting smarter!
      </Paragraph>

      <InteractiveLabel />
      <SectionCard>
        {!showLossChart ? (
          <button onClick={() => setShowLossChart(true)} style={{
            width: "100%", padding: "12px", background: color, color: "white",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            📉 Show Training Loss Curve
          </button>
        ) : (
          <div style={{ animation: "fadeSlideUp 0.5s" }}>
            <div style={{ position: "relative", height: 180, margin: "10px 0" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 20, width: 1,
                background: "#e5e7eb",
              }} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 20, height: 1,
                background: "#e5e7eb",
              }} />
              <svg width="100%" height="160" viewBox="0 0 300 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {lossValues.length > 0 && (
                  <>
                    <path d={`M 0 ${140 - (lossValues[0] / 12) * 130} ${lossValues.map((v, i) =>
                      `L ${(i / (lossValues.length - 1)) * 300} ${140 - (v / 12) * 130}`
                    ).join(" ")} L 300 140 L 0 140 Z`} fill="url(#lossGrad)" />
                    <path d={`M 0 ${140 - (lossValues[0] / 12) * 130} ${lossValues.map((v, i) =>
                      `L ${(i / (lossValues.length - 1)) * 300} ${140 - (v / 12) * 130}`
                    ).join(" ")}`} fill="none" stroke={color} strokeWidth="2.5" />
                    {lossValues.map((v, i) => (
                      <circle key={i} cx={(i / (lossValues.length - 1)) * 300}
                        cy={140 - (v / 12) * 130} r="3" fill={color}
                        style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }} />
                    ))}
                  </>
                )}
              </svg>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "#aaa", fontFamily: "'DM Sans', sans-serif",
              }}>
                <span>Start</span>
                <span>Training Progress →</span>
                <span>End</span>
              </div>
            </div>
            <div style={{
              fontSize: 13, color: "#666", textAlign: "center",
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}>
              📉 Loss started at ~11 and dropped to ~1.5 — the model went from random guessing to pretty smart!
            </div>
          </div>
        )}
      </SectionCard>

      <TechDetail color={color}>
        <div>Pre-training uses <strong style={{ color: "#60a5fa" }}>causal language modeling</strong> — the model only sees previous tokens, not future ones.</div>
        <div style={{ marginTop: 6 }}>Optimizer: <strong style={{ color: "#fbbf24" }}>AdamW</strong> with learning rate warmup + cosine decay schedule.</div>
        <div style={{ marginTop: 6 }}>Batch sizes can be enormous: 3.2 million tokens per batch for GPT-3.</div>
        <div style={{ marginTop: 6 }}>Training GPT-4 reportedly cost over $100 million in compute alone.</div>
        <div style={{ marginTop: 6 }}>The model sees each token only ~1-2 times (1-2 epochs) — unlike humans who re-read things many times.</div>
      </TechDetail>
    </div>
  );
}

// ─── STAGE 4: RLHF ──────────────────────────────────────────

function RLHFStage() {
  const color = STAGES[4].color;
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showReveal, setShowReveal] = useState(false);
  const [ratings, setRatings] = useState({});
  const scenario = RLHF_SCENARIOS[scenarioIdx];

  const handleSelect = (i) => {
    setSelectedResponse(i);
    setShowReveal(true);
  };

  const nextScenario = () => {
    setSelectedResponse(null);
    setShowReveal(false);
    setScenarioIdx(prev => (prev + 1) % RLHF_SCENARIOS.length);
  };

  return (
    <div>
      <Paragraph>
        After pre-training, the model can predict text — but it's not very <em>useful</em> yet. It might
        write beautiful prose but also give dangerous advice, be rude, or make things up. This is where
        <strong> fine-tuning and RLHF</strong> come in — teaching the AI to be helpful, harmless, and honest.
      </Paragraph>

      <AnalogyBox emoji="👩‍🏫" title="Kid-Friendly Analogy" color={color}>
        Imagine a super-smart student who's read every book in the library but has no manners and doesn't
        know when they're being inappropriate. Fine-tuning is like giving them etiquette classes! Human
        teachers show the AI thousands of examples of good behavior vs. bad behavior, and the AI learns
        which type of responses humans actually prefer.
      </AnalogyBox>

      <SectionTitle color={color}>The Three Steps of Alignment</SectionTitle>
      <div style={{
        display: "flex", gap: 12, margin: "16px 0", flexWrap: "wrap",
      }}>
        {[
          { step: "1", title: "Supervised Fine-Tuning (SFT)", desc: "Humans write ideal responses to thousands of prompts. The model learns to mimic this style.", icon: "✍️" },
          { step: "2", title: "Reward Model Training", desc: "Humans rank multiple AI responses from best to worst. A separate model learns what 'good' means.", icon: "🏆" },
          { step: "3", title: "Reinforcement Learning (PPO/DPO)", desc: "The AI generates responses and gets 'rewarded' for good ones, learning to produce better outputs.", icon: "🎮" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: "1 1 250px", padding: "20px", borderRadius: 14,
            background: "white", border: `2px solid ${color}22`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: "50%", background: color,
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans', sans-serif",
              }}>{s.step}</span>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#222", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
              {s.title}
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5, fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle color={color}>Be the Human Rater!</SectionTitle>
      <Paragraph>
        In RLHF, human raters look at AI responses and pick the best one. Try it yourself! Read the question
        and pick which response you think is best. Then see how real raters would score them.
      </Paragraph>

      <InteractiveLabel />
      <SectionCard>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
            Scenario {scenarioIdx + 1}/{RLHF_SCENARIOS.length}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {RLHF_SCENARIOS.map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i === scenarioIdx ? color : "#ddd",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>

        <div style={{
          padding: "16px 20px", background: "#f8fafc", borderRadius: 12,
          marginBottom: 16, borderLeft: `4px solid ${color}`,
        }}>
          <div style={{
            fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, marginBottom: 4,
          }}>USER ASKS:</div>
          <div style={{
            fontSize: 17, color: "#222", fontFamily: "'Source Serif 4', Georgia, serif",
            fontWeight: 600,
          }}>"{scenario.question}"</div>
        </div>

        <div style={{
          fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, marginBottom: 10,
        }}>
          {showReveal ? "RESULTS:" : "Which response is best? Click to choose:"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scenario.responses.map((resp, i) => {
            const isSelected = selectedResponse === i;
            const isBest = resp.score > 8;
            return (
              <button key={i} onClick={() => !showReveal && handleSelect(i)}
                disabled={showReveal}
                style={{
                  padding: "16px 20px", borderRadius: 12, textAlign: "left",
                  border: `2px solid ${showReveal
                    ? (isBest ? "#86efac" : resp.score < 2 ? "#fca5a5" : "#fbbf24")
                    : isSelected ? color : "#e5e7eb"}`,
                  background: showReveal
                    ? (isBest ? "#f0fdf4" : resp.score < 2 ? "#fef2f2" : "#fffbeb")
                    : isSelected ? `${color}08` : "white",
                  cursor: showReveal ? "default" : "pointer",
                  transition: "all 0.3s",
                }}>
                <div style={{
                  fontSize: 14, color: "#333", lineHeight: 1.6,
                  fontFamily: "'Source Serif 4', Georgia, serif",
                }}>
                  {resp.text}
                </div>
                {showReveal && (
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee",
                    animation: "fadeSlideUp 0.3s",
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                      color: isBest ? "#16a34a" : resp.score < 2 ? "#dc2626" : "#d97706",
                      background: isBest ? "#dcfce7" : resp.score < 2 ? "#fee2e2" : "#fef3c7",
                      padding: "3px 10px", borderRadius: 20,
                    }}>
                      {resp.label}
                    </span>
                    <span style={{
                      fontSize: 18, fontWeight: 800, fontFamily: "'DM Sans', sans-serif",
                      color: isBest ? "#16a34a" : resp.score < 2 ? "#dc2626" : "#d97706",
                    }}>
                      {resp.score}/10
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {showReveal && (
          <div style={{ marginTop: 16, animation: "fadeSlideUp 0.3s" }}>
            <div style={{
              padding: "14px", background: `${color}08`, borderRadius: 10,
              fontSize: 13, color: "#555", fontFamily: "'Source Serif 4', Georgia, serif",
              marginBottom: 12,
            }}>
              {selectedResponse === scenario.responses.findIndex(r => r.score > 8)
                ? "🎉 Great choice! You picked the same response that human raters preferred. The reward model learns from thousands of choices like this."
                : "Interesting pick! Human raters generally preferred the highest-scored response. The reward model learns from seeing thousands of these comparisons."
              }
            </div>
            <button onClick={nextScenario} style={{
              width: "100%", padding: "12px", background: color, color: "white",
              border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              Next Scenario →
            </button>
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>Why Does This Matter?</SectionTitle>
      <Paragraph>
        Without RLHF, a language model is like a powerful engine without a steering wheel. It can generate
        fluent text, but it might also generate lies, toxic content, or dangerous instructions. RLHF
        teaches the model to be <strong>helpful</strong> (actually answer questions), <strong>harmless</strong>
        (refuse dangerous requests politely), and <strong>honest</strong> (admit when it doesn't know something).
      </Paragraph>

      <TechDetail color={color}>
        <div><strong style={{ color: "#f472b6" }}>SFT</strong>: Typically uses 10,000-100,000 high-quality human-written examples.</div>
        <div style={{ marginTop: 6 }}><strong style={{ color: "#f472b6" }}>Reward Model</strong>: Trained on ~100K-500K human preference comparisons.</div>
        <div style={{ marginTop: 6 }}><strong style={{ color: "#f472b6" }}>PPO vs. DPO</strong>: PPO (Proximal Policy Optimization) uses the reward model in a RL loop. DPO (Direct Preference Optimization) skips the reward model entirely, learning directly from preference pairs.</div>
        <div style={{ marginTop: 6 }}>Anthropic (Claude's maker) also uses <strong style={{ color: "#fbbf24" }}>Constitutional AI (CAI)</strong> — the AI critiques its own outputs using a set of principles.</div>
        <div style={{ marginTop: 6 }}>The "alignment tax" — RLHF can slightly reduce raw capability, but massively improves usefulness and safety.</div>
      </TechDetail>
    </div>
  );
}

// ─── STAGE 5: INFERENCE ──────────────────────────────────────

function InferenceStage() {
  const color = STAGES[5].color;
  const [input, setInput] = useState("What is the moon?");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTokens, setGeneratedTokens] = useState([]);
  const [temperature, setTemperature] = useState(0.7);
  const [showTopK, setShowTopK] = useState(false);
  const intervalRef = useRef(null);

  const responses = {
    "What is the moon?": ["The", " moon", " is", " Earth's", " only", " natural", " satellite,", " orbiting", " at", " about", " 384,400", " km", " away.", " It", " influences", " our", " tides", " and", " illuminates", " the", " night", " sky."],
    default: ["That's", " a", " great", " question!", " Let", " me", " think", " about", " this", " carefully.", " Based", " on", " my", " training,", " I", " would", " say", " the", " answer", " involves", " many", " interesting", " factors."],
  };

  const generate = () => {
    setIsGenerating(true);
    setGeneratedTokens([]);
    const tokens = responses[input] || responses.default;
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= tokens.length) {
        clearInterval(intervalRef.current);
        setIsGenerating(false);
        return;
      }
      setGeneratedTokens(prev => [...prev, tokens[i]]);
      i++;
    }, 120);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <Paragraph>
        After months of training and fine-tuning, the model is finally ready to talk! <strong>Inference</strong> is
        when you actually use the model — you type a question, and it generates an answer, one token at a
        time. Every response you've ever seen from ChatGPT, Claude, or any other AI was generated this way.
      </Paragraph>

      <AnalogyBox emoji="🎹" title="Kid-Friendly Analogy" color={color}>
        It's like a pianist who spent years practicing (training). Now they're on stage, playing a song
        one note at a time. Each note they play depends on all the notes that came before — they're not
        reading sheet music, they're <em>composing in real-time</em> based on everything they learned!
      </AnalogyBox>

      <SectionTitle color={color}>How Token Generation Works</SectionTitle>
      <Paragraph>
        When you ask a question, here's what happens for <em>every single token</em> in the response:
      </Paragraph>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
        {[
          { step: "1", text: "Your prompt is tokenized and fed into the transformer", icon: "📥" },
          { step: "2", text: "Data flows through all 96+ layers (in milliseconds!)", icon: "⚡" },
          { step: "3", text: "The model outputs a probability for every possible next token (~50,000 options)", icon: "📊" },
          { step: "4", text: "One token is selected based on these probabilities + temperature setting", icon: "🎲" },
          { step: "5", text: "That token is added to the sequence, and we go back to step 1 for the next token", icon: "🔄" },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
            borderRadius: 10, background: "#fafafa", border: "1px solid #f0f0f0",
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: "50%", background: `${color}22`,
              color, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
            }}>{s.step}</span>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
            <span style={{
              fontSize: 14, color: "#444",
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}>{s.text}</span>
          </div>
        ))}
      </div>

      <SectionTitle color={color}>Watch Token-by-Token Generation</SectionTitle>
      <InteractiveLabel />
      <SectionCard>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6,
            fontFamily: "'DM Sans', sans-serif",
          }}>YOUR PROMPT:</div>
          <div style={{
            padding: "14px 18px", background: "#f8fafc", borderRadius: 10,
            fontSize: 16, fontFamily: "'Source Serif 4', Georgia, serif",
            borderLeft: `4px solid ${color}`,
          }}>
            {input}
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          padding: "12px 16px", background: "#fffbeb", borderRadius: 10,
          border: "1px solid #fbbf2444",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
            🌡️ Temperature:
          </span>
          <input type="range" min="0" max="1.5" step="0.1" value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: color }}
          />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
            fontWeight: 700, color: temperature < 0.3 ? "#2563eb" : temperature > 1 ? "#dc2626" : "#d97706",
            minWidth: 30,
          }}>{temperature}</span>
        </div>

        <div style={{
          fontSize: 12, color: "#888", marginBottom: 16, textAlign: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {temperature < 0.3 ? "🧊 Very focused — picks the most likely tokens (less creative)"
            : temperature > 1 ? "🔥 Very random — more creative but might not make sense"
            : "⚖️ Balanced — creative but still coherent"}
        </div>

        {!isGenerating && generatedTokens.length === 0 && (
          <button onClick={generate} style={{
            width: "100%", padding: "14px", background: color, color: "white",
            border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            ✨ Generate Response!
          </button>
        )}

        {(isGenerating || generatedTokens.length > 0) && (
          <div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6,
              fontFamily: "'DM Sans', sans-serif",
            }}>AI RESPONSE (token by token):</div>
            <div style={{
              padding: "16px 20px", background: "#f0fdf4", borderRadius: 10,
              minHeight: 60, border: "2px solid #86efac44",
            }}>
              <span style={{
                fontSize: 16, lineHeight: 1.7,
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}>
                {generatedTokens.map((t, i) => (
                  <span key={i} style={{
                    animation: "tokenAppear 0.2s ease-out",
                    background: i === generatedTokens.length - 1 ? "#bbf7d0" : "transparent",
                    borderRadius: 3, transition: "background 0.5s",
                  }}>{t}</span>
                ))}
              </span>
              {isGenerating && <span style={{
                display: "inline-block", width: 2, height: 18,
                background: color, marginLeft: 2,
                animation: "blink 0.8s infinite",
                verticalAlign: "text-bottom",
              }} />}
            </div>
            <div style={{
              marginTop: 10, fontSize: 13, color: "#888", textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {isGenerating
                ? `⏳ Generating... ${generatedTokens.length} tokens so far`
                : `✅ Done! Generated ${generatedTokens.length} tokens`
              }
            </div>
            {!isGenerating && (
              <button onClick={() => { setGeneratedTokens([]); }} style={{
                width: "100%", padding: "12px", background: "#f3f4f6", color: "#666",
                border: "2px solid #e5e7eb", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 10,
              }}>
                🔄 Reset & Try Again
              </button>
            )}
          </div>
        )}
      </SectionCard>

      <SectionTitle color={color}>What is Temperature?</SectionTitle>
      <Paragraph>
        Temperature controls how "creative" vs. "focused" the AI is. At <strong>temperature 0</strong>,
        the model always picks the most probable next token — very safe but boring. At <strong>temperature
        1.5+</strong>, it picks more random tokens — creative but sometimes nonsensical. Most chatbots
        use a temperature between 0.5 and 0.9 for a nice balance.
      </Paragraph>

      <SectionCard style={{ margin: "16px 0" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
          textAlign: "center",
        }}>
          {[
            { temp: "0.0", label: "Deterministic", example: "The sky is blue.", emoji: "🧊" },
            { temp: "0.7", label: "Balanced", example: "The sky shimmers with light.", emoji: "⚖️" },
            { temp: "1.5", label: "Wild", example: "The sky dances on whispers!", emoji: "🔥" },
          ].map((t, i) => (
            <div key={i} style={{
              padding: "14px", borderRadius: 10,
              background: i === 1 ? `${color}11` : "#f9fafb",
              border: `2px solid ${i === 1 ? color : "#e5e7eb"}`,
            }}>
              <div style={{ fontSize: 24 }}>{t.emoji}</div>
              <div style={{
                fontWeight: 800, fontSize: 20, color,
                fontFamily: "'DM Sans', sans-serif", margin: "4px 0",
              }}>{t.temp}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "#666",
                fontFamily: "'DM Sans', sans-serif",
              }}>{t.label}</div>
              <div style={{
                fontSize: 12, color: "#888", marginTop: 6,
                fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic",
              }}>"{t.example}"</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionTitle color={color}>The Full Journey — Recap!</SectionTitle>
      <div style={{
        display: "flex", flexDirection: "column", gap: 6, margin: "16px 0",
      }}>
        {STAGES.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
            borderRadius: 10, background: `${s.color}08`, border: `1px solid ${s.color}22`,
          }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{
                fontWeight: 700, fontSize: 14, color: s.color,
                fontFamily: "'DM Sans', sans-serif",
              }}>Stage {i + 1}: {s.title}</span>
            </div>
            <span style={{ fontSize: 12, color: "#aaa" }}>✅</span>
          </div>
        ))}
      </div>

      <Paragraph>
        And that's how a Large Language Model is built! From raw internet data, through tokenization,
        a massive neural network, months of training, human feedback alignment, and finally — the moment
        you type a message and get a response. It's one of the most complex engineering achievements in
        human history, involving thousands of researchers, billions of dollars, and trillions of
        calculations. Pretty amazing, right? 🎉
      </Paragraph>

      <TechDetail color={color}>
        <div>Inference is much cheaper than training — but still requires powerful GPUs (A100/H100).</div>
        <div style={{ marginTop: 6 }}>Techniques like <strong style={{ color: "#fbbf24" }}>KV caching</strong>, <strong style={{ color: "#fbbf24" }}>speculative decoding</strong>, and <strong style={{ color: "#fbbf24" }}>quantization</strong> (INT4/INT8) make inference faster and cheaper.</div>
        <div style={{ marginTop: 6 }}>A single response might require ~10 billion floating point operations <em>per token</em>.</div>
        <div style={{ marginTop: 6 }}>Top-p (nucleus) sampling and top-k sampling are alternatives/complements to temperature for controlling output diversity.</div>
      </TechDetail>
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────

function LandingPage({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      padding: 32,
    }}>
      <div style={{ textAlign: "center", maxWidth: 560, animation: "fadeSlideUp 0.8s ease-out" }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>
          🧠
        </div>
        <h1 style={{
          fontSize: 42, fontWeight: 900, lineHeight: 1.15,
          fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px",
          background: "linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          How Large Language Models Are Built
        </h1>
        <p style={{
          fontSize: 18, color: "#94a3b8", lineHeight: 1.6,
          fontFamily: "'Source Serif 4', Georgia, serif",
          margin: "0 0 32px",
        }}>
          An interactive journey from raw data to intelligent conversation.
          Explore all 6 stages of creating an AI like ChatGPT or Claude — with
          hands-on simulations, animations, and plain-English explanations.
        </p>
        <div style={{
          display: "flex", gap: 12, margin: "24px 0", justifyContent: "center", flexWrap: "wrap",
        }}>
          {STAGES.map((s, i) => (
            <div key={i} style={{
              padding: "6px 14px", borderRadius: 20,
              background: `${s.color}22`, color: s.color,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              border: `1px solid ${s.color}44`,
            }}>
              {s.icon} {s.title}
            </div>
          ))}
        </div>
        <button onClick={onStart} style={{
          padding: "18px 48px", fontSize: 18, fontWeight: 800,
          background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
          color: "white", border: "none", borderRadius: 16,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 0 40px rgba(139,92,246,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseOver={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 0 60px rgba(139,92,246,0.6)"; }}
          onMouseOut={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 40px rgba(139,92,246,0.4)"; }}
        >
          Start the Journey →
        </button>
        <div style={{
          marginTop: 24, fontSize: 13, color: "#64748b",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ⏱️ ~15 minutes · Interactive · No coding needed
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

const STAGE_COMPONENTS = [
  DataCollectionStage,
  TokenizationStage,
  TransformerStage,
  PreTrainingStage,
  RLHFStage,
  InferenceStage,
];

export default function LLMSimulator() {
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const contentRef = useRef(null);

  const navigate = (newStage) => {
    setStage(newStage);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!started) return <LandingPage onStart={() => setStarted(true)} />;

  const StageComponent = STAGE_COMPONENTS[stage];
  const currentStage = STAGES[stage];

  return (
    <div style={{
      minHeight: "100vh",
      background: currentStage.bg,
      transition: "background 0.5s",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes tokenAppear {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input { font-family: inherit; }
      `}</style>

      <ProgressBar stage={stage} onNavigate={navigate} />

      <div ref={contentRef} style={{
        maxWidth: 760, margin: "0 auto", padding: "32px 24px 120px",
      }}>
        {/* Stage Header */}
        <div style={{
          marginBottom: 32, animation: "fadeSlideUp 0.5s ease-out",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: currentStage.color,
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase", letterSpacing: "1px",
            }}>
              Stage {stage + 1} of {STAGES.length}
            </span>
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 900, color: "#111",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}>
            {currentStage.icon} {currentStage.title}
          </h1>
        </div>

        {/* Stage Content */}
        <div key={stage} style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
          <StageComponent />
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderTop: "1px solid #e5e7eb", padding: "12px 24px",
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <button onClick={() => navigate(stage - 1)} disabled={stage === 0} style={{
            padding: "12px 24px", borderRadius: 10,
            background: stage === 0 ? "#f3f4f6" : "white",
            color: stage === 0 ? "#ccc" : "#444",
            border: `2px solid ${stage === 0 ? "#f3f4f6" : "#e5e7eb"}`,
            fontSize: 15, fontWeight: 700, cursor: stage === 0 ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ← Back
          </button>
          <span style={{
            fontSize: 13, color: "#aaa",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {stage + 1} / {STAGES.length}
          </span>
          <button onClick={() => navigate(stage + 1)} disabled={stage === STAGES.length - 1} style={{
            padding: "12px 24px", borderRadius: 10,
            background: stage === STAGES.length - 1 ? "#f3f4f6" : currentStage.color,
            color: stage === STAGES.length - 1 ? "#ccc" : "white",
            border: "none", fontSize: 15, fontWeight: 700,
            cursor: stage === STAGES.length - 1 ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
