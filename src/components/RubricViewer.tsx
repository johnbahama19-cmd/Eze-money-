import React, { useState } from 'react';
import { RubricCriterion, RubricScoreItem } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, Award, Sparkles, MessageSquare } from 'lucide-react';

interface RubricViewerProps {
  rubric: RubricCriterion[];
  evaluationScores?: RubricScoreItem[];
  editable?: boolean;
  onScoreChange?: (criterionId: string, newScore: number, teacherNote?: string) => void;
  showProficiencyTiers?: boolean;
}

export const RubricViewer: React.FC<RubricViewerProps> = ({
  rubric,
  evaluationScores,
  editable = false,
  onScoreChange,
  showProficiencyTiers = true,
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

  const toggleTier = (id: string) => {
    setExpandedLevels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getScoreItem = (criterionId: string) => {
    return evaluationScores?.find((s) => s.criterionId === criterionId);
  };

  const totalMaxScore = rubric.reduce((sum, r) => sum + r.maxScore, 0);
  const totalEarnedScore = evaluationScores
    ? evaluationScores.reduce((sum, s) => sum + s.score, 0)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-900">Grading Rubric</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {rubric.length} evaluated criteria · Total points: {totalMaxScore}
          </p>
        </div>

        {totalEarnedScore !== null && (
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rubric Total</div>
            <div className="text-lg font-bold text-slate-900">
              <span className={totalEarnedScore >= totalMaxScore * 0.9 ? 'text-emerald-700' : totalEarnedScore >= totalMaxScore * 0.75 ? 'text-indigo-700' : 'text-amber-700'}>
                {totalEarnedScore}
              </span>
              <span className="text-slate-400 font-normal text-sm"> / {totalMaxScore} pts</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {rubric.map((criterion, idx) => {
          const scoreItem = getScoreItem(criterion.id);
          const isGraded = scoreItem !== undefined;
          const scorePercentage = isGraded && criterion.maxScore > 0 ? (scoreItem.score / criterion.maxScore) * 100 : null;

          return (
            <div
              key={criterion.id}
              className={`rounded-xl border transition-all ${
                isGraded
                  ? 'border-slate-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white'
              } p-4`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-slate-600 w-5">
                      0{idx + 1}.
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">{criterion.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed pl-7">
                    {criterion.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {editable ? (
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        value={scoreItem ? scoreItem.score : 0}
                        onChange={(e) => {
                          const val = Math.min(criterion.maxScore, Math.max(0, Number(e.target.value) || 0));
                          onScoreChange?.(criterion.id, val, scoreItem?.teacherAdjustmentNote);
                        }}
                        className="w-12 text-sm font-bold text-center text-slate-900 bg-white border border-slate-300 rounded px-1 py-0.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="text-xs text-slate-600 font-medium">/ {criterion.maxScore} pts</span>
                    </div>
                  ) : isGraded ? (
                    <div>
                      <span className="text-base font-bold text-slate-900">
                        {scoreItem.score}
                      </span>
                      <span className="text-xs text-slate-600"> / {criterion.maxScore} pts</span>
                      {scorePercentage !== null && (
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden ml-auto">
                          <div
                            className={`h-full rounded-full transition-all ${
                              scorePercentage >= 90
                                ? 'bg-emerald-700'
                                : scorePercentage >= 75
                                ? 'bg-indigo-700'
                                : 'bg-amber-700'
                            }`}
                            style={{ width: `${scorePercentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {criterion.maxScore} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Graded Feedback & Evidence Section */}
              {isGraded && (
                <div className="mt-3 pt-3 border-t border-slate-100 pl-7 space-y-2 text-xs">
                  {scoreItem.feedback && (
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Criterion Feedback</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{scoreItem.feedback}</p>
                    </div>
                  )}

                  {scoreItem.evidenceFound && (
                    <div className="text-slate-600 italic bg-amber-50/70 border border-amber-100/70 rounded-lg p-2.5">
                      <span className="font-semibold text-amber-900 not-italic mr-1.5">Evidence Cited:</span>
                      "{scoreItem.evidenceFound}"
                    </div>
                  )}

                  {editable && (
                    <div className="mt-2">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Instructor Criterion Note (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Add specific instructor remark on this criterion..."
                        defaultValue={scoreItem.teacherAdjustmentNote || ''}
                        onBlur={(e) => {
                          onScoreChange?.(criterion.id, scoreItem.score, e.target.value);
                        }}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Expandable Proficiency Tiers Breakdown */}
              {showProficiencyTiers && criterion.levels && criterion.levels.length > 0 && (
                <div className="mt-3 pl-7">
                  <button
                    type="button"
                    onClick={() => toggleTier(criterion.id)}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>
                      {expandedLevels[criterion.id] ? 'Hide' : 'View'} Proficiency Benchmarks (
                      {criterion.levels.length} tiers)
                    </span>
                    {expandedLevels[criterion.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedLevels[criterion.id] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100">
                      {criterion.levels.map((lvl, lIdx) => (
                        <div
                          key={lIdx}
                          className="bg-white rounded-lg p-2.5 border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px] mb-1">
                            <span>{lvl.label}</span>
                            <span className="text-slate-600 font-mono text-[10px]">{lvl.scoreRange}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {lvl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
