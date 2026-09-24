import React from 'react';
import { Course } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  User,
  ShieldCheck,
  Zap,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'teacher' | 'student';
  onRoleToggle: (role: 'teacher' | 'student') => void;
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  isPaidUnlocked: boolean;
  onOpenPaymentModal: () => void;
  remainingCredits: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleToggle,
  courses,
  selectedCourseId,
  onSelectCourse,
  isPaidUnlocked,
  onOpenPaymentModal,
  remainingCredits,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                SynapseClass
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Assignments · Rubrics · Automated Tracking
            </p>
          </div>
        </div>

        {/* Center: Course Switcher (visible for instructor) */}
        {currentRole === 'teacher' && (
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Active Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right: Payment/Credits badge, Role switcher, User profile */}
        <div className="flex items-center gap-3">
          {/* Payment & Credits Status */}
          <button
            type="button"
            onClick={onOpenPaymentModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isPaidUnlocked
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isPaidUnlocked ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>$100 Pass Active</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-emerald-700">{remainingCredits} AI Credits</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Pay $100 Before Using</span>
              </>
            )}
          </button>

          {/* Role Toggle Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onRoleToggle('teacher')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentRole === 'teacher'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => onRoleToggle('student')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Student
            </button>
          </div>

          {/* User Profile Badge (Ezeugo) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src="/assets/wallpaper.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40 shadow-xs"
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {currentRole === 'teacher' ? 'Prof. Ezeugo' : 'Ezeugo'}
              </span>
              <span className="text-[10px] text-slate-500 capitalize leading-tight">
                {currentRole === 'teacher' ? 'Lead Faculty' : 'Student Scholar'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
