import React, { useState } from 'react';
import { RubricCriterion, ProficiencyLevel } from '../types';
import { Plus, Trash2, Sparkles, Scale, BookOpen, Layers, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RubricBuilderProps {
  rubric: RubricCriterion[];
  onChange: (rubric: RubricCriterion[]) => void;
  targetMaxPoints?: number;
  assignmentTitle?: string;
  assignmentInstructions?: string;
}

const RUBRIC_PRESETS: { name: string; criteria: RubricCriterion[] }[] = [
  {
    name: 'Analytical Essay & Thesis Rubric',
    criteria: [
      {
        id: 'crit-preset-1',
        title: 'Thesis & Argument Formulation',
        maxScore: 30,
        description: 'Presents an arguable, insightful thesis statement supported by coherent logical structure.',
        levels: [
          { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Sophisticated thesis with complex interpretive stance.' },
          { label: 'Proficient', scoreRange: '23-26 pts', description: 'Clear and defensible claim addressing the prompt.' },
          { label: 'Developing', scoreRange: '18-22 pts', description: 'Descriptive or overly generalized argument.' },
          { label: 'Beginning', scoreRange: '0-17 pts', description: 'Missing or incoherent central thesis.' },
        ],
      },
      {
        id: 'crit-preset-2',
        title: 'Textual Evidence & Synthesis',
        maxScore: 30,
        description: 'Integrates authoritative primary and secondary evidence with rigorous contextual analysis.',
        levels: [
          { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Seamlessly embeds quotes with penetrating close-reading.' },
          { label: 'Proficient', scoreRange: '23-26 pts', description: 'Accurate citations supporting all main claims.' },
          { label: 'Developing', scoreRange: '18-22 pts', description: 'Quotes present but lack sufficient analytical dissection.' },
          { label: 'Beginning', scoreRange: '0-17 pts', description: 'Sparse or inaccurate textual references.' },
        ],
      },
      {
        id: 'crit-preset-3',
        title: 'Structure, Flow & Coherence',
        maxScore: 20,
        description: 'Logical sequencing of paragraphs with smooth conceptual transitions.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Effortless thematic progression from introduction to synthesis.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Clear topic sentences and structured transitions.' },
          { label: 'Developing', scoreRange: '11-14 pts', description: 'Occasional abrupt transitions or digressions.' },
          { label: 'Beginning', scoreRange: '0-10 pts', description: 'Disorganized paragraph architecture.' },
        ],
      },
      {
        id: 'crit-preset-4',
        title: 'Mechanics, Style & Academic Conventions',
        maxScore: 20,
        description: 'Fluent academic voice, proper citation syntax, and rigorous grammatical control.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Distinct scholarly voice with zero stylistic errors.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Clear writing with negligible formatting slips.' },
          { label: 'Developing', scoreRange: '11-14 pts', description: 'Repetitive prose or periodic citation errors.' },
          { label: 'Beginning', scoreRange: '0-10 pts', description: 'Frequent grammatical defects hindering meaning.' },
        ],
      },
    ],
  },
  {
    name: 'Computer Science & Algorithmic Rubric',
    criteria: [
      {
        id: 'crit-cs-p1',
        title: 'Algorithmic Correctness & Time/Space Complexity',
        maxScore: 35,
        description: 'Code executes without logical bugs, meets runtime asymptotic bounds, and preserves invariants.',
        levels: [
          { label: 'Exemplary', scoreRange: '32-35 pts', description: 'Optimal complexity with zero logic flaws across edge cases.' },
          { label: 'Proficient', scoreRange: '28-31 pts', description: 'Correct algorithm meeting target Big-O bounds.' },
          { label: 'Developing', scoreRange: '20-27 pts', description: 'Suboptimal complexity or fails on non-standard inputs.' },
          { label: 'Beginning', scoreRange: '0-19 pts', description: 'Severe logic errors or infinite loops.' },
        ],
      },
      {
        id: 'crit-cs-p2',
        title: 'Modular Architecture & Code Cleanliness',
        maxScore: 25,
        description: 'Sensible abstraction, adherence to idiomatic conventions, and clean encapsulation.',
        levels: [
          { label: 'Exemplary', scoreRange: '23-25 pts', description: 'Professional software engineering principles demonstrated.' },
          { label: 'Proficient', scoreRange: '19-22 pts', description: 'Readable, well-structured functions and classes.' },
          { label: 'Developing', scoreRange: '15-18 pts', description: 'Monolithic functions with tangled dependencies.' },
          { label: 'Beginning', scoreRange: '0-14 pts', description: 'Unreadable or unstructured code.' },
        ],
      },
      {
        id: 'crit-cs-p3',
        title: 'Automated Test Harness & Edge Cases',
        maxScore: 20,
        description: 'Unit tests verifying boundary conditions, null values, and stress testing.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Exhaustive edge-case test suite with high branch coverage.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Solid coverage of typical and boundary inputs.' },
          { label: 'Developing', scoreRange: '10-14 pts', description: 'Only basic happy-path assertions.' },
          { label: 'Beginning', scoreRange: '0-9 pts', description: 'Missing test suite.' },
        ],
      },
      {
        id: 'crit-cs-p4',
        title: 'Technical Documentation & Complexity Proof',
        maxScore: 20,
        description: 'Accompanying analytical report explaining trade-offs, benchmarks, and data structures.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Rigorous theoretical proof backed by empirical graphs.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Clear writeup explaining design choices.' },
          { label: 'Developing', scoreRange: '10-14 pts', description: 'Brief or incomplete technical explanation.' },
          { label: 'Beginning', scoreRange: '0-9 pts', description: 'Missing technical documentation.' },
        ],
      },
    ],
  },
  {
    name: 'Scientific Lab Report & Experimental Rubric',
    criteria: [
      {
        id: 'crit-lab-p1',
        title: 'Hypothesis Formulation & Methodological Design',
        maxScore: 25,
        description: 'Controlled experimental setup, clear variable identification, and sound protocol rationale.',
      },
      {
        id: 'crit-lab-p2',
        title: 'Empirical Data Analysis & Statistical Treatment',
        maxScore: 35,
        description: 'Rigorous calculation, error bars, p-value significance, and properly annotated figures.',
      },
      {
        id: 'crit-lab-p3',
        title: 'Scientific Discussion & Theoretical Context',
        maxScore: 25,
        description: 'Interpretation of outcomes against established literature, limitations, and future work.',
      },
      {
        id: 'crit-lab-p4',
        title: 'Scientific Writing & Protocol Reproducibility',
        maxScore: 15,
        description: 'Clarity, reproducibility, and standard scientific journal formatting.',
      },
    ],
  },
];

export const RubricBuilder: React.FC<RubricBuilderProps> = ({
  rubric,
  onChange,
  targetMaxPoints = 100,
  assignmentTitle = '',
  assignmentInstructions = '',
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const totalPoints = rubric.reduce((sum, c) => sum + (Number(c.maxScore) || 0), 0);
  const isBalanced = totalPoints === targetMaxPoints;

  const addCriterion = () => {
    const newId = `crit-${Date.now()}`;
    const newCriterion: RubricCriterion = {
      id: newId,
      title: 'New Evaluation Criterion',
      maxScore: 20,
      description: 'Describe the specific performance expectations for this criterion.',
      levels: [
        { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Exceeds all mastery benchmarks.' },
        { label: 'Proficient', scoreRange: '14-17 pts', description: 'Consistently meets standards.' },
        { label: 'Developing', scoreRange: '10-13 pts', description: 'Partially meets expectations.' },
        { label: 'Beginning', scoreRange: '0-9 pts', description: 'Does not yet demonstrate mastery.' },
      ],
    };
    onChange([...rubric, newCriterion]);
    setExpandedLevels((prev) => ({ ...prev, [newId]: true }));
  };

  const updateCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    onChange(
      rubric.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          return updated;
        }
        return c;
      })
    );
  };

  const removeCriterion = (id: string) => {
    onChange(rubric.filter((c) => c.id !== id));
  };

  const updateLevel = (criterionId: string, levelIndex: number, field: keyof ProficiencyLevel, value: string) => {
    onChange(
      rubric.map((c) => {
        if (c.id === criterionId && c.levels) {
          const newLevels = [...c.levels];
          newLevels[levelIndex] = { ...newLevels[levelIndex], [field]: value };
          return { ...c, levels: newLevels };
        }
        return c;
      })
    );
  };

  const applyPreset = (presetName: string) => {
    const preset = RUBRIC_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      onChange(JSON.parse(JSON.stringify(preset.criteria)));
    }
  };

  const evenlyDistributePoints = () => {
    if (rubric.length === 0) return;
    const basePoints = Math.floor(targetMaxPoints / rubric.length);
    const remainder = targetMaxPoints % rubric.length;

    const rebalanced = rubric.map((c, idx) => ({
      ...c,
      maxScore: basePoints + (idx < remainder ? 1 : 0),
    }));
    onChange(rebalanced);
  };

  const generateAiRubric = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: assignmentTitle || 'Core Curriculum Module',
          subject: 'Standard Discipline',
          gradeLevel: 'Advanced',
          assignmentType: 'Comprehensive Assessment',
          learningGoal: assignmentInstructions || 'Mastery of analytical rigor and practical execution',
        }),
      });
      const data = await res.json();
      if (data.rubric && Array.isArray(data.rubric)) {
        onChange(data.rubric);
      }
    } catch (e) {
      console.error('Error generating AI rubric:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-700" />
          <span className="text-xs font-semibold text-slate-900">Rubric Templates:</span>
          <select
            onChange={(e) => applyPreset(e.target.value)}
            defaultValue=""
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select a standardized rubric template...
            </option>
            {RUBRIC_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateAiRubric}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
            <span>{isAiGenerating ? 'Crafting Rubric...' : 'AI Auto-Suggest Rubric'}</span>
          </button>

          <button
            type="button"
            onClick={evenlyDistributePoints}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Balance to {targetMaxPoints} pts</span>
          </button>
        </div>
      </div>

      {/* Points Balance Bar */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
          isBalanced
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            : 'bg-amber-50/70 border-amber-200 text-amber-800'
        }`}
      >
        <div className="flex items-center gap-2">
          {!isBalanced && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
          <span>
            {isBalanced ? (
              <strong className="font-semibold text-emerald-900">
                Rubric balanced! Sum of criteria equals target {targetMaxPoints} points.
              </strong>
            ) : (
              <span>
                Current total criteria sum is <strong>{totalPoints} pts</strong> (target is{' '}
                <strong>{targetMaxPoints} pts</strong>).
              </span>
            )}
          </span>
        </div>
        <span className="font-mono font-bold text-sm">
          {totalPoints} / {targetMaxPoints} pts
        </span>
      </div>

      {/* Criteria List */}
      <div className="space-y-3">
        {rubric.map((criterion, idx) => {
          const isExpanded = !!expandedLevels[criterion.id];

          return (
            <div
              key={criterion.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3 transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-mono font-semibold text-slate-400 w-6">
                    0{idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={criterion.title}
                    onChange={(e) => updateCriterion(criterion.id, { title: e.target.value })}
                    placeholder="Criterion title (e.g. Thesis Formulation, Code Efficiency)"
                    className="flex-1 font-semibold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                    <label className="text-[11px] font-medium text-slate-500">Points:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={criterion.maxScore}
                      onChange={(e) =>
                        updateCriterion(criterion.id, {
                          maxScore: Math.max(1, Number(e.target.value) || 0),
                        })
                      }
                      className="w-12 text-center text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="text-[11px] text-slate-400">pts</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCriterion(criterion.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete criterion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Criterion Description */}
              <div>
                <textarea
                  value={criterion.description}
                  onChange={(e) => updateCriterion(criterion.id, { description: e.target.value })}
                  rows={2}
                  placeholder="Explain what instructors will assess and what students need to demonstrate..."
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:border-indigo-400 focus:outline-none"
                />
              </div>

              {/* Proficiency Level Editors */}
              <div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedLevels((prev) => ({ ...prev, [criterion.id]: !isExpanded }))
                    }
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 cursor-pointer"
                  >
                    <span>
                      {isExpanded ? 'Hide' : 'Configure'} Proficiency Tiers (
                      {criterion.levels?.length || 4} levels)
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100">
                    {(criterion.levels || [
                      { label: 'Exemplary', scoreRange: '90-100%', description: 'Exceeds standard' },
                      { label: 'Proficient', scoreRange: '80-89%', description: 'Meets standard' },
                      { label: 'Developing', scoreRange: '70-79%', description: 'Approaching standard' },
                      { label: 'Beginning', scoreRange: '<70%', description: 'Needs improvement' },
                    ]).map((lvl, lIdx) => (
                      <div key={lIdx} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={lvl.label}
                            onChange={(e) => updateLevel(criterion.id, lIdx, 'label', e.target.value)}
                            className="font-semibold text-slate-800 text-[11px] bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none w-20"
                          />
                          <input
                            type="text"
                            value={lvl.scoreRange}
                            onChange={(e) => updateLevel(criterion.id, lIdx, 'scoreRange', e.target.value)}
                            className="text-[10px] text-slate-500 font-mono text-right bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none w-16"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={lvl.description}
                          onChange={(e) => updateLevel(criterion.id, lIdx, 'description', e.target.value)}
                          placeholder="Tier description..."
                          className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-1.5 focus:border-indigo-400 focus:outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Criterion Button */}
      <button
        type="button"
        onClick={addCriterion}
        className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add Rubric Criterion</span>
      </button>
    </div>
  );
};
