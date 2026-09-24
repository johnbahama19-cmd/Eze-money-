import React, { useState } from 'react';
import { Course, Assignment, Student, Submission, RubricEvaluation } from '../types';
import { RubricViewer } from './RubricViewer';
import { GradingModal } from './GradingModal';
import { NewAssignmentModal } from './NewAssignmentModal';
import { StudentProgressModal } from './StudentProgressModal';
import { ClassPulseModal } from './ClassPulseModal';
import { gradeSubmissionWithAi } from '../services/api';
import {
  Plus,
  Sparkles,
  Award,
  Users,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Filter,
  Layers,
  Search,
  BookOpen,
} from 'lucide-react';

interface TeacherDashboardProps {
  currentCourse: Course;
  courses: Course[];
  assignments: Assignment[];
  students: Student[];
  submissions: Submission[];
  onSelectCourse: (courseId: string) => void;
  onCreateAssignment: (assignment: Assignment) => void;
  onSaveGrading: (submissionId: string, evaluation: RubricEvaluation) => void;
  onBatchAutoGrade: () => Promise<void>;
  isBatchGrading: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentCourse,
  courses,
  assignments,
  students,
  submissions,
  onSelectCourse,
  onCreateAssignment,
  onSaveGrading,
  onBatchAutoGrade,
  isBatchGrading,
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions' | 'students' | 'rubrics'>('assignments');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewAsgOpen, setIsNewAsgOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<{
    submission: Submission;
    assignment: Assignment;
  } | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedAssignmentForPreview, setSelectedAssignmentForPreview] = useState<Assignment | null>(null);

  // Filtered data for current course
  const courseAssignments = assignments.filter((a) => a.courseId === currentCourse.id);
  const courseStudents = students.filter((s) => s.courseIds.includes(currentCourse.id));
  const courseSubmissions = submissions.filter((sub) => {
    const asg = assignments.find((a) => a.id === sub.assignmentId);
    return asg?.courseId === currentCourse.id;
  });

  const pendingSubmissions = courseSubmissions.filter((s) => s.status === 'submitted');
  const gradedSubmissions = courseSubmissions.filter((s) => s.status === 'graded');

  const classAvg = courseStudents.length
    ? Math.round(
        courseStudents.reduce((sum, s) => sum + s.overallPercentage, 0) / courseStudents.length
      )
    : 0;

  const atRiskCount = courseStudents.filter(
    (s) => s.status === 'at_risk' || s.status === 'needs_attention'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Instructor Console
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-indigo-600">
                {currentCourse.instructorName}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">{currentCourse.name}</h1>
            <p className="text-xs text-slate-500 mt-1">{currentCourse.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPulseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Class Pulse</span>
            </button>

            {pendingSubmissions.length > 0 && (
              <button
                type="button"
                onClick={onBatchAutoGrade}
                disabled={isBatchGrading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isBatchGrading
                    ? 'AI Auto-Grading Batch...'
                    : `Auto-Grade All (${pendingSubmissions.length} Pending)`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsNewAsgOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment with Rubric</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium uppercase">
              <span>Enrolled Students</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {courseStudents.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Active in {currentCourse.period}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium uppercase">
              <span>Class Performance</span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{classAvg}%</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
              Average across all rubrics
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium uppercase">
              <span>Active Assignments</span>
              <Award className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {courseAssignments.length}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
              100% attached rubrics
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium uppercase">
              <span>Submissions to Grade</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {pendingSubmissions.length}
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">
              {atRiskCount} students with alerts
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Tab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'assignments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Assignments &amp; Attached Rubrics ({courseAssignments.length})
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'submissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Submissions &amp; Auto-Grading</span>
              {pendingSubmissions.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-800 font-bold rounded-full">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'students'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Student Roster &amp; Progress Tracking ({courseStudents.length})
            </button>

            <button
              onClick={() => setActiveTab('rubrics')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'rubrics'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Rubrics Directory
            </button>
          </div>

          <div className="pb-3 sm:pb-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 w-44"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Assignments with Attached Rubrics */}
        {activeTab === 'assignments' && (
          <div className="p-6 divide-y divide-slate-100">
            {courseAssignments.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No assignments created for this course yet.
              </div>
            ) : (
              courseAssignments
                .filter((a) =>
                  a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((asg) => {
                  const asgSubmissions = courseSubmissions.filter((s) => s.assignmentId === asg.id);
                  const gradedCount = asgSubmissions.filter((s) => s.status === 'graded').length;

                  return (
                    <div
                      key={asg.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-600 capitalize">
                            {asg.type}
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
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            <strong>{asg.rubric.length}</strong> attached rubric criteria
                          </span>
                          <span>·</span>
                          <span>Due {new Date(asg.dueAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>
                            {asgSubmissions.length} submissions ({gradedCount} graded)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedAssignmentForPreview(asg)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Attached Rubric
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const pending = asgSubmissions.find((s) => s.status === 'submitted');
                            if (pending) {
                              setSelectedSubmissionForGrading({
                                submission: pending,
                                assignment: asg,
                              });
                            } else if (asgSubmissions[0]) {
                              setSelectedSubmissionForGrading({
                                submission: asgSubmissions[0],
                                assignment: asg,
                              });
                            }
                          }}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Grade Submissions ({asgSubmissions.length})
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Tab 2: Submissions & Auto-Grading */}
        {activeTab === 'submissions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">Assignment</th>
                  <th className="py-3 px-6">Submitted Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Rubric Score</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No submissions recorded for this course yet.
                    </td>
                  </tr>
                ) : (
                  courseSubmissions
                    .filter((s) =>
                      s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((sub) => {
                      const asg = assignments.find((a) => a.id === sub.assignmentId);
                      const isGraded = sub.status === 'graded' && sub.evaluation;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-6 font-semibold text-slate-900">
                            {sub.studentName}
                            <span className="block text-[11px] font-normal text-slate-400">
                              {sub.studentEmail}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            {asg?.title || 'Assignment'}
                          </td>
                          <td className="py-3.5 px-6 text-slate-500">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-6">
                            {isGraded ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle className="w-3 h-3" />
                                Graded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                Needs Review
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                            {isGraded ? (
                              <span>
                                {sub.evaluation?.totalScore} / {asg?.maxPoints || 100} pts (
                                {sub.evaluation?.gradeLetter})
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">-- / {asg?.maxPoints} pts</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            {asg && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedSubmissionForGrading({
                                    submission: sub,
                                    assignment: asg,
                                  })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                  isGraded
                                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                                }`}
                              >
                                {isGraded ? 'Review Rubric' : 'Evaluate Rubric'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Student Roster & Automated Progress Tracking */}
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">GPA</th>
                  <th className="py-3 px-6">Overall Average</th>
                  <th className="py-3 px-6">Progress Status</th>
                  <th className="py-3 px-6">Skill Dimensions Mastery</th>
                  <th className="py-3 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseStudents
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">{student.name}</span>
                            <span className="text-[11px] text-slate-400">{student.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                        {student.overallGpa.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-6 font-mono font-bold text-slate-800">
                        {student.overallPercentage}%
                      </td>

                      <td className="py-3.5 px-6">
                        {student.status === 'excelling' && (
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Excelling
                          </span>
                        )}
                        {student.status === 'on_track' && (
                          <span className="text-[11px] font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                            On Track
                          </span>
                        )}
                        {student.status === 'needs_attention' && (
                          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Needs Attention
                          </span>
                        )}
                        {student.status === 'at_risk' && (
                          <span className="text-[11px] font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                            At Risk
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1 max-w-xs">
                          {student.skillDimensions.map((k, kIdx) => (
                            <div key={kIdx} className="flex-1" title={`${k.name}: ${k.score}%`}>
                              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    k.score >= 90
                                      ? 'bg-emerald-600'
                                      : k.score >= 75
                                      ? 'bg-indigo-600'
                                      : 'bg-amber-600'
                                  }`}
                                  style={{ width: `${k.score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForProfile(student)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          View Trajectory
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Rubrics Directory */}
        {activeTab === 'rubrics' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Attached Rubrics Directory ({courseAssignments.length} Rubrics)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full list of criteria and scoring metrics attached to assignments for {currentCourse.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase">
                        {asg.type} Rubric
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{asg.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200">
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

      {/* New Assignment Modal */}
      <NewAssignmentModal
        courses={courses}
        selectedCourseId={currentCourse.id}
        isOpen={isNewAsgOpen}
        onClose={() => setIsNewAsgOpen(false)}
        onCreateAssignment={onCreateAssignment}
      />

      {/* Grading Modal */}
      {selectedSubmissionForGrading && (
        <GradingModal
          assignment={selectedSubmissionForGrading.assignment}
          submission={selectedSubmissionForGrading.submission}
          isOpen={true}
          onClose={() => setSelectedSubmissionForGrading(null)}
          onSaveGrading={onSaveGrading}
        />
      )}

      {/* Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProgressModal
          student={selectedStudentForProfile}
          assignments={courseAssignments}
          submissions={submissions}
          isOpen={true}
          onClose={() => setSelectedStudentForProfile(null)}
          onViewSubmission={(sub, asg) => {
            setSelectedStudentForProfile(null);
            setSelectedSubmissionForGrading({ submission: sub, assignment: asg });
          }}
        />
      )}

      {/* Class Pulse Modal */}
      <ClassPulseModal
        course={currentCourse}
        students={courseStudents}
        assignments={courseAssignments}
        submissions={courseSubmissions}
        isOpen={isPulseOpen}
        onClose={() => setIsPulseOpen(false)}
      />

      {/* Assignment Attached Rubric Preview Modal */}
      {selectedAssignmentForPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Attached Grading Rubric
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAssignmentForPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentForPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                X
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                <strong>Rubric Overview:</strong> This rubric is attached to "{selectedAssignmentForPreview.title}".
                Students can view these criteria and proficiency benchmarks before submitting their work.
              </div>
              <RubricViewer rubric={selectedAssignmentForPreview.rubric} editable={false} />
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedAssignmentForPreview(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Rubric
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
