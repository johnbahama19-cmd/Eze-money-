import React, { useState } from 'react';
import { Assignment, Submission } from '../types';
import { RubricViewer } from './RubricViewer';
import { runPreflightCheck } from '../services/api';
import confetti from 'canvas-confetti';
import {
  FileText,
  Send,
  Sparkles,
  Award,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Clock,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface StudentSubmissionViewProps {
  assignment: Assignment;
  submission?: Submission;
  studentId: string;
  studentName: string;
  studentEmail: string;
  onSubmit: (assignmentId: string, content: string, notes?: string) => void;
  onBack: () => void;
}

export const StudentSubmissionView: React.FC<StudentSubmissionViewProps> = ({
  assignment,
  submission,
  studentId,
  studentName,
  studentEmail,
  onSubmit,
  onBack,
}) => {
  const [content, setContent] = useState(
    submission?.content || assignment.starterSnippet || ''
  );
  const [notes, setNotes] = useState(submission?.studentNotes || '');
  const [activeTab, setActiveTab] = useState<'editor' | 'rubric'>('editor');
  const [isPreflightRunning, setIsPreflightRunning] = useState(false);
  const [preflightResult, setPreflightResult] = useState<{
    readinessScore: number;
    readinessLevel: string;
    immediateFixes: string[];
    rubricAlignmentHighlights: string[];
    checklist: { item: string; checked: boolean }[];
  } | null>(null);

  const evaluation = submission?.status === 'graded' ? submission.evaluation : undefined;
  const isGraded = Boolean(evaluation);
  const isSubmitted = Boolean(submission?.status === 'submitted' || isGraded);

  const handleRunPreflight = async () => {
    if (!content.trim()) return;
    setIsPreflightRunning(true);
    try {
      const res = await runPreflightCheck(assignment, content);
      setPreflightResult(res);
    } catch (e) {
      console.error('Preflight error:', e);
    } finally {
      setIsPreflightRunning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(assignment.id, content, notes);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </button>

        <div className="flex items-center gap-2">
          {evaluation ? (
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
              Graded · {evaluation.totalScore} / {assignment.maxPoints} pts (
              {evaluation.gradeLetter})
            </span>
          ) : isSubmitted ? (
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-md">
              Submitted · Awaiting Review
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md">
              Due {new Date(assignment.dueAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Assignment Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Assignment
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{assignment.title}</h1>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{assignment.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>
              <strong>{assignment.maxPoints}</strong> max points
            </span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Due {new Date(assignment.dueAt).toLocaleDateString()} at 11:59 PM</span>
          </div>
          <span>·</span>
          <div>
            Format: <span className="capitalize font-medium text-slate-700">{assignment.type}</span>
          </div>
        </div>
      </div>

      {/* If Graded: Show Complete Graded Rubric Scorecard */}
      {evaluation && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Your Final Rubric Evaluation</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  {evaluation.totalScore}
                </span>
                <span className="text-sm text-slate-400">/ {assignment.maxPoints} pts</span>
                <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                  {evaluation.percentage}% ({evaluation.gradeLetter})
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block">Evaluated by</span>
              <span className="font-semibold text-slate-200">{evaluation.gradedBy}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {new Date(evaluation.gradedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Holistic Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-800">Instructor &amp; AI Pedagogical Summary</div>
            <p className="text-slate-600 leading-relaxed">
              {evaluation.overallSummary}
            </p>
            {evaluation.teacherNotes && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-slate-700 bg-white p-3 rounded-lg">
                <span className="font-semibold text-indigo-700 block mb-1">
                  Personal Instructor Note:
                </span>
                {evaluation.teacherNotes}
              </div>
            )}
          </div>

          {/* Rubric Breakdown */}
          <RubricViewer
            rubric={assignment.rubric}
            evaluationScores={evaluation.rubricScores}
            editable={false}
          />

          {/* Strengths & Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="font-semibold text-emerald-900">What You Did Well</div>
              <ul className="space-y-1.5 text-emerald-900">
                {evaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-700">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="font-semibold text-indigo-900">Actionable Next Steps</div>
              <ul className="space-y-1.5 text-indigo-900">
                {evaluation.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-700">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs: Submission Editor vs Attached Rubric */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {isSubmitted ? 'Your Submitted Work' : 'Work & Draft Submission'}
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'rubric'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Attached Grading Rubric ({assignment.rubric.length} Criteria)
            </button>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleRunPreflight}
              disabled={isPreflightRunning || !content.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
              <span>{isPreflightRunning ? 'Analyzing against rubric...' : 'AI Pre-Flight Check'}</span>
            </button>
          )}
        </div>

        <div className="p-6">
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                <strong>Rubric Guidelines:</strong> Review these criteria closely before submitting.
                Your submission will be scored automatically and reviewed by your instructor using this exact
                scale.
              </div>
              <RubricViewer rubric={assignment.rubric} editable={false} />
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Instructions preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800">Prompt &amp; Instructions</div>
                <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {assignment.instructions}
                </div>
              </div>

              {/* Pre-Flight Formative AI Feedback if available */}
              {preflightResult && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-700" />
                      <h4 className="font-bold text-indigo-950">
                        AI Pre-Flight Check: {preflightResult.readinessLevel}
                      </h4>
                    </div>
                    <span className="font-mono font-bold text-indigo-700">
                      {preflightResult.readinessScore}% Readiness
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                      <span className="font-semibold text-emerald-800 block">Rubric Criteria Satisfied:</span>
                      <ul className="space-y-1 text-slate-700">
                        {preflightResult.rubricAlignmentHighlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-700 font-bold">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                      <span className="font-semibold text-amber-800 block">Immediate Fixes Before Submitting:</span>
                      <ul className="space-y-1 text-slate-700">
                        {preflightResult.immediateFixes.map((f, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-amber-600 font-bold">!</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Text Area */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-800">
                      {assignment.type === 'code' ? 'Code / Markdown Implementation' : 'Submission Content'}
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {content.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Write or paste your submission here..."
                    className="w-full font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-4 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                {!isSubmitted && (
                  <div>
                    <label className="text-xs font-semibold text-slate-800 mb-1.5 block">
                      Student Comments / Reflection (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any notes for your instructor about assumptions or challenges..."
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                )}

                {!isSubmitted && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('rubric')}
                      className="text-xs text-slate-600 hover:text-indigo-600 font-medium underline cursor-pointer"
                    >
                      Double-check attached rubric before submitting
                    </button>

                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Assignment</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
