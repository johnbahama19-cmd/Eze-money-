import React, { useState, useEffect } from 'react';
import { Course, Student, Assignment, Submission, ClassPulseInsights } from '../types';
import { fetchClassPulse } from '../services/api';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Users,
  CheckCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

interface ClassPulseModalProps {
  course: Course;
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  isOpen: boolean;
  onClose: () => void;
}

export const ClassPulseModal: React.FC<ClassPulseModalProps> = ({
  course,
  students,
  assignments,
  submissions,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [pulseData, setPulseData] = useState<ClassPulseInsights | null>(null);

  const loadPulse = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClassPulse({
        courseName: course.name,
        students,
        assignments,
        recentSubmissions: submissions,
      });
      setPulseData(data);
    } catch (e) {
      console.error('Error fetching class pulse:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !pulseData) {
      loadPulse();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Automated Classroom Pulse &amp; Progress Intelligence</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{course.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPulse}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Pulse</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900">
                Synthesizing Automated Class Diagnostics
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Scanning student rubric scores across {assignments.length} assignments to detect
                widespread misconceptions and early warning patterns...
              </p>
            </div>
          )}

          {!isLoading && pulseData && (
            <div className="space-y-6">
              {/* Top Pulse Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Class Average</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {pulseData.classAverage}%
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Submission Rate</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                    {pulseData.submissionRate}%
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Total Enrolled</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {students.length} students
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-medium text-slate-500 uppercase">Interventions</span>
                  <div className="text-2xl font-extrabold text-amber-600 mt-0.5">
                    {pulseData.recommendedInterventions.length} target areas
                  </div>
                </div>
              </div>

              {/* Holistic Summary Briefing */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1.5">
                <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-700" />
                  <span>Executive Classroom Synthesis</span>
                </div>
                <p className="text-indigo-900 leading-relaxed">
                  {pulseData.summaryBriefing}
                </p>
              </div>

              {/* Strengths & Misconceptions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Top Class-Wide Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-emerald-950">
                    {pulseData.topStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">·</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Common Rubric Misconceptions</span>
                  </div>
                  <ul className="space-y-1.5 text-amber-950">
                    {pulseData.commonMisconceptions.map((misc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold shrink-0">·</span>
                        <span>{misc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Interventions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Targeted Pedagogical Interventions
                </h3>
                <div className="space-y-2.5">
                  {pulseData.recommendedInterventions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.topic}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Recommended Action
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{item.actionableAdvice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
