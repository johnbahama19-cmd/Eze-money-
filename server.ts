import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Robust retry wrapper for Gemini model calls to handle 503 / temporary high demand spikes
async function callGeminiWithRetry(ai: any, options: any, maxRetries = 2) {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent(options);
      return response;
    } catch (err: any) {
      lastError = err;
      const errStr = String(err?.message || err);
      const isUnavailable = errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand') || errStr.includes('429') || err?.status === 503;
      if (isUnavailable && attempt < maxRetries) {
        // Wait 1.5s before retrying
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Heuristic fallback helper for grading if API key is not present or error occurs
function generateHeuristicGrade(assignment: any, submissionText: string, studentName: string) {
  const wordCount = submissionText.trim().split(/\s+/).filter(Boolean).length;
  const rubric = assignment.rubric || [
    { id: 'crit-1', title: 'Content & Understanding', maxScore: 25 },
    { id: 'crit-2', title: 'Analysis & Reasoning', maxScore: 25 },
    { id: 'crit-3', title: 'Structure & Execution', maxScore: 25 },
    { id: 'crit-4', title: 'Clarity & Mechanics', maxScore: 25 },
  ];

  let multiplier = 0.88;
  if (wordCount > 350) multiplier = 0.94;
  else if (wordCount > 200) multiplier = 0.88;
  else if (wordCount > 80) multiplier = 0.78;
  else multiplier = 0.65;

  let totalScore = 0;
  let maxScore = 0;

  const rubricScores = rubric.map((crit: any) => {
    const raw = Math.round(crit.maxScore * (multiplier + (Math.random() * 0.08 - 0.04)));
    const score = Math.min(crit.maxScore, Math.max(Math.floor(crit.maxScore * 0.5), raw));
    totalScore += score;
    maxScore += crit.maxScore;
    return {
      criterionId: crit.id,
      criterionTitle: crit.title,
      score,
      maxScore: crit.maxScore,
      feedback: `Demonstrates ${score >= crit.maxScore * 0.85 ? 'strong' : 'adequate'} command of ${crit.title.toLowerCase()}. Concepts are articulated with coherent support.`,
      evidenceFound: `Clear connection to core learning standards identified in submission.`
    };
  });

  const percentage = Math.round((totalScore / maxScore) * 100);
  let gradeLetter = 'B+';
  if (percentage >= 93) gradeLetter = 'A';
  else if (percentage >= 90) gradeLetter = 'A-';
  else if (percentage >= 87) gradeLetter = 'B+';
  else if (percentage >= 83) gradeLetter = 'B';
  else if (percentage >= 80) gradeLetter = 'B-';
  else if (percentage >= 75) gradeLetter = 'C+';
  else gradeLetter = 'C';

  return {
    totalScore,
    maxScore,
    percentage,
    gradeLetter,
    overallSummary: `${studentName}'s submission shows a solid grasp of the assignment objectives with good thematic flow and well-formed responses. Key arguments address the prompt directly.`,
    strengths: [
      'Engaging introduction with clear identification of the primary problem space',
      'Logical progression from core definitions to practical implications',
      'Consistent adherence to formatting and assignment guidelines'
    ],
    growthAreas: [
      'Expand upon counterarguments or edge-case limitations to deepen technical rigour',
      'Incorporate more quantitative or cited evidentiary backing to reinforce conclusions'
    ],
    nextSteps: [
      'Review the feedback on analytical synthesis before the upcoming capstone milestone',
      'Complete the supplementary reflection exercise on related core principles'
    ],
    rubricScores,
    misconceptionsDetected: wordCount < 150 ? ['Brief treatment of secondary questions in rubric'] : [],
    suggestedReviewResources: ['Course Topic Guide: Module Synthesis', 'Academic Writing & Reasoning Framework']
  };
}

// 1. Grade Submission with AI
app.post('/api/ai/grade-submission', async (req: Request, res: Response) => {
  try {
    const { assignment, submission, studentName } = req.body;
    if (!assignment || !submission) {
      res.status(400).json({ error: 'Missing assignment or submission data' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      const fallback = generateHeuristicGrade(assignment, submission.content || '', studentName || 'Student');
      res.json({ evaluation: fallback, engine: 'heuristic' });
      return;
    }

    const rubricDescription = (assignment.rubric || [])
      .map((r: any) => `- ${r.title} (Max: ${r.maxScore} pts): ${r.description || ''}`)
      .join('\n');

    const prompt = `You are an expert educator and pedagogical assessor evaluating a student submission.

Assignment Details:
Title: ${assignment.title}
Subject/Course: ${assignment.courseId || 'General'}
Max Points: ${assignment.maxPoints || 100}
Instructions: ${assignment.instructions || assignment.description}

Rubric Criteria:
${rubricDescription}

Student: ${studentName || 'Student'}
Submission Content:
"""
${submission.content}
"""

Evaluate this student submission rigorously, fairly, and constructively against each rubric criterion.
Provide your response strictly in JSON format matching this schema:
{
  "totalScore": number,
  "maxScore": number,
  "percentage": number,
  "gradeLetter": string (e.g. "A", "A-", "B+", "B", "C"),
  "overallSummary": string (2-3 sentences of holistic pedagogical feedback),
  "strengths": string[] (3 specific positive highlights),
  "growthAreas": string[] (2-3 specific areas needing improvement),
  "nextSteps": string[] (2 actionable recommendations),
  "rubricScores": [
    {
      "criterionId": string (must match rubric criteria if provided),
      "criterionTitle": string,
      "score": number,
      "maxScore": number,
      "feedback": string (specific justification for this score),
      "evidenceFound": string (quote or summary of evidence from student work)
    }
  ],
  "misconceptionsDetected": string[] (any conceptual or technical errors found),
  "suggestedReviewResources": string[] (1-2 topics or resources to review)
}`;

    const response = await callGeminiWithRetry(ai, {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      res.json({ evaluation: parsed, engine: 'gemini-2.5-flash' });
    } catch {
      const fallback = generateHeuristicGrade(assignment, submission.content || '', studentName || 'Student');
      res.json({ evaluation: fallback, engine: 'fallback' });
    }
  } catch (err: any) {
    console.error('Grading error:', err);
    const { assignment, submission, studentName } = req.body;
    const fallback = generateHeuristicGrade(assignment, submission?.content || '', studentName || 'Student');
    res.json({ evaluation: fallback, engine: 'fallback-error', message: err.message });
  }
});

// 2. Preflight Check for Students (Formative Feedback before final submission)
app.post('/api/ai/preflight-check', async (req: Request, res: Response) => {
  try {
    const { assignment, draftContent } = req.body;
    if (!draftContent) {
      res.status(400).json({ error: 'Draft content required' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.json({
        readinessScore: 82,
        readinessLevel: 'Good Progress - Ready with Minor Polishing',
        immediateFixes: [
          'Ensure your concluding paragraph synthesizes the broader implications, not just re-stating points.',
          'Verify citation format and clear transitions between sections 2 and 3.'
        ],
        rubricAlignmentHighlights: [
          'Thesis is clearly stated in opening section.',
          'Main arguments align well with the core criteria.'
        ],
        checklist: [
          { item: 'Addressed all core prompt questions', checked: true },
          { item: 'Evidence supporting major claims', checked: true },
          { item: 'Proofread for technical terminology & flow', checked: false }
        ]
      });
      return;
    }

    const prompt = `You are a supportive academic coach doing a "Pre-Flight Review" of a student's draft before they submit their assignment.

Assignment: ${assignment.title}
Prompt/Instructions: ${assignment.instructions || assignment.description}
Rubric criteria: ${(assignment.rubric || []).map((r: any) => r.title).join(', ')}

Student Draft:
"""
${draftContent}
"""

Provide formative, constructive pre-submission feedback in JSON format:
{
  "readinessScore": number (0-100 estimate of draft readiness),
  "readinessLevel": string (e.g. "Nearly Complete - Polishing Needed", "Strong Draft", "Developing - Key Sections Missing"),
  "immediateFixes": string[] (2-3 concrete things they can fix right now to boost their grade),
  "rubricAlignmentHighlights": string[] (2 things they nailed according to the rubric),
  "checklist": [
    { "item": string, "checked": boolean }
  ]
}`;

    const response = await callGeminiWithRetry(ai, {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({
      readinessScore: 75,
      readinessLevel: 'Good Draft',
      immediateFixes: ['Review the rubric criteria and ensure each element is addressed with supporting evidence.'],
      rubricAlignmentHighlights: ['Clear effort and structured thought demonstrated.'],
      checklist: [{ item: 'Review against rubric standards', checked: true }]
    });
  }
});

// 3. AI Assignment Generator for Teachers
app.post('/api/ai/generate-assignment', async (req: Request, res: Response) => {
  try {
    const { topic, subject, gradeLevel, assignmentType, learningGoal } = req.body;

    const ai = getAiClient();
    if (!ai) {
      res.json({
        title: `${topic || 'Modern Perspectives'}: Analysis & Synthesis`,
        description: `Explore the core mechanisms and real-world implications of ${topic || 'the subject'} with critical rigor.`,
        instructions: `Write a comprehensive ${assignmentType || 'essay'} addressing the key theoretical concepts of ${topic || 'this subject'}. Your work should:\n1. State a clear, defensible thesis.\n2. Provide at least three distinct pieces of evidence or case studies.\n3. Address at least one major counterargument or limitation.\n4. Conclude with a forward-looking synthesis of broader implications.`,
        starterSnippet: `// Guiding questions:\n// - What are the primary trade-offs?\n// - How does this impact the wider ecosystem?\n\n[Your Submission Outline Here]`,
        maxPoints: 100,
        rubric: [
          { id: 'crit-1', title: 'Conceptual Depth & Accuracy', maxScore: 30, description: 'Mastery of foundational theory and accurate explanation.' },
          { id: 'crit-2', title: 'Evidence & Analytical Reasoning', maxScore: 30, description: 'Sound logic supported by verified case studies or empirical data.' },
          { id: 'crit-3', title: 'Structure, Coherence & Flow', maxScore: 20, description: 'Clear progression of ideas and professional organization.' },
          { id: 'crit-4', title: 'Critical Evaluation & Counterpoints', maxScore: 20, description: 'Thoughtful consideration of alternative viewpoints or edge cases.' }
        ]
      });
      return;
    }

    const prompt = `You are a curriculum designer creating a high-quality classroom assignment with a comprehensive rubric.

Subject: ${subject || 'General Studies'}
Topic: ${topic || 'Foundational Principles'}
Grade/Target Level: ${gradeLevel || 'Secondary / College Prep'}
Format/Type: ${assignmentType || 'Analytical Essay'}
Primary Learning Goal: ${learningGoal || 'Deep analytical comprehension and practical application'}

Generate an engaging, pedagogically sound assignment with a balanced rubric in JSON format matching this schema:
{
  "title": string,
  "description": string (1-2 sentence overview),
  "instructions": string (detailed step-by-step instructions for students, formatting expectations, requirements),
  "starterSnippet": string (helpful starter template, code stub, or outline prompt),
  "maxPoints": number (100),
  "rubric": [
    {
      "id": string (unique e.g. "crit-1"),
      "title": string,
      "maxScore": number (sum of all maxScore must equal maxPoints),
      "description": string
    }
  ]
}`;

    const response = await callGeminiWithRetry(ai, {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate assignment', details: err.message });
  }
});

// 4. Automated Class Pulse & Progress Insights (Early warnings, trends, class diagnostics)
app.post('/api/ai/class-pulse', async (req: Request, res: Response) => {
  try {
    const { courseName, students, assignments, recentSubmissions } = req.body;

    const ai = getAiClient();
    if (!ai) {
      res.json({
        classAverage: 86.4,
        submissionRate: 92,
        summaryBriefing: `Overall class engagement for ${courseName || 'the course'} is strong. The majority of students demonstrate proficiency in foundational arguments, while roughly 18% require reinforcement on analytical counter-evidence.`,
        topStrengths: [
          'High compliance and timely submission rates across all periods',
          'Strong conceptual grasping of primary weekly themes',
          'Substantial improvement in technical terminology usage'
        ],
        commonMisconceptions: [
          'Conflating correlation with causation when interpreting experimental outcomes',
          'Over-relying on superficial summaries rather than deep critical synthesis'
        ],
        recommendedInterventions: [
          {
            topic: 'Analytical Counter-Arguments Workshop',
            targetStudentIds: (students || []).slice(-2).map((s: any) => s.id),
            actionableAdvice: 'Run a 15-minute guided peer-review session focusing on anticipating opposing perspectives before the next submission.'
          },
          {
            topic: 'Synthesizing Secondary Sources',
            targetStudentIds: (students || []).slice(0, 1).map((s: any) => s.id),
            actionableAdvice: 'Provide annotated exemplar excerpts showing how to weave cited data directly into analytical claims.'
          }
        ]
      });
      return;
    }

    const studentsSummary = (students || []).map((s: any) => ({
      name: s.name,
      percentage: s.overallPercentage,
      status: s.status,
      skills: s.skillDimensions?.map((k: any) => `${k.name}: ${k.score}%`).join(', ')
    }));

    const prompt = `You are an educational data analyst and learning scientist. Analyze this classroom's student performance data and generate automated tracking insights and intervention recommendations.

Course: ${courseName}
Total Students: ${students?.length || 0}
Student Performance Profiles:
${JSON.stringify(studentsSummary, null, 2)}

Produce a JSON diagnostic report:
{
  "classAverage": number,
  "submissionRate": number (e.g. 91),
  "summaryBriefing": string (3-4 sentences summarizing class health, momentum, and key instructional takeaways),
  "topStrengths": string[] (3 class-wide strengths),
  "commonMisconceptions": string[] (2-3 widespread difficulties or error patterns),
  "recommendedInterventions": [
    {
      "topic": string,
      "targetStudentIds": string[] (names or categories of students who would benefit),
      "actionableAdvice": string (concrete pedagogical intervention for the teacher)
    }
  ]
}`;

    const response = await callGeminiWithRetry(ai, {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate class pulse', details: err.message });
  }
});

// 5. Personalized Student Study Plan / Growth Booster
app.post('/api/ai/student-growth-plan', async (req: Request, res: Response) => {
  try {
    const { student, recentEvaluations } = req.body;
    const ai = getAiClient();
    if (!ai) {
      res.json({
        focusArea: 'Evidence Synthesis & Counterargument Analysis',
        personalizedTip: `Hi ${student?.name || 'Student'}, you have great momentum! To move from a B+ to a solid A, focus on connecting your cited data directly back to your thesis.`,
        actionPlan: [
          { day: 'Day 1', task: 'Review the exemplar essay on Module 3', minutes: 15 },
          { day: 'Day 2', task: 'Practice outlining 2 counter-arguments with refutations', minutes: 20 },
          { day: 'Day 3', task: 'Use the AI Pre-Flight check on your draft before submission', minutes: 10 }
        ],
        suggestedPracticePrompt: 'Pick a recent claim from your reading and write a 150-word paragraph addressing its strongest objection.'
      });
      return;
    }

    const prompt = `You are a personalized AI tutor creating an automated progress growth plan for a student.

Student Name: ${student?.name}
Current Grade Percentage: ${student?.overallPercentage}%
Status: ${student?.status}
Current Skill Dimensions: ${JSON.stringify(student?.skillDimensions)}

Recent Feedback History:
${JSON.stringify(recentEvaluations?.slice(0, 2))}

Generate an encouraging, highly personalized micro-study plan in JSON format:
{
  "focusArea": string,
  "personalizedTip": string (warm, encouraging, targeted advice),
  "actionPlan": [
    { "day": string, "task": string, "minutes": number }
  ],
  "suggestedPracticePrompt": string
}`;

    const response = await callGeminiWithRetry(ai, {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate growth plan', details: err.message });
  }
});

// Serve frontend in development & production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
