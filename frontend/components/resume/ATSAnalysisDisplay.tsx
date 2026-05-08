/**
 * ATS Analysis Display - Transparent Scoring Breakdown
 * Shows exactly WHY and HOW the score was calculated
 */

import React from 'react';
import type { ATSAnalysis } from '@/lib/schemas/ats.schema';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ATSAnalysisDisplayProps {
  analysis: ATSAnalysis;
  onClose?: () => void;
}

export const ATSAnalysisDisplay: React.FC<ATSAnalysisDisplayProps> = ({ analysis, onClose }) => {
  const completeness = analysis.completeness ?? { score: 0, requiredSections: [] };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 90) return '🎯 Excellent';
    if (score >= 75) return '✅ Strong';
    if (score >= 60) return '⚠️ Moderate';
    if (score >= 40) return '🔻 Weak';
    return '❌ Poor';
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-300 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[calc(100vh-2rem)] overflow-hidden flex flex-col min-h-0 p-0 gap-0 bg-gray-800 border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">ATS Compatibility Report</h2>
              <p className="text-sm text-gray-400 mt-1">
                Analyzed: {new Date(analysis.analyzedAt).toLocaleString()} • Version {analysis.analysisVersion}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 text-2xl font-bold p-2 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close report"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Overall Score */}
          <div className="mt-6 flex items-center gap-6">
            <div className="shrink-0 flex flex-col items-center">
              <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore).split(' ')[0]}`}>
                {analysis.overallScore}
              </div>
              <div className="text-sm text-gray-400 text-center mt-1">out of 100</div>
            </div>
            <div className="flex-1">
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold border ${getScoreColor(analysis.overallScore)}`}>
                {getScoreLabel(analysis.overallScore)}
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {analysis.jobMatch.hasJobDescription 
                  ? `${analysis.jobMatch.matchLevel ? analysis.jobMatch.matchLevel.charAt(0).toUpperCase() + analysis.jobMatch.matchLevel.slice(1) : 'Unknown'} match for target role (${analysis.jobMatch.matchPercentage}%)`
                  : 'General ATS optimization score (add job description for targeted analysis)'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="space-y-8 pb-8">
            {/* Score Formula Breakdown */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📊 Score Breakdown <span className="text-sm font-normal text-gray-400">(Transparent Formula)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(analysis.scoreFormula).map(([key, data]) => (
                  <Card key={key} className="p-4 border border-gray-700 bg-gray-900 hover:bg-gray-900/80 transition-colors shadow-sm">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-2 h-8">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{data.score}</div>
                    <div className="flex justify-between items-end text-xs">
                       <span className="text-gray-400">Weight: {(data.weight * 100).toFixed(0)}%</span>
                       <span className="text-blue-300 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                         +{(data.score * data.weight).toFixed(1)}
                       </span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-400 bg-gray-900 p-3 rounded border border-gray-700 italic">
                <strong className="text-gray-200">Formula:</strong> Overall Score = (Keyword Match × 30%) + (Skill Coverage × 25%) + (Experience Alignment × 20%) + (Formatting × 15%) + (AI Quality × 10%)
              </div>
            </section>
            
            {/* Strengths & Weaknesses */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="p-5 border-l-4 border-l-green-500 bg-green-500/10 border border-green-500/20">
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  ✅ Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-200 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {strength}
                    </li>
                  ))}
                  {analysis.strengths.length === 0 && (
                    <li className="text-sm text-gray-400 italic">No specific strengths identified yet. Keep improving!</li>
                  )}
                </ul>
              </Card>
              
              {/* Weaknesses */}
              <Card className="p-5 border-l-4 border-l-red-500 bg-red-500/10 border border-red-500/20">
                <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                  ⚠️ Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-200 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {weakness}
                    </li>
                  ))}
                   {analysis.weaknesses.length === 0 && (
                    <li className="text-sm text-gray-400 italic">Great job! No major weaknesses detected.</li>
                  )}
                </ul>
              </Card>
            </section>
            
            {/* Critical Issues */}
            {analysis.criticalIssues.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                  🚨 Critical Issues <span className="text-sm font-normal text-red-400">(Fix These First)</span>
                </h3>
                <div className="space-y-3">
                  {analysis.criticalIssues.map((issue, idx) => (
                    <Card key={idx} className="p-4 border-l-4 border-red-500 bg-gray-900 hover:bg-gray-900/80 transition-colors shadow-sm">
                      <div className="flex items-start gap-4">
                        <Badge className={`${getPriorityColor(issue.impact)} text-xs px-2 py-1 shrink-0 mt-0.5`}>
                          {issue.impact.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{issue.issue}</div>
                          <div className="text-sm text-gray-200 bg-gray-800 p-2 rounded border border-gray-700">
                            <strong className="text-white">Fix:</strong> {issue.fix}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
            
            {/* Keyword Analysis */}
            {analysis.jobMatch.hasJobDescription && (
              <section>
                <h3 className="text-lg font-bold text-white mb-4">🔑 Keyword Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Missing Keywords */}
                  <Card className="p-5 border border-orange-500/20 bg-orange-500/10">
                    <h4 className="font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      Missing Keywords <span className="text-xs font-normal bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded text-orange-300">Add These</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.jobMatch.topMissingKeywords?.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-900 text-orange-300 border-orange-500/20 hover:bg-gray-900/80">
                          {keyword}
                        </Badge>
                      ))}
                       {(!analysis.jobMatch.topMissingKeywords || analysis.jobMatch.topMissingKeywords.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No major keywords missing!</span>
                      )}
                    </div>
                  </Card>
                  
                  {/* Matched Keywords */}
                  <Card className="p-5 border border-green-500/20 bg-green-500/10">
                    <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
                      Competitive Advantages <span className="text-xs font-normal bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-green-300">Keep These</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.jobMatch.competitiveAdvantage?.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-900 text-green-300 border-green-500/20 hover:bg-gray-900/80">
                          {keyword}
                        </Badge>
                      ))}
                      {(!analysis.jobMatch.competitiveAdvantage || analysis.jobMatch.competitiveAdvantage.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No specific competitive keywords found yet.</span>
                      )}
                    </div>
                  </Card>
                </div>
              </section>
            )}
            
            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-white mb-4">💡 Prioritized Recommendations</h3>
                <div className="space-y-4">
                  {analysis.recommendations
                    .sort((a, b) => {
                      const priority = { critical: 0, high: 1, medium: 2, low: 3 };
                      return priority[a.priority] - priority[b.priority];
                    })
                    .map((rec, idx) => (
                      <Card key={idx} className="p-5 border border-gray-700 bg-gray-900 hover:bg-gray-900/80 transition-colors shadow-sm">
                        <div className="flex items-start gap-4">
                          <Badge className={`${getPriorityColor(rec.priority)} text-xs px-2.5 py-1 shrink-0 mt-1`}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide font-semibold">{rec.category}</div>
                                <div className="font-bold text-white text-lg">{rec.title}</div>
                              </div>
                              <div className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                                {rec.expectedImpact}
                              </div>
                            </div>
                            <div className="text-sm text-gray-200 mb-4 leading-relaxed">{rec.description}</div>
                            {rec.actionSteps.length > 0 && (
                              <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
                                <div className="text-xs font-bold text-gray-200 mb-2 uppercase tracking-wide">Action Steps:</div>
                                <ul className="list-decimal list-inside space-y-1.5 text-sm text-gray-200">
                                  {rec.actionSteps.map((step, stepIdx) => (
                                    <li key={stepIdx} className="pl-1">{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </section>
            )}
            
            {/* Completeness Score */}
            <section>
              <h3 className="text-lg font-bold text-white mb-4">📋 Section Completeness</h3>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-gray-300">Completion Status</span>
                    <span className="text-2xl font-bold text-blue-400">{completeness.score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${completeness.score}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {completeness.requiredSections.map((section, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border flex flex-col gap-2 ${
                        section.present 
                          ? 'bg-gray-800 border-green-500/20' 
                          : 'bg-gray-800 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-semibold text-white">{section.section}</span>
                         <span className={`text-lg leading-none ${section.present ? 'text-green-400' : 'text-red-400'}`}>
                           {section.present ? '✓' : '✗'}
                         </span>
                      </div>
                      <div className={`text-xs font-medium uppercase tracking-wide ${
                        section.quality === 'excellent' ? 'text-green-400' :
                        section.quality === 'good' ? 'text-blue-400' :
                        section.quality === 'needs-improvement' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {section.quality.replace('-', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900 shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 p-1 rounded-full">💡</span>
              Scores above 75 typically pass initial ATS screening
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
              >
                Close Report
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};