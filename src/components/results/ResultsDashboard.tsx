import { motion } from 'framer-motion';
import { Target, PieChart, TrendingUp, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from './MetricCard';
import { SkillsSection } from './SkillsSection';
import { SemanticMatchView } from './SemanticMatchView';
import { RecruiterInsightPanel } from './RecruiterInsightPanel';
import { AnalysisResult } from '@/store/analysisStore';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const getVariant = (value: number): 'success' | 'warning' | 'error' => {
    if (value >= 75) return 'success';
    if (value >= 50) return 'warning';
    return 'error';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mb-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-muted-foreground mt-1">
            {result.resumeName} → {result.jobTitle}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Analyzed</p>
          <p className="text-sm text-foreground">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              label="Match Score"
              value={result.matchScore}
              icon={Target}
              variant={getVariant(result.matchScore)}
              delay={0}
            />
            <MetricCard
              label="Skill Coverage"
              value={result.skillCoverage}
              icon={PieChart}
              variant={getVariant(result.skillCoverage)}
              delay={100}
            />
            <MetricCard
              label="Shortlist Probability"
              value={result.shortlistProbability}
              icon={TrendingUp}
              variant={getVariant(result.shortlistProbability)}
              delay={200}
            />
            <MetricCard
              label="Risk Flags"
              value={result.riskFlags}
              suffix=""
              icon={AlertTriangle}
              variant={result.riskFlags === 0 ? 'success' : result.riskFlags <= 2 ? 'warning' : 'error'}
              delay={300}
            />
          </div>

          {/* Skills Section */}
          <SkillsSection
            matchedSkills={result.matchedSkills}
            missingSkills={result.missingSkills}
            extraSkills={result.extraSkills}
          />

          {/* Semantic Match */}
          <SemanticMatchView
            resumeText={result.resumeText}
            jobDescription={result.jobDescription}
            matchedSkills={result.matchedSkills}
            missingSkills={result.missingSkills}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <RecruiterInsightPanel
            summary={result.aiSummary}
            recommendation={result.recommendation}
            candidateName={result.resumeName.replace(/\.[^/.]+$/, '')}
            jobTitle={result.jobTitle}
          />
        </div>
      </div>
    </div>
  );
}
