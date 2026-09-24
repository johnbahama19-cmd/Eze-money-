export interface ProficiencyLevel {
  label: string; // e.g. "Exemplary", "Proficient", "Developing", "Needs Work"
  scoreRange: string; // e.g. "23-25 pts", "19-22 pts", "15-18 pts", "0-14 pts"
  description: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  maxScore: number;
  description: string;
  levels?: ProficiencyLevel[];
}

export interface RubricScoreItem {
  criterionId: string;
  criterionTitle: string;
  score: number;
  maxScore: number;
  feedback: string;
  evidenceFound?: string;
  teacherAdjustmentNote?: string;
}

export interface RubricEvaluation {
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeLetter: string;
  overallSummary: string;
  strengths: string[];
  growthAreas: string[];
  nextSteps: string[];
  rubricScores: RubricScoreItem[];
  misconceptionsDetected?: string[];
  suggestedReviewResources?: string[];
  gradedAt: string;
  gradedBy: 'AI Auto-Evaluator' | 'Instructor' | 'Instructor (AI-assisted)';
  teacherNotes?: string;
}

export type AssignmentType = 'essay' | 'code' | 'lab_report' | 'short_answer' | 'project';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  type: AssignmentType;
  dueAt: string;
  maxPoints: number;
  rubric: RubricCriterion[];
  starterSnippet?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: 'submitted' | 'grading_in_progress' | 'graded' | 'draft';
  content: string;
  studentNotes?: string;
  evaluation?: RubricEvaluation;
}

export interface SkillDimension {
  name: string;
  score: number; // 0-100
  trend: 'up' | 'stable' | 'down';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courseIds: string[];
  overallGpa: number;
  overallPercentage: number;
  status: 'excelling' | 'on_track' | 'needs_attention' | 'at_risk';
  skillDimensions: SkillDimension[];
  recentAlert?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  period: string;
  term: string;
  description: string;
  enrolledCount: number;
  instructorName: string;
}

export interface ClassPulseInsights {
  classAverage: number;
  submissionRate: number;
  summaryBriefing: string;
  topStrengths: string[];
  commonMisconceptions: string[];
  recommendedInterventions: {
    topic: string;
    targetStudentIds: string[];
    actionableAdvice: string;
  }[];
}
