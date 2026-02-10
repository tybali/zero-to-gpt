// Comprehensive LLM Lifecycle Stages Data

export interface Stage {
  id: number;
  slug: string;
  phase: string;
  phaseNumber: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgGradient: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  keyTopics: string[];
}

export const PHASES = [
  { number: 1, name: "Foundation", icon: "🎯", color: "#6366f1" },
  { number: 2, name: "Data", icon: "📊", color: "#10b981" },
  { number: 3, name: "Architecture", icon: "🧠", color: "#8b5cf6" },
  { number: 4, name: "Training", icon: "⚡", color: "#f59e0b" },
  { number: 5, name: "Alignment", icon: "🎓", color: "#ec4899" },
  { number: 6, name: "Evaluation", icon: "📋", color: "#06b6d4" },
  { number: 7, name: "Production", icon: "🚀", color: "#ef4444" },
  { number: 8, name: "Operations", icon: "🔄", color: "#84cc16" },
];

export const STAGES: Stage[] = [
  // Phase 1: Foundation
  {
    id: 1,
    slug: "research-vision",
    phase: "Foundation",
    phaseNumber: 1,
    icon: "🔬",
    title: "Research & Vision",
    subtitle: "Day 0: Where It All Begins",
    description: "Understanding the problem space, defining objectives, and surveying the landscape of language AI research.",
    color: "#6366f1",
    bgGradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    duration: "~5 min",
    difficulty: "beginner",
    keyTopics: ["Why LLMs?", "History of NLP", "Key Research Papers", "Problem Definition"],
  },
  {
    id: 2,
    slug: "architecture-planning",
    phase: "Foundation",
    phaseNumber: 1,
    icon: "📐",
    title: "Architecture Planning",
    subtitle: "Blueprint for Intelligence",
    description: "Planning compute requirements, team structure, infrastructure, and making critical architectural decisions.",
    color: "#818cf8",
    bgGradient: "from-violet-500/10 via-indigo-500/5 to-transparent",
    duration: "~6 min",
    difficulty: "intermediate",
    keyTopics: ["Compute Planning", "Team Structure", "Infrastructure", "Cost Estimation"],
  },

  // Phase 2: Data
  {
    id: 3,
    slug: "data-collection",
    phase: "Data",
    phaseNumber: 2,
    icon: "🌍",
    title: "Data Collection",
    subtitle: "Gathering the World's Knowledge",
    description: "Crawling the web, licensing books, collecting code repositories, and assembling the training corpus.",
    color: "#10b981",
    bgGradient: "from-emerald-500/10 via-green-500/5 to-transparent",
    duration: "~7 min",
    difficulty: "beginner",
    keyTopics: ["Web Crawling", "Common Crawl", "Data Sources", "Licensing"],
  },
  {
    id: 4,
    slug: "data-processing",
    phase: "Data",
    phaseNumber: 2,
    icon: "🧹",
    title: "Data Processing & Quality",
    subtitle: "Cleaning the Chaos",
    description: "Deduplication, filtering toxic content, removing PII, and ensuring data quality at scale.",
    color: "#34d399",
    bgGradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    duration: "~6 min",
    difficulty: "intermediate",
    keyTopics: ["Deduplication", "Quality Filtering", "PII Removal", "Data Versioning"],
  },
  {
    id: 5,
    slug: "tokenization",
    phase: "Data",
    phaseNumber: 2,
    icon: "✂️",
    title: "Tokenization",
    subtitle: "Breaking Language into Pieces",
    description: "Converting text into tokens using BPE, WordPiece, or SentencePiece algorithms.",
    color: "#059669",
    bgGradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
    duration: "~8 min",
    difficulty: "intermediate",
    keyTopics: ["BPE Algorithm", "Vocabulary Size", "Subword Tokenization", "Special Tokens"],
  },

  // Phase 3: Architecture
  {
    id: 6,
    slug: "transformer-architecture",
    phase: "Architecture",
    phaseNumber: 3,
    icon: "🏗️",
    title: "Transformer Deep Dive",
    subtitle: "The Architecture That Changed Everything",
    description: "Understanding self-attention, feed-forward networks, embeddings, and the full transformer architecture.",
    color: "#8b5cf6",
    bgGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    duration: "~10 min",
    difficulty: "intermediate",
    keyTopics: ["Self-Attention", "Multi-Head Attention", "Feed-Forward", "Layer Normalization"],
  },
  {
    id: 7,
    slug: "modern-innovations",
    phase: "Architecture",
    phaseNumber: 3,
    icon: "💡",
    title: "Modern Innovations",
    subtitle: "State-of-the-Art Techniques",
    description: "Flash Attention, RoPE, GQA, Mixture of Experts, and other cutting-edge improvements.",
    color: "#a78bfa",
    bgGradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    duration: "~8 min",
    difficulty: "advanced",
    keyTopics: ["Flash Attention", "RoPE", "GQA", "Mixture of Experts"],
  },
  {
    id: 8,
    slug: "scaling-laws",
    phase: "Architecture",
    phaseNumber: 3,
    icon: "📈",
    title: "Scaling Laws",
    subtitle: "The Science of Getting Bigger",
    description: "Chinchilla scaling laws, compute-optimal training, and understanding the power of scale.",
    color: "#c084fc",
    bgGradient: "from-fuchsia-500/10 via-purple-500/5 to-transparent",
    duration: "~6 min",
    difficulty: "advanced",
    keyTopics: ["Chinchilla Laws", "Compute Optimal", "Emergent Abilities", "Model Sizing"],
  },

  // Phase 4: Training
  {
    id: 9,
    slug: "training-infrastructure",
    phase: "Training",
    phaseNumber: 4,
    icon: "🖥️",
    title: "Training Infrastructure",
    subtitle: "Building the Compute Cluster",
    description: "GPU clusters, distributed training, data parallelism, model parallelism, and pipeline parallelism.",
    color: "#f59e0b",
    bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    duration: "~7 min",
    difficulty: "advanced",
    keyTopics: ["GPU Clusters", "Data Parallelism", "Model Parallelism", "DeepSpeed/FSDP"],
  },
  {
    id: 10,
    slug: "pretraining-process",
    phase: "Training",
    phaseNumber: 4,
    icon: "📖",
    title: "Pre-training Process",
    subtitle: "Learning to Predict",
    description: "Next-token prediction, loss functions, optimizers, learning rate schedules, and checkpointing.",
    color: "#fbbf24",
    bgGradient: "from-yellow-500/10 via-amber-500/5 to-transparent",
    duration: "~9 min",
    difficulty: "intermediate",
    keyTopics: ["Causal LM", "AdamW Optimizer", "Cosine Schedule", "Gradient Checkpointing"],
  },

  // Phase 5: Alignment
  {
    id: 11,
    slug: "supervised-finetuning",
    phase: "Alignment",
    phaseNumber: 5,
    icon: "👩‍🏫",
    title: "Supervised Fine-tuning",
    subtitle: "Teaching the Model to Follow Instructions",
    description: "Instruction tuning, chat formatting, and creating the foundation for helpful AI assistants.",
    color: "#ec4899",
    bgGradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    duration: "~7 min",
    difficulty: "intermediate",
    keyTopics: ["Instruction Tuning", "Chat Templates", "LoRA/QLoRA", "Data Quality"],
  },
  {
    id: 12,
    slug: "rlhf-dpo",
    phase: "Alignment",
    phaseNumber: 5,
    icon: "🏆",
    title: "RLHF & DPO",
    subtitle: "Learning from Human Preferences",
    description: "Reward modeling, PPO, DPO, Constitutional AI, and aligning models with human values.",
    color: "#f472b6",
    bgGradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    duration: "~10 min",
    difficulty: "advanced",
    keyTopics: ["Reward Models", "PPO", "DPO", "Constitutional AI"],
  },

  // Phase 6: Evaluation
  {
    id: 13,
    slug: "benchmarking",
    phase: "Evaluation",
    phaseNumber: 6,
    icon: "📊",
    title: "Benchmarking & Evals",
    subtitle: "Measuring Intelligence",
    description: "MMLU, HumanEval, MT-Bench, safety evaluations, and comprehensive model assessment.",
    color: "#06b6d4",
    bgGradient: "from-cyan-500/10 via-sky-500/5 to-transparent",
    duration: "~8 min",
    difficulty: "intermediate",
    keyTopics: ["MMLU", "HumanEval", "MT-Bench", "Red Teaming"],
  },

  // Phase 7: Production
  {
    id: 14,
    slug: "model-optimization",
    phase: "Production",
    phaseNumber: 7,
    icon: "⚙️",
    title: "Model Optimization",
    subtitle: "Making It Fast and Small",
    description: "Quantization, pruning, distillation, and techniques to make models production-ready.",
    color: "#ef4444",
    bgGradient: "from-red-500/10 via-orange-500/5 to-transparent",
    duration: "~7 min",
    difficulty: "advanced",
    keyTopics: ["Quantization (INT4/INT8)", "Pruning", "Distillation", "GGUF/GGML"],
  },
  {
    id: 15,
    slug: "deployment-serving",
    phase: "Production",
    phaseNumber: 7,
    icon: "🚀",
    title: "Deployment & Serving",
    subtitle: "Launching to the World",
    description: "vLLM, TensorRT-LLM, API design, load balancing, and production infrastructure.",
    color: "#f87171",
    bgGradient: "from-rose-500/10 via-red-500/5 to-transparent",
    duration: "~8 min",
    difficulty: "advanced",
    keyTopics: ["vLLM", "TensorRT-LLM", "KV Caching", "Speculative Decoding"],
  },

  // Phase 8: Operations
  {
    id: 16,
    slug: "continuous-learning",
    phase: "Operations",
    phaseNumber: 8,
    icon: "🔄",
    title: "Continuous Learning & MLOps",
    subtitle: "The Never-Ending Journey",
    description: "Monitoring, feedback loops, model updates, A/B testing, and maintaining AI systems in production.",
    color: "#84cc16",
    bgGradient: "from-lime-500/10 via-green-500/5 to-transparent",
    duration: "~6 min",
    difficulty: "intermediate",
    keyTopics: ["Monitoring", "Drift Detection", "A/B Testing", "Model Versioning"],
  },
];

export const TOTAL_DURATION = "~2 hours";
export const TOTAL_STAGES = STAGES.length;

export function getStageBySlug(slug: string): Stage | undefined {
  return STAGES.find((stage) => stage.slug === slug);
}

export function getStagesByPhase(phaseNumber: number): Stage[] {
  return STAGES.filter((stage) => stage.phaseNumber === phaseNumber);
}

export function getNextStage(currentSlug: string): Stage | undefined {
  const currentIndex = STAGES.findIndex((stage) => stage.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === STAGES.length - 1) return undefined;
  return STAGES[currentIndex + 1];
}

export function getPreviousStage(currentSlug: string): Stage | undefined {
  const currentIndex = STAGES.findIndex((stage) => stage.slug === currentSlug);
  if (currentIndex <= 0) return undefined;
  return STAGES[currentIndex - 1];
}

export function getStageProgress(currentSlug: string): number {
  const currentIndex = STAGES.findIndex((stage) => stage.slug === currentSlug);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / STAGES.length) * 100;
}
