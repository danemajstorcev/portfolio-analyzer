// import type { AnalysisResult } from './types';

import { AnalysisResult } from "../types/types";

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach. Analyze the provided CV or portfolio text and return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "overallScore": <0-100 integer>,
  "seniority": <"Junior"|"Mid-Level"|"Senior"|"Lead">,
  "summary": "<2 sentence honest assessment>",
  "categoryScores": [
    {"label": "Technical Skills", "score": <0-100>, "color": "#06b6d4"},
    {"label": "Experience Depth", "score": <0-100>, "color": "#f43f5e"},
    {"label": "Project Impact", "score": <0-100>, "color": "#8b5cf6"},
    {"label": "Communication", "score": <0-100>, "color": "#f59e0b"},
    {"label": "Leadership", "score": <0-100>, "color": "#10b981"}
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "suggestions": [
    {"priority": "high", "title": "<title>", "detail": "<1 sentence detail>"},
    {"priority": "medium", "title": "<title>", "detail": "<1 sentence detail>"},
    {"priority": "low", "title": "<title>", "detail": "<1 sentence detail>"}
  ],
  "missingSkills": [
    {"skill": "<skill name>", "importance": "critical", "reason": "<why it matters>"},
    {"skill": "<skill name>", "importance": "recommended", "reason": "<why it matters>"},
    {"skill": "<skill name>", "importance": "nice-to-have", "reason": "<why it matters>"}
  ]
}`;

export async function analyzePortfolio(
  text: string,
  apiKey: string
): Promise<AnalysisResult> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this CV/portfolio:\n\n${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: { message?: string } }).error?.message ||
        `API error ${response.status}`
    );
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };

  const raw = data.content.find((b) => b.type === 'text')?.text ?? '';

  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    throw new Error('Failed to parse analysis response. Please try again.');
  }
}

export function getMockResult(): AnalysisResult {
  return {
    overallScore: 72,
    seniority: 'Mid-Level',
    summary:
      'A solid mid-level profile with strong frontend fundamentals and good project variety. The portfolio demonstrates practical skills but lacks measurable outcomes and system-design experience that would push this to senior level.',
    categoryScores: [
      { label: 'Technical Skills', score: 78, color: '#06b6d4' },
      { label: 'Experience Depth', score: 65, color: '#f43f5e' },
      { label: 'Project Impact', score: 58, color: '#8b5cf6' },
      { label: 'Communication', score: 80, color: '#f59e0b' },
      { label: 'Leadership', score: 40, color: '#10b981' },
    ],
    strengths: [
      'Strong React and TypeScript fundamentals demonstrated across multiple projects',
      'Good variety of project types showing breadth of frontend experience',
      'Clean, well-structured code examples with consistent naming conventions',
    ],
    suggestions: [
      {
        priority: 'high',
        title: 'Add quantifiable impact metrics',
        detail:
          'Replace vague descriptions like "improved performance" with numbers — "reduced load time by 40%".',
      },
      {
        priority: 'medium',
        title: 'Include a system design example',
        detail:
          'Add one project with an architecture diagram showing how you think about scalability.',
      },
      {
        priority: 'low',
        title: 'Add open source contributions',
        detail:
          'Even small contributions to known libraries signals community engagement to senior recruiters.',
      },
    ],
    missingSkills: [
      {
        skill: 'Testing (Jest / Vitest)',
        importance: 'critical',
        reason:
          'No test examples found — this is a dealbreaker at most companies above junior level.',
      },
      {
        skill: 'CI/CD Pipelines',
        importance: 'recommended',
        reason:
          'Knowing GitHub Actions or similar shows ownership beyond just writing code.',
      },
      {
        skill: 'WebSockets / Real-time',
        importance: 'nice-to-have',
        reason:
          'Real-time features differentiate frontend profiles in competitive markets.',
      },
    ],
  };
}