export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-engineering-productivity-command-center",
  title: "Engineering Productivity Command Center",
  tagline: "Agent usage, PR quality, cycle time, and AI spend control",
  accent: "green",
};

export const pages: PageConfig[] = [
  {
    label: "PR Flow",
    href: "/flow",
    description: "Pull requests, reviews, cycle time.",
    entities: ["PullRequest", "ReviewCycle", "CycleTimeMetric"],
    workflows: ["flow-brief"],
  },
  {
    label: "Quality",
    href: "/quality",
    description: "Defects and quality gates.",
    entities: ["DefectRecord", "QualityGate"],
    workflows: [],
  },
  {
    label: "AI Usage",
    href: "/ai-usage",
    description: "Agent sessions, tokens, anomalies.",
    entities: ["AgentSession", "TokenUsage", "AgentAnomaly", "EngineerProfile"],
    workflows: ["agent-audit"],
  },
  {
    label: "Spend",
    href: "/spend",
    description: "Spend reports, alerts, repositories.",
    entities: ["SpendReport", "SpendAlert", "Repository"],
    workflows: ["roi-compare"],
  },
];

export const entities: Record<string, EntityConfig> = {
  Repository: {
    name: "Repository",
    label: "Repository",
    fields: [{ name: "name", kind: "string" }, { name: "org", kind: "string" }, { name: "language", kind: "string" }, { name: "contributors", kind: "number" }, { name: "status", kind: "string" }, { name: "defaultBranch", kind: "string" }],
  },
  PullRequest: {
    name: "PullRequest",
    label: "Pull Request",
    fields: [{ name: "number", kind: "string" }, { name: "author", kind: "string" }, { name: "title", kind: "string" }, { name: "status", kind: "string" }, { name: "commentsCount", kind: "number" }, { name: "cycleHours", kind: "number" }],
  },
  ReviewCycle: {
    name: "ReviewCycle",
    label: "Review Cycle",
    fields: [{ name: "prRef", kind: "string" }, { name: "reviewer", kind: "string" }, { name: "round", kind: "number" }, { name: "hoursToReview", kind: "number" }, { name: "outcome", kind: "string" }, { name: "reviewedAt", kind: "date" }],
  },
  DefectRecord: {
    name: "DefectRecord",
    label: "Defect",
    fields: [{ name: "key", kind: "string" }, { name: "severity", kind: "string" }, { name: "origin", kind: "string" }, { name: "status", kind: "string" }, { name: "fixHours", kind: "number" }, { name: "closedAt", kind: "date" }],
  },
  AgentSession: {
    name: "AgentSession",
    label: "Agent Session",
    fields: [{ name: "agent", kind: "string" }, { name: "engineer", kind: "string" }, { name: "task", kind: "string" }, { name: "tokensUsed", kind: "number" }, { name: "cost", kind: "number" }, { name: "status", kind: "string" }],
  },
  TokenUsage: {
    name: "TokenUsage",
    label: "Token Usage",
    fields: [{ name: "model", kind: "string" }, { name: "workflow", kind: "string" }, { name: "inputTokens", kind: "number" }, { name: "outputTokens", kind: "number" }, { name: "costUsd", kind: "number" }, { name: "periodStart", kind: "date" }],
  },
  CycleTimeMetric: {
    name: "CycleTimeMetric",
    label: "Cycle Time Metric",
    fields: [{ name: "period", kind: "string" }, { name: "stage", kind: "string" }, { name: "medianHours", kind: "number" }, { name: "p90Hours", kind: "number" }, { name: "trend", kind: "string" }, { name: "status", kind: "string" }],
  },
  SpendReport: {
    name: "SpendReport",
    label: "Spend Report",
    fields: [{ name: "period", kind: "string" }, { name: "aiSpend", kind: "number" }, { name: "engineerHoursCost", kind: "number" }, { name: "valueShipped", kind: "number" }, { name: "status", kind: "string" }, { name: "generatedBy", kind: "string" }],
  },
  AgentAnomaly: {
    name: "AgentAnomaly",
    label: "Agent Anomaly",
    fields: [{ name: "pattern", kind: "string" }, { name: "detection", kind: "string" }, { name: "severity", kind: "string" }, { name: "wastedCost", kind: "number" }, { name: "status", kind: "string" }, { name: "engineer", kind: "string" }],
  },
  EngineerProfile: {
    name: "EngineerProfile",
    label: "Engineer",
    fields: [{ name: "name", kind: "string" }, { name: "team", kind: "string" }, { name: "level", kind: "string" }, { name: "aiSpend30d", kind: "number" }, { name: "prsMerged30d", kind: "number" }, { name: "status", kind: "string" }],
  },
  QualityGate: {
    name: "QualityGate",
    label: "Quality Gate",
    fields: [{ name: "name", kind: "string" }, { name: "metric", kind: "string" }, { name: "threshold", kind: "number" }, { name: "result", kind: "string" }, { name: "status", kind: "string" }, { name: "evaluatedAt", kind: "date" }],
  },
  SpendAlert: {
    name: "SpendAlert",
    label: "Spend Alert",
    fields: [{ name: "scope", kind: "string" }, { name: "message", kind: "string" }, { name: "amountUsd", kind: "number" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "raisedAt", kind: "date" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "flow-brief",
    title: "Draft: Flow Briefing",
    description: "Weekly flow summary for engineering leadership.",
    prompt: "You are a delivery metrics analyst. Summarize PR throughput, review latency, defects, and cycle-time trends for the week; flag regressions.",
    fields: ["repo", "period", "prStats", "defectStats"],
  },
  {
    slug: "agent-audit",
    title: "Draft: Agent Usage Auditor",
    description: "Detect expensive or ineffective agent usage.",
    prompt: "You are an AI-platform efficiency analyst. Identify wasteful agent sessions: high token cost with no merged output, thrash patterns, or prompt-injection risk.",
    fields: ["agentStats", "sessionsSummary", "outcomes", "budget"],
  },
  {
    slug: "roi-compare",
    title: "Draft: AI ROI Comparator",
    description: "Compare AI spend against engineering delivery value.",
    prompt: "You are an engineering economics analyst. Compare monthly AI spend to delivered engineering hours and outcome value; recommend budget adjustments.",
    fields: ["aiSpend", "engineerHours", "deliveryValue", "trend"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
