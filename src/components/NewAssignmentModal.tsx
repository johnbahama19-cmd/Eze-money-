import React, { useState } from 'react';
import { Course, Assignment, RubricCriterion, AssignmentType } from '../types';
import { RubricBuilder } from './RubricBuilder';
import { generateAssignmentWithAi } from '../services/api';
import { X, Sparkles, Plus, Award, Calendar, BookOpen, Layers } from 'lucide-react';

interface NewAssignmentModalProps {
  courses: Course[];
  selectedCourseId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateAssignment: (newAssignment: Assignment) => void;
}

export const NewAssignmentModal: React.FC<NewAssignmentModalProps> = ({
  courses,
  selectedCourseId,
  isOpen,
  onClose,
  onCreateAssignment,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'rubric' | 'ai_assistant'>('details');

  // Form fields
  const [courseId, setCourseId] = useState(selectedCourseId || courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [type, setType] = useState<AssignmentType>('essay');
  const [dueAt, setDueAt] = useState('2026-10-15T23:59');
  const [maxPoints, setMaxPoints] = useState(100);
  const [starterSnippet, setStarterSnippet] = useState('');

  // Attached Rubric State
  const [rubric, setRubric] = useState<RubricCriterion[]>([
    {
      id: 'crit-init-1',
      title: 'Conceptual Depth & Accuracy',
      maxScore: 30,
      description: 'Mastery of foundational theory and accurate explanation.',
      levels: [
        { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Flawless conceptual rigor.' },
        { label: 'Proficient', scoreRange: '23-26 pts', description: 'Strong understanding with minor slips.' },
        { label: 'Developing', scoreRange: '18-22 pts', description: 'Partial comprehension of core principles.' },
        { label: 'Beginning', scoreRange: '0-17 pts', description: 'Inaccurate or missing definitions.' },
      ],
    },
    {
      id: 'crit-init-2',
      title: 'Evidence & Analytical Reasoning',
      maxScore: 30,
      description: 'Sound logic supported by verified case studies, empirical data, or textual citations.',
      levels: [
        { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Compelling evidentiary support.' },
        { label: 'Proficient', scoreRange: '23-26 pts', description: 'Sufficient proof for major assertions.' },
        { label: 'Developing', scoreRange: '18-22 pts', description: 'Weak connection between data and claims.' },
        { label: 'Beginning', scoreRange: '0-17 pts', description: 'No verifiable evidence provided.' },
      ],
    },
    {
      id: 'crit-init-3',
      title: 'Structure, Coherence & Flow',
      maxScore: 20,
      description: 'Logical sequencing of ideas, fluid transitions, and clear organization.',
    },
    {
      id: 'crit-init-4',
      title: 'Execution & Technical Polish',
      maxScore: 20,
      description: 'Adherence to formatting guidelines, technical accuracy, and academic integrity.',
    },
  ]);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [aiGradeLevel, setAiGradeLevel] = useState('Advanced High School / Undergrad');
  const [aiLearningGoal, setAiLearningGoal] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiDraft = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    try {
      const currentCourse = courses.find((c) => c.id === courseId);
      const generated = await generateAssignmentWithAi({
        topic: aiTopic,
        subject: currentCourse?.name || 'General Discipline',
        gradeLevel: aiGradeLevel,
        assignmentType: type,
        learningGoal: aiLearningGoal,
      });

      if (generated.title) setTitle(generated.title);
      if (generated.description) setDescription(generated.description);
      if (generated.instructions) setInstructions(generated.instructions);
      if (generated.starterSnippet) setStarterSnippet(generated.starterSnippet);
      if (generated.maxPoints) setMaxPoints(generated.maxPoints);
      if (generated.rubric && Array.isArray(generated.rubric)) {
        setRubric(generated.rubric);
      }
      setActiveTab('rubric');
    } catch (e) {
      console.error('Error generating AI assignment:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || rubric.length === 0) return;

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      courseId,
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      type,
      dueAt,
      maxPoints,
      rubric,
      starterSnippet: starterSnippet.trim() || undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onCreateAssignment(newAssignment);
    onClose();
  };

  const totalRubricPoints = rubric.reduce((sum, r) => sum + (Number(r.maxScore) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Create New Assignment &amp; Attach Rubric
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify assignment specifications and build the grading rubric for automated assessment
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Assignment Details
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'rubric'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>2. Attached Grading Rubric</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                totalRubricPoints === maxPoints
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {totalRubricPoints}/{maxPoints} pts
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ai_assistant'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Curriculum Co-Pilot</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'ai_assistant' && (
            <div className="max-w-2xl mx-auto space-y-4 py-2">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs space-y-1.5">
                <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-700" />
                  <span>AI Automated Assignment &amp; Rubric Synthesizer</span>
                </div>
                <p className="text-indigo-900 leading-relaxed">
                  Enter your topic and learning targets. Gemini will automatically formulate a complete
                  pedagogical prompt, step-by-step instructions, and a calibrated 4-criteria grading rubric!
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Lesson Topic / Conceptual Focus *
                  </label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Dynamic Programming Memoization vs Tabulation, or Modernist Poetry & War"
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Grade / Mastery Level</label>
                    <input
                      type="text"
                      value={aiGradeLevel}
                      onChange={(e) => setAiGradeLevel(e.target.value)}
                      placeholder="e.g. AP / Undergraduate"
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Target Format</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AssignmentType)}
                      className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="essay">Analytical Essay</option>
                      <option value="code">Code Implementation</option>
                      <option value="lab_report">Scientific Lab Report</option>
                      <option value="short_answer">Short Answer Series</option>
                      <option value="project">Design Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Key Learning Objective (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={aiLearningGoal}
                    onChange={(e) => setAiLearningGoal(e.target.value)}
                    placeholder="e.g. Students must evaluate trade-offs between space and time complexity under scale."
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiDraft}
                  disabled={isGeneratingAi || !aiTopic.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isGeneratingAi
                      ? 'Generating Assignment Prompt & Calibrated Rubric...'
                      : 'Generate Assignment & Rubric with AI'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Class / Course *</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.period})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Assignment Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AssignmentType)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="essay">Analytical Essay</option>
                    <option value="code">Code &amp; Algorithm</option>
                    <option value="lab_report">Scientific Lab Report</option>
                    <option value="short_answer">Short Answer Reflection</option>
                    <option value="project">Capstone Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 4: Dijkstra's Shortest Path Algorithm"
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Due Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Total Assignment Points</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(Number(e.target.value) || 100)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Brief Overview / Summary
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short 1-2 sentence description shown on student cards..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Detailed Student Instructions &amp; Prompts
                </label>
                <textarea
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Step-by-step instructions, guidelines, required tools, reading references..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Starter Template / Code Scaffold (Optional)
                </label>
                <textarea
                  rows={3}
                  value={starterSnippet}
                  onChange={(e) => setStarterSnippet(e.target.value)}
                  placeholder="// Starter code, essay outline prompt, or test skeleton provided to students..."
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('rubric')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Continue to Attached Rubric →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Configure Attached Rubric</h3>
                  <p className="text-xs text-slate-500">
                    Students will see this rubric before submitting, and AI auto-grading will evaluate each
                    criterion specifically.
                  </p>
                </div>
              </div>

              <RubricBuilder
                rubric={rubric}
                onChange={setRubric}
                targetMaxPoints={maxPoints}
                assignmentTitle={title}
                assignmentInstructions={instructions}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="text-xs text-slate-500">
            {rubric.length} criteria attached · Total: {totalRubricPoints} / {maxPoints} pts
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
              onClick={handleSubmit}
              disabled={!title.trim() || rubric.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Assignment with Rubric</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
