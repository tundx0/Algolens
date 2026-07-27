/**
 * Pathways are project-based journeys. Stages follow Shu-Ha-Ri (守破離),
 * the classical Japanese description of how mastery progresses: first obey
 * the form, then break the form, finally leave the form behind.
 */

export type PathwayStepKind = "reading" | "visualize" | "practice" | "project";

export interface ProjectBrief {
  /** the assignment, markdown */
  brief: string;
  /** what "done" means — shown as a checklist */
  acceptanceCriteria: string[];
  estimatedHours: number;
}

export interface PathwayStep {
  /** unique within the pathway */
  id: string;
  kind: PathwayStepKind;
  title: string;
  /** why this step exists, one short paragraph */
  description: string;
  /** kind = "visualize": links into /visualize?algo=<id> */
  algorithmId?: string;
  /** kind = "practice": links into /practice/<id> */
  exerciseId?: string;
  /** kind = "project" */
  project?: ProjectBrief;
}

export interface PathwayStage {
  id: string;
  kanji: string;
  romaji: string;
  name: string;
  philosophy: string;
  steps: PathwayStep[];
}

export interface PathwayDefinition {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stages: PathwayStage[];
}
