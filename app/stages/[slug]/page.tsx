import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getStageBySlug, STAGES } from "@/lib/stages-data";
import { StageHeader } from "@/components/shared/stage-header";
import { StageLayout } from "@/components/shared/stage-layout";

// Stage content components
import { ResearchVisionStage } from "@/components/stages/research-vision";
import { ArchitecturePlanningStage } from "@/components/stages/architecture-planning";
import { DataCollectionStage } from "@/components/stages/data-collection";
import { DataProcessingStage } from "@/components/stages/data-processing";
import { TokenizationStage } from "@/components/stages/tokenization";
import { TransformerArchitectureStage } from "@/components/stages/transformer-architecture";
import { ModernInnovationsStage } from "@/components/stages/modern-innovations";
import { ScalingLawsStage } from "@/components/stages/scaling-laws";
import { TrainingInfrastructureStage } from "@/components/stages/training-infrastructure";
import { PretrainingProcessStage } from "@/components/stages/pretraining-process";
import { SupervisedFinetuningStage } from "@/components/stages/supervised-finetuning";
import { RlhfDpoStage } from "@/components/stages/rlhf-dpo";
import { BenchmarkingStage } from "@/components/stages/benchmarking";
import { ModelOptimizationStage } from "@/components/stages/model-optimization";
import { DeploymentServingStage } from "@/components/stages/deployment-serving";
import { ContinuousLearningStage } from "@/components/stages/continuous-learning";

// Map slugs to components
const STAGE_COMPONENTS: Record<string, React.ComponentType> = {
  "research-vision": ResearchVisionStage,
  "architecture-planning": ArchitecturePlanningStage,
  "data-collection": DataCollectionStage,
  "data-processing": DataProcessingStage,
  "tokenization": TokenizationStage,
  "transformer-architecture": TransformerArchitectureStage,
  "modern-innovations": ModernInnovationsStage,
  "scaling-laws": ScalingLawsStage,
  "training-infrastructure": TrainingInfrastructureStage,
  "pretraining-process": PretrainingProcessStage,
  "supervised-finetuning": SupervisedFinetuningStage,
  "rlhf-dpo": RlhfDpoStage,
  "benchmarking": BenchmarkingStage,
  "model-optimization": ModelOptimizationStage,
  "deployment-serving": DeploymentServingStage,
  "continuous-learning": ContinuousLearningStage,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STAGES.map((stage) => ({
    slug: stage.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stage = getStageBySlug(slug);

  if (!stage) {
    return {
      title: "Stage Not Found",
    };
  }

  return {
    title: `${stage.title} | LLM Simulator`,
    description: stage.description,
    openGraph: {
      title: `${stage.title} | LLM Simulator`,
      description: stage.description,
    },
  };
}

export default async function StagePage({ params }: PageProps) {
  const { slug } = await params;
  const stage = getStageBySlug(slug);

  if (!stage) {
    notFound();
  }

  const StageContent = STAGE_COMPONENTS[slug];

  if (!StageContent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <StageHeader currentStage={stage} />
      <StageLayout stage={stage}>
        <StageContent />
      </StageLayout>
    </div>
  );
}
