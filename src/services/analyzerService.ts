import type { AnalysisResult } from "../types";

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach. Analyze the provided CV or portfolio text and return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "overallScore": <0-100 integer>,
  "seniority": <"Junior"|"Mid-Level"|"Senior"|"Lead">,
  "summary": "<2 sentence honest assessment>",
  "categoryScores": [
    {"label": "Technical Skills", "score": <0-100>, "color": "#06b6d4"},
    {"label": "Experience Depth", "score": <0-100>, "color": "#f43f5e"},
    {"label": "Project Impact",   "score": <0-100>, "color": "#8b5cf6"},
    {"label": "Communication",    "score": <0-100>, "color": "#f59e0b"},
    {"label": "Leadership",       "score": <0-100>, "color": "#10b981"}
  ],
  "strengths": ["<strength 1>","<strength 2>","<strength 3>"],
  "suggestions": [
    {"priority":"high",   "title":"<title>","detail":"<1 sentence>"},
    {"priority":"medium", "title":"<title>","detail":"<1 sentence>"},
    {"priority":"low",    "title":"<title>","detail":"<1 sentence>"}
  ],
  "missingSkills": [
    {"skill":"<name>","importance":"critical",       "reason":"<why>"},
    {"skill":"<name>","importance":"recommended",    "reason":"<why>"},
    {"skill":"<name>","importance":"nice-to-have",   "reason":"<why>"}
  ]
}`;

export async function analyzePortfolio(
  text: string,
  apiKey: string,
): Promise<AnalysisResult> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: `Analyze this CV/portfolio:\n\n${text}` },
      ],
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
    };
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const raw = data.content.find((b) => b.type === "text")?.text ?? "";

  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    throw new Error("Failed to parse analysis response. Please try again.");
  }
}

export function getMockResult(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  const has = (...words: string[]) => words.some((w) => lower.includes(w));

  const hasTests = has("test", "jest", "vitest", "cypress", "testing");
  const hasTS = has("typescript", " ts ", ".ts");
  const hasLeadership = has("lead", "mentor", "managed", "team", "senior");
  const hasMetrics = has(
    "%",
    "reduced",
    "increased",
    "improved",
    "users",
    "revenue",
    "ms",
    "seconds",
  );
  const hasCI = has("ci/cd", "github actions", "pipeline", "docker", "devops");
  const hasDesign = has("figma", "ux", "ui design", "accessibility", "wcag");
  const wordCount = text.split(/\s+/).length;

  const base = 45 + Math.min(wordCount / 20, 20);
  const bonus =
    (hasTests ? 8 : 0) +
    (hasTS ? 5 : 0) +
    (hasLeadership ? 7 : 0) +
    (hasMetrics ? 8 : 0) +
    (hasCI ? 5 : 0) +
    (hasDesign ? 4 : 0);
  const score = Math.min(Math.round(base + bonus), 96);

  const techScore =
    50 + (hasTS ? 15 : 0) + (hasTests ? 12 : 0) + (hasCI ? 8 : 0);
  const expScore = 40 + Math.min(wordCount / 15, 25) + (hasMetrics ? 15 : 0);
  const impactScore = 35 + (hasMetrics ? 30 : 0) + (hasLeadership ? 10 : 0);
  const commScore = 50 + (wordCount > 150 ? 20 : 0) + (hasMetrics ? 10 : 0);
  const leadScore = 20 + (hasLeadership ? 50 : 0) + (hasMetrics ? 10 : 0);

  const cap = (v: number) => Math.min(Math.round(v), 98);

  const seniority =
    score >= 82
      ? "Senior"
      : score >= 68
        ? "Mid-Level"
        : score >= 52
          ? "Junior"
          : "Junior";

  const strengths: string[] = [];
  if (hasTS)
    strengths.push("TypeScript usage signals strong type-safety awareness");
  if (hasTests)
    strengths.push(
      "Testing coverage shows professional engineering discipline",
    );
  if (hasLeadership)
    strengths.push(
      "Leadership experience distinguishes this profile from individual contributors",
    );
  if (hasMetrics)
    strengths.push(
      "Quantified outcomes demonstrate real-world business impact",
    );
  if (hasCI)
    strengths.push("CI/CD and DevOps familiarity shows end-to-end ownership");
  if (hasDesign)
    strengths.push(
      "Design sensibility is a rare and valued trait in frontend engineers",
    );
  if (strengths.length < 2)
    strengths.push(
      "Profile shows initiative and willingness to take on varied work",
    );
  if (strengths.length < 3)
    strengths.push(
      "Clear project descriptions make this easy for recruiters to scan",
    );

  const suggestions = [];
  if (!hasMetrics)
    suggestions.push({
      priority: "high" as const,
      title: "Add quantifiable impact",
      detail:
        'Replace vague statements with numbers — "reduced load time by 40%" beats "improved performance".',
    });
  if (!hasTests)
    suggestions.push({
      priority: "high" as const,
      title: "Show testing experience",
      detail:
        "Add examples of Jest, Vitest, or Cypress usage — missing tests is a dealbreaker above junior level.",
    });
  if (!hasLeadership)
    suggestions.push({
      priority: "medium" as const,
      title: "Highlight collaboration",
      detail:
        "Even informal mentoring or code review responsibilities signal growth beyond individual contributor.",
    });
  if (!hasCI)
    suggestions.push({
      priority: "medium" as const,
      title: "Mention CI/CD exposure",
      detail:
        "GitHub Actions or similar shows you own the full delivery cycle, not just feature branches.",
    });
  if (!hasDesign)
    suggestions.push({
      priority: "low" as const,
      title: "Reference design collaboration",
      detail:
        "Noting Figma handoff experience or accessibility work differentiates frontend profiles.",
    });
  suggestions.push({
    priority: "low" as const,
    title: "Add open source or side projects",
    detail:
      "Even small public contributions signal community engagement to senior engineers reviewing your profile.",
  });

  const missing = [];
  if (!hasTests)
    missing.push({
      skill: "Testing (Jest / Vitest)",
      importance: "critical" as const,
      reason:
        "No test examples found — required at most companies beyond junior level.",
    });
  if (!hasCI)
    missing.push({
      skill: "CI/CD (GitHub Actions)",
      importance: "recommended" as const,
      reason:
        "Pipeline knowledge shows you think beyond writing code to shipping it.",
    });
  if (!hasTS)
    missing.push({
      skill: "TypeScript",
      importance: "critical" as const,
      reason:
        "Expected in most React roles in 2024 — absence raises questions.",
    });
  missing.push({
    skill: "WebSockets / Real-time",
    importance: "nice-to-have" as const,
    reason:
      "Real-time features differentiate frontend profiles in competitive markets.",
  });
  if (!hasDesign)
    missing.push({
      skill: "Accessibility (WCAG)",
      importance: "recommended" as const,
      reason:
        "Increasingly required — many companies now include a11y in engineering interviews.",
    });

  const summary =
    score >= 75
      ? `A strong ${seniority.toLowerCase()} profile with clear technical breadth${hasMetrics ? " and good impact metrics" : " — adding impact numbers would push this higher"}. ${hasLeadership ? "Leadership signals are a real differentiator here." : "Adding collaboration examples would round this out for senior roles."}`
      : `A developing ${seniority.toLowerCase()} profile with solid foundations${hasTS ? " and good TypeScript usage" : ""}. The main gaps are ${!hasMetrics ? "measurable outcomes" : "testing coverage"} and ${!hasCI ? "deployment experience" : "leadership signals"} — fixing those would meaningfully raise the score.`;

  return {
    overallScore: score,
    seniority,
    summary,
    categoryScores: [
      { label: "Technical Skills", score: cap(techScore), color: "#06b6d4" },
      { label: "Experience Depth", score: cap(expScore), color: "#f43f5e" },
      { label: "Project Impact", score: cap(impactScore), color: "#8b5cf6" },
      { label: "Communication", score: cap(commScore), color: "#f59e0b" },
      { label: "Leadership", score: cap(leadScore), color: "#10b981" },
    ],
    strengths: strengths.slice(0, 3),
    suggestions: suggestions.slice(0, 3),
    missingSkills: missing.slice(0, 3),
  };
}
