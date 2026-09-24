import { Assignment, Submission, RubricEvaluation, Student, ClassPulseInsights } from '../types';

export async function gradeSubmissionWithAi(
  assignment: Assignment,
  submission: Submission,
  studentName: string
): Promise<{ evaluation: RubricEvaluation; engine: string }> {
  const res = await fetch('/api/ai/grade-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignment, submission, studentName }),
  });
  if (!res.ok) {
    throw new Error('Failed to grade submission');
  }
  return res.json();
}

export async function runPreflightCheck(assignment: Assignment, draftContent: string): Promise<{
  readinessScore: number;
  readinessLevel: string;
  immediateFixes: string[];
  rubricAlignmentHighlights: string[];
  checklist: { item: string; checked: boolean }[];
}> {
  const res = await fetch('/api/ai/preflight-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignment, draftContent }),
  });
  if (!res.ok) {
    throw new Error('Failed to run preflight check');
  }
  return res.json();
}

export async function generateAssignmentWithAi(params: {
  topic: string;
  subject: string;
  gradeLevel: string;
  assignmentType: string;
  learningGoal: string;
}): Promise<Partial<Assignment>> {
  const res = await fetch('/api/ai/generate-assignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to generate assignment');
  }
  return res.json();
}

export async function fetchClassPulse(params: {
  courseName: string;
  students: Student[];
  assignments: Assignment[];
  recentSubmissions: Submission[];
}): Promise<ClassPulseInsights> {
  const res = await fetch('/api/ai/class-pulse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch class pulse');
  }
  return res.json();
}

export async function fetchStudentGrowthPlan(params: {
  student: Student;
  recentEvaluations: RubricEvaluation[];
}): Promise<{
  focusArea: string;
  personalizedTip: string;
  actionPlan: { day: string; task: string; minutes: number }[];
  suggestedPracticePrompt: string;
}> {
  const res = await fetch('/api/ai/student-growth-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch growth plan');
  }
  return res.json();
}
