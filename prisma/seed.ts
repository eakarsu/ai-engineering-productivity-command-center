// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-engineering-productivity-command-center.local", "Demo Admin", "ADMIN"],
    ["manager@ai-engineering-productivity-command-center.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-engineering-productivity-command-center.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Repository = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.repository.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.repository.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      org: `Org ${String(i + 1).padStart(3, "0")}`,
      language: `Language ${String(i + 1).padStart(3, "0")}`,
      contributors: 5 + ((i * 13) % 95),
      status: pick(STATUSES_Repository, i),
      defaultBranch: `DefaultBranch ${String(i + 1).padStart(3, "0")}`
      },
    });
  }

  const repositoryRefs = await prisma.repository.findMany({ select: { id: true } });

  const STATUSES_PullRequest = ["OPEN", "REVIEW", "MERGED", "REVERTED"];
  await prisma.pullRequest.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.pullRequest.create({
      data: {
      number: `Number ${String(i + 1).padStart(3, "0")}`,
      author: `Author ${String(i + 1).padStart(3, "0")}`,
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_PullRequest, i),
      commentsCount: 5 + ((i * 13) % 95),
      cycleHours: amount(i, 250),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_ReviewCycle = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.reviewCycle.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.reviewCycle.create({
      data: {
      prRef: `PrRef ${String(i + 1).padStart(3, "0")}`,
      reviewer: `Reviewer ${String(i + 1).padStart(3, "0")}`,
      round: 5 + ((i * 13) % 95),
      hoursToReview: amount(i, 250),
      outcome: `Outcome ${String(i + 1).padStart(3, "0")}`,
      reviewedAt: daysAgo(i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_DefectRecord = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.defectRecord.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.defectRecord.create({
      data: {
      key: `Key ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      origin: `Origin ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_DefectRecord, i),
      fixHours: amount(i, 250),
      closedAt: daysAgo(i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_AgentSession = ["ACTIVE", "COMPLETED", "ABANDONED"];
  await prisma.agentSession.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.agentSession.create({
      data: {
      agent: `Agent ${String(i + 1).padStart(3, "0")}`,
      engineer: `Engineer ${String(i + 1).padStart(3, "0")}`,
      task: `Task ${String(i + 1).padStart(3, "0")}`,
      tokensUsed: amount(i, 250),
      cost: amount(i, 250),
      status: pick(STATUSES_AgentSession, i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_TokenUsage = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.tokenUsage.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.tokenUsage.create({
      data: {
      model: `Model ${String(i + 1).padStart(3, "0")}`,
      workflow: `Workflow ${String(i + 1).padStart(3, "0")}`,
      inputTokens: amount(i, 250),
      outputTokens: amount(i, 250),
      costUsd: amount(i, 250),
      periodStart: daysAgo(i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_CycleTimeMetric = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.cycleTimeMetric.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.cycleTimeMetric.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      stage: pick(STATUSES_CycleTimeMetric, i),
      medianHours: amount(i, 250),
      p90Hours: amount(i, 250),
      trend: `Trend ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CycleTimeMetric, i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_SpendReport = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.spendReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.spendReport.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      aiSpend: amount(i, 250),
      engineerHoursCost: amount(i, 250),
      valueShipped: amount(i, 250),
      status: pick(STATUSES_SpendReport, i),
      generatedBy: `GeneratedBy ${String(i + 1).padStart(3, "0")}`,
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_AgentAnomaly = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.agentAnomaly.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.agentAnomaly.create({
      data: {
      pattern: `Pattern ${String(i + 1).padStart(3, "0")}`,
      detection: `Detection ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      wastedCost: amount(i, 250),
      status: pick(STATUSES_AgentAnomaly, i),
      engineer: `Engineer ${String(i + 1).padStart(3, "0")}`,
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_EngineerProfile = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.engineerProfile.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.engineerProfile.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      team: `Team ${String(i + 1).padStart(3, "0")}`,
      level: `Level ${String(i + 1).padStart(3, "0")}`,
      aiSpend30d: amount(i, 250),
      prsMerged30d: amount(i, 250),
      status: pick(STATUSES_EngineerProfile, i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_QualityGate = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.qualityGate.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.qualityGate.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      threshold: amount(i, 250),
      result: `Result ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_QualityGate, i),
      evaluatedAt: daysAgo(i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  const STATUSES_SpendAlert = ["RAISED", "ACKED", "RESOLVED"];
  await prisma.spendAlert.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.spendAlert.create({
      data: {
      scope: `Scope ${String(i + 1).padStart(3, "0")}`,
      message: `Message ${String(i + 1).padStart(3, "0")}`,
      amountUsd: amount(i, 250),
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_SpendAlert, i),
      raisedAt: daysAgo(i),
      repo: { connect: { id: repositoryRefs[i % repositoryRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
