import React, { useState } from 'react';
import { Student, Assignment, Submission, RubricEvaluation } from '../types';
import { fetchStudentGrowthPlan } from '../services/api';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface StudentProgressModalProps {
  student: Student;
  assignments: Assignment[];
  submissions: Submission[];
  isOpen: boolean;
  onClose: () => void;
  onViewSubmission?: (submission: Submission, assignment: Assignment) => void;
}

export const StudentProgressModal: React.FC<StudentProgressModalProps> = ({
  student,
  assignments,
  submissions,
  isOpen,
  onClose,
  onViewSubmission,
}) => {
  if (!isOpen) return null;

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [growthPlan, setGrowthPlan] = useState<{
    focusArea: string;
    personalizedTip: string;
    actionPlan: { day: string; task: string; minutes: number }[];
    suggestedPracticePrompt: string;
  } | null>(null);

  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const gradedSubmissions = studentSubmissions.filter((s) => s.status === 'graded' && s.evaluation);

  const handleGenerateGrowthPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const recentEvals = gradedSubmissions
        .map((s) => s.evaluation!)
        .filter(Boolean);
      const plan = await fetchStudentGrowthPlan({
        student,
        recentEvaluations: recentEvals,
      });
      setGrowthPlan(plan);
    } catch (e) {
      console.error('Error fetching growth plan:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getStatusBadge = () => {
    switch (student.status) {
      case 'excelling':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md">
            Excelling · Top Tier
          </span>
        );
      case 'on_track':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-md">
            On Track · Consistent Mastery
          </span>
        );
      case 'needs_attention':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md">
            Needs Attention · Early Warning
          </span>
        );
      case 'at_risk':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 bg-rose-100 text-rose-800 rounded-md">
            At Risk · Intervention Needed
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{student.name}</h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Performance Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Overall Average</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {student.overallPercentage}%
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Cumulative GPA</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {student.overallGpa.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Submissions</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {gradedSubmissions.length} / {assignments.length}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Progress Status</span>
              <div className="text-sm font-bold text-slate-800 capitalize mt-1.5">
                {student.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Automated Alert if any */}
          {student.recentAlert && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Automated Progress Alert:</strong>
                <span>{student.recentAlert}</span>
              </div>
            </div>
          )}

          {/* Skill Dimensions Progress Bars */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Competency Dimensions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated trajectory automatically synthesized from attached rubric criteria
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">Mastery Scale (0-100)</span>
            </div>

            <div className="space-y-3">
              {student.skillDimensions.map((skill, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      {skill.trend === 'up' && (
                        <span className="text-emerald-700 flex items-center text-[11px]">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          Gaining
                        </span>
                      )}
                      {skill.trend === 'down' && (
                        <span className="text-amber-700 flex items-center text-[11px]">
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                          Lagging
                        </span>
                      )}
                      {skill.trend === 'stable' && (
                        <span className="text-slate-600 flex items-center text-[11px]">
                          <Minus className="w-3 h-3 mr-0.5" />
                          Steady
                        </span>
                      )}
                      <span className="font-bold text-slate-900">{skill.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        skill.score >= 90
                          ? 'bg-emerald-700'
                          : skill.score >= 75
                          ? 'bg-indigo-700'
                          : 'bg-amber-700'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Personalized Study Plan Booster */}
          <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-700" />
                <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Automated AI Growth Plan
                </h3>
              </div>
              <button
                type="button"
                onClick={handleGenerateGrowthPlan}
                disabled={isGeneratingPlan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>{isGeneratingPlan ? 'Synthesizing...' : 'Generate Personalized Plan'}</span>
              </button>
            </div>

            {growthPlan ? (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-lg border border-indigo-100">
                  <span className="font-bold text-slate-800 block mb-1">
                    Primary Focus: {growthPlan.focusArea}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{growthPlan.personalizedTip}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {growthPlan.actionPlan.map((step, sIdx) => (
                    <div key={sIdx} className="p-2.5 bg-white rounded-lg border border-indigo-100">
                      <div className="flex items-center justify-between font-semibold text-indigo-900 mb-1">
                        <span>{step.day}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.minutes} mins</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{step.task}</p>
                    </div>
                  ))}
                </div>

                {growthPlan.suggestedPracticePrompt && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg">
                    <span className="font-semibold text-amber-900 block mb-0.5">
                      Suggested Micro-Practice Exercise:
                    </span>
                    <p className="text-amber-800 italic">{growthPlan.suggestedPracticePrompt}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-indigo-900 leading-relaxed">
                Click "Generate Personalized Plan" to analyze {student.name}'s rubric trends and automatically
                generate a targeted 3-day micro-study roadmap.
              </p>
            )}
          </div>

          {/* Assignment & Rubric History */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Assignment History &amp; Rubric Scores</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-200 text-xs">
              {assignments.map((asg) => {
                const sub = studentSubmissions.find((s) => s.assignmentId === asg.id);
                const hasGrade = sub?.status === 'graded' && sub.evaluation;

                return (
                  <div key={asg.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-semibold text-slate-900">{asg.title}</div>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">
                        {asg.rubric.length} rubric criteria · Max: {asg.maxPoints} pts
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {hasGrade ? (
                        <div className="text-right">
                          <span className="font-bold text-slate-900 text-sm">
                            {sub.evaluation?.totalScore} / {asg.maxPoints} pts
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            {sub.evaluation?.gradeLetter} ({sub.evaluation?.percentage}%)
                          </span>
                        </div>
                      ) : sub ? (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-semibold text-[11px]">
                          Submitted · Pending
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px]">
                          Not Submitted
                        </span>
                      )}

                      {sub && onViewSubmission && (
                        <button
                          type="button"
                          onClick={() => onViewSubmission(sub, asg)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                          title="View Rubric Scorecard"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
