import React, { useState } from 'react';
import { Assignment, Submission, RubricEvaluation, RubricScoreItem } from '../types';
import { RubricViewer } from './RubricViewer';
import { gradeSubmissionWithAi } from '../services/api';
import {
  X,
  Sparkles,
  CheckCircle,
  FileText,
  Clock,
  User,
  AlertTriangle,
  Lightbulb,
  Check,
  RefreshCw,
  Award,
} from 'lucide-react';

interface GradingModalProps {
  assignment: Assignment;
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
  onSaveGrading: (submissionId: string, evaluation: RubricEvaluation) => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  assignment,
  submission,
  isOpen,
  onClose,
  onSaveGrading,
}) => {
  if (!isOpen) return null;

  const [isGrading, setIsGrading] = useState(false);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(
    submission.evaluation || null
  );
  const [teacherNotes, setTeacherNotes] = useState(submission.evaluation?.teacherNotes || '');
  const [gradingEngine, setGradingEngine] = useState<string | null>(null);

  const handleAiAutoGrade = async () => {
    setIsGrading(true);
    try {
      const result = await gradeSubmissionWithAi(
        assignment,
        submission,
        submission.studentName
      );
      setEvaluation(result.evaluation);
      setGradingEngine(result.engine);
    } catch (err) {
      console.error('Grading error:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const handleScoreChange = (criterionId: string, newScore: number, teacherNote?: string) => {
    if (!evaluation) return;
    const updatedScores = evaluation.rubricScores.map((s) => {
      if (s.criterionId === criterionId) {
        return {
          ...s,
          score: newScore,
          teacherAdjustmentNote: teacherNote !== undefined ? teacherNote : s.teacherAdjustmentNote,
        };
      }
      return s;
    });

    const newTotal = updatedScores.reduce((sum, s) => sum + s.score, 0);
    const newPercentage = Math.round((newTotal / assignment.maxPoints) * 100);

    let letter = 'B';
    if (newPercentage >= 93) letter = 'A';
    else if (newPercentage >= 90) letter = 'A-';
    else if (newPercentage >= 87) letter = 'B+';
    else if (newPercentage >= 83) letter = 'B';
    else if (newPercentage >= 80) letter = 'B-';
    else if (newPercentage >= 75) letter = 'C+';
    else if (newPercentage >= 70) letter = 'C';
    else letter = 'D';

    setEvaluation({
      ...evaluation,
      totalScore: newTotal,
      percentage: newPercentage,
      gradeLetter: letter,
      rubricScores: updatedScores,
      gradedBy: 'Instructor (AI-assisted)',
    });
  };

  const handleApproveAndSave = () => {
    if (!evaluation) return;
    const finalEvaluation: RubricEvaluation = {
      ...evaluation,
      teacherNotes: teacherNotes.trim(),
      gradedAt: new Date().toISOString(),
    };
    onSaveGrading(submission.id, finalEvaluation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rubric Evaluation
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-medium text-slate-700">{assignment.title}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>{submission.studentName}</span>
              <span className="text-xs font-normal text-slate-500">({submission.studentEmail})</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!evaluation && (
              <button
                type="button"
                onClick={handleAiAutoGrade}
                disabled={isGrading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{isGrading ? 'AI Evaluating Rubric...' : 'Run AI Auto-Grade'}</span>
              </button>
            )}

            {evaluation && (
              <button
                type="button"
                onClick={handleAiAutoGrade}
                disabled={isGrading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Re-run AI Rubric Evaluation"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGrading ? 'animate-spin' : ''}`} />
                <span>Re-Evaluate</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split View */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Student Submission (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Student Submission Content</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Submitted {new Date(submission.submittedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[65vh] overflow-y-auto">
              {submission.content || '(No submission content provided)'}
            </div>

            {/* Assignment Attached Rubric Reminder */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
              <div className="font-semibold text-slate-800 mb-1">Attached Rubric Criteria</div>
              <ul className="space-y-1 text-slate-600">
                {assignment.rubric.map((r) => (
                  <li key={r.id} className="flex items-center justify-between text-[11px]">
                    <span className="truncate">{r.title}</span>
                    <span className="font-mono text-slate-400 shrink-0">{r.maxScore} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Rubric Scorecard & AI Evaluation (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6">
            {isGrading && (
              <div className="p-8 text-center space-y-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <h3 className="text-sm font-semibold text-slate-900">
                  AI Reading & Assessing Submission
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Cross-referencing student work against each of the {assignment.rubric.length} rubric
                  criteria, citing textual evidence, and computing objective point allocations...
                </p>
              </div>
            )}

            {!isGrading && !evaluation && (
              <div className="p-12 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-2xl">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Submission Pending Evaluation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Run AI Auto-Grade" to let Gemini automatically score the attached rubric,
                    or manually assign points below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAiAutoGrade}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Rubric Evaluation</span>
                </button>
              </div>
            )}

            {evaluation && (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-400">Total Calculated Score</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {evaluation.totalScore}
                      </span>
                      <span className="text-sm text-slate-400">/ {assignment.maxPoints} pts</span>
                      <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                        {evaluation.percentage}% ({evaluation.gradeLetter})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Evaluation Mode</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300">
                      <Sparkles className="w-3 h-3" />
                      <span>{evaluation.gradedBy}</span>
                    </span>
                  </div>
                </div>

                {/* Overall Pedagogical Summary */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Holistic Feedback Summary</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {evaluation.overallSummary}
                  </p>
                </div>

                {/* Rubric Criteria Detailed Breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      Criteria Scoring & Feedback
                    </h3>
                    <span className="text-xs text-slate-500">
                      Edit points or notes as needed
                    </span>
                  </div>

                  <RubricViewer
                    rubric={assignment.rubric}
                    evaluationScores={evaluation.rubricScores}
                    editable={true}
                    onScoreChange={handleScoreChange}
                  />
                </div>

                {/* Strengths & Growth Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Key Strengths Identified</span>
                    </div>
                    <ul className="space-y-1.5 text-emerald-950">
                      {evaluation.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 shrink-0">·</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Recommended Growth Areas</span>
                    </div>
                    <ul className="space-y-1.5 text-amber-950">
                      {evaluation.growthAreas.map((area, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-700 shrink-0">·</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Misconceptions Alert if any */}
                {evaluation.misconceptionsDetected && evaluation.misconceptionsDetected.length > 0 && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Conceptual Gaps Detected</span>
                    </div>
                    <ul className="list-disc list-inside text-rose-800 space-y-1">
                      {evaluation.misconceptionsDetected.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructor Notes Override */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    Instructor Personal Feedback / Message to Student
                  </label>
                  <textarea
                    rows={3}
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Add personal encouragement, discussion topics for office hours, or specific pointers..."
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="text-xs text-slate-500">
            {evaluation
              ? `Score ready: ${evaluation.totalScore} / ${assignment.maxPoints} pts (${evaluation.gradeLetter})`
              : 'Evaluation not yet recorded'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApproveAndSave}
              disabled={!evaluation}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve &amp; Publish Grade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
