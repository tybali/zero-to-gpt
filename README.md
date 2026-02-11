# Zero to GPT

An interactive learning platform that guides you through the complete LLM lifecycle—from research and data collection to production deployment.

## Overview

Zero to GPT breaks down the complex process of building large language models into 16 comprehensive stages across 8 phases. Each stage includes interactive visualizations, code playgrounds, and detailed explanations to help you understand how modern LLMs like GPT are built from scratch.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Framer Motion** for animations
- **Recharts** for visualizations

## Learning Stages

| Phase | Stages |
|-------|--------|
| **Foundation** | Research & Vision, Architecture Planning |
| **Data** | Data Collection, Data Processing & Quality, Tokenization |
| **Architecture** | Transformer Deep Dive, Modern Innovations, Scaling Laws |
| **Training** | Training Infrastructure, Pre-training Process |
| **Alignment** | Supervised Fine-tuning, RLHF & DPO |
| **Evaluation** | Benchmarking & Evals |
| **Production** | Model Optimization, Deployment & Serving |
| **Operations** | Continuous Learning & MLOps |

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Docker

```bash
# Build and push to GHCR
./scripts/build-and-push.sh

# Or with a custom tag
./scripts/build-and-push.sh v1.0.0

# Run locally
docker run -p 3000:3000 ghcr.io/tybali/zero-to-gpt:latest
```

## Deployment

The app is containerized and available at:
```
ghcr.io/tybali/zero-to-gpt:latest
```
