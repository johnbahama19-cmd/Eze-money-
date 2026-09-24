import React, { useState } from 'react';
import { Course, Assignment, Student, Submission } from '../types';
import { RubricViewer } from './RubricViewer';
import { StudentSubmissionView } from './StudentSubmissionView';
import { fetchStudentGrowthPlan } from '../services/api';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  FileText,
  AlertCircle,
  ChevronRight,
  Send,
  Zap,
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  onSubmitWork: (assignmentId: string, content: string, notes?: string) => void;
  onOpenPaymentModal?: () => void;
  isPaidUnlocked?: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  courses,
  assignments,
  submissions,
  onSubmitWork,
  onOpenPaymentModal,
  isPaidUnlocked = true,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [filterCourseId, setFilterCourseId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'assignments' | 'progress' | 'rubrics'>('assignments');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [growthPlan, setGrowthPlan] = useState<{
    focusArea: string;
    personalizedTip: string;
    actionPlan: { day: string; task: string; minutes: number }[];
    suggestedPracticePrompt: string;
  } | null>(null);

  // Filtered assignments for student courses
  const enrolledCourses = courses.filter((c) => student.courseIds.includes(c.id));
  const studentAssignments = assignments.filter((a) =>
    filterCourseId === 'all'
      ? student.courseIds.includes(a.courseId)
      : a.courseId === filterCourseId
  );

  const studentSubmissions = submissions.filter((s) => s.studentId === student.id);
  const gradedCount = studentSubmissions.filter((s) => s.status === 'graded').length;
  const pendingCount = studentSubmissions.filter((s) => s.status === 'submitted').length;

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const recentEvals = studentSubmissions
        .map((s) => s.evaluation!)
        .filter(Boolean);
      const plan = await fetchStudentGrowthPlan({
        student,
        recentEvaluations: recentEvals,
      });
      setGrowthPlan(plan);
    } catch (e) {
      console.error('Error generating growth plan:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // If viewing/working on an assignment
  if (selectedAssignment) {
    const existingSubmission = studentSubmissions.find(
      (s) => s.assignmentId === selectedAssignment.id
    );

    return (
      <StudentSubmissionView
        assignment={selectedAssignment}
        submission={existingSubmission}
        studentId={student.id}
        studentName={student.name}
        studentEmail={student.email}
        onSubmit={(asgId, content, notes) => {
          onSubmitWork(asgId, content, notes);
          setSelectedAssignment(null);
        }}
        onBack={() => setSelectedAssignment(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Welcome & Quick Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome back, {student.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  {student.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.email} · Enrolled in {enrolledCourses.length} active courses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPaidUnlocked && onOpenPaymentModal && (
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Unlock $100 Pass</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>My AI Growth Plan</span>
            </button>
          </div>
        </div>

        {/* 4 Student Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">
              Current GPA
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {student.overallGpa.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Cumulative scale 4.0</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">
              Rubric Mastery Average
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {student.overallPercentage}%
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              Across all criteria
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">
              Completed &amp; Graded
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {gradedCount}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
              Evaluations returned
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 uppercase">
              Pending Submissions
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {pendingCount}
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">
              Awaiting instructor review
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Tab Headers & Course Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'assignments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Assignments &amp; Attached Rubrics ({studentAssignments.length})
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'progress'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Skill Progress &amp; AI Study Booster
            </button>

            <button
              onClick={() => setActiveTab('rubrics')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'rubrics'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              All Rubric Criteria Standards
            </button>
          </div>

          <div className="pb-3 sm:pb-0">
            <select
              value={filterCourseId}
              onChange={(e) => setFilterCourseId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Enrolled Courses</option>
              {enrolledCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab 1: Assignments list */}
        {activeTab === 'assignments' && (
          <div className="p-6 divide-y divide-slate-100">
            {studentAssignments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No assignments found for this course filter.
              </div>
            ) : (
              studentAssignments.map((asg) => {
                const sub = studentSubmissions.find((s) => s.assignmentId === asg.id);
                const isGraded = sub?.status === 'graded' && sub.evaluation;
                const isSubmitted = sub?.status === 'submitted';
                const course = courses.find((c) => c.id === asg.courseId);

                return (
                  <div
                    key={asg.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {course?.code || 'Course'}
                        </span>
                        <span className="text-slate-300">·</span>
                        <h3 className="text-sm font-bold text-slate-900">{asg.title}</h3>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {asg.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="font-medium text-slate-700">
                          {asg.maxPoints} pts total
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-indigo-700">
                          <Award className="w-3.5 h-3.5" />
                          <strong>{asg.rubric.length}</strong> rubric criteria attached
                        </span>
                        <span>·</span>
                        <span>Due {new Date(asg.dueAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isGraded ? (
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 block">
                            {sub.evaluation?.totalScore} / {asg.maxPoints} pts
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600">
                            {sub.evaluation?.gradeLetter} ({sub.evaluation?.percentage}%)
                          </span>
                        </div>
                      ) : isSubmitted ? (
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                          Submitted · In Review
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                          Not Submitted
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(asg)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isGraded
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            : isSubmitted
                            ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        <span>
                          {isGraded
                            ? 'View Graded Rubric'
                            : isSubmitted
                            ? 'View Submission & Rubric'
                            : 'Open Rubric & Submit Work'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Skill Progress & AI Study Booster */}
        {activeTab === 'progress' && (
          <div className="p-6 space-y-6">
            {/* Skill Dimensions Radar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Your Rubric Skill Dimensions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synthesized from your graded rubric performances across all submitted work
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">Mastery (0 - 100)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.skillDimensions.map((skill, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{skill.name}</span>
                      <span className="font-mono font-bold text-slate-900">{skill.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          skill.score >= 90
                            ? 'bg-emerald-600'
                            : skill.score >= 75
                            ? 'bg-indigo-600'
                            : 'bg-amber-600'
                        }`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {skill.trend === 'up'
                        ? '↑ Positive upward trend on recent assignments'
                        : skill.trend === 'down'
                        ? '↓ Needs targeted practice to reinforce criteria'
                        : '→ Stable benchmark consistency'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Personalized Study Plan Booster */}
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Automated AI Study Booster
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  disabled={isGeneratingPlan}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>{isGeneratingPlan ? 'Synthesizing Roadmap...' : 'Generate My 3-Day Plan'}</span>
                </button>
              </div>

              {growthPlan ? (
                <div className="space-y-4 pt-1 text-xs">
                  <div className="p-4 bg-white rounded-xl border border-indigo-100 space-y-1">
                    <span className="font-bold text-slate-900 block text-sm">
                      Recommended Focus: {growthPlan.focusArea}
                    </span>
                    <p className="text-slate-600 leading-relaxed">{growthPlan.personalizedTip}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {growthPlan.actionPlan.map((step, sIdx) => (
                      <div key={sIdx} className="p-3.5 bg-white rounded-xl border border-indigo-100 space-y-1">
                        <div className="flex items-center justify-between font-bold text-indigo-950">
                          <span>{step.day}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {step.minutes} mins
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{step.task}</p>
                      </div>
                    ))}
                  </div>

                  {growthPlan.suggestedPracticePrompt && (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                      <span className="font-semibold text-amber-900 block">
                        Targeted Micro-Exercise:
                      </span>
                      <p className="text-amber-800 italic">{growthPlan.suggestedPracticePrompt}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Click "Generate My 3-Day Plan" to analyze your latest rubric scores and receive
                  tailored micro-study exercises designed to boost your weakest rubric areas!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Rubrics Directory */}
        {activeTab === 'rubrics' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Grading Rubric Criteria Reference
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Understand the exact standards and point breakdowns used by instructors to evaluate your work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentAssignments.map((asg) => (
                <div key={asg.id} className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase">
                        {asg.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{asg.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200">
                      {asg.maxPoints} pts
                    </span>
                  </div>

                  <RubricViewer rubric={asg.rubric} editable={false} showProficiencyTiers={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
