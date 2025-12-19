import { motion } from 'framer-motion';
import { Brain, ThumbsUp, AlertTriangle, ThumbsDown, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecruiterInsightPanelProps {
  summary: string;
  recommendation: 'strong_fit' | 'consider' | 'weak_fit';
  candidateName?: string;
  jobTitle?: string;
  onExport: () => void;
  onShare: () => void;
}

const recommendationConfig = {
  strong_fit: {
    label: 'Strong Fit',
    icon: ThumbsUp,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  consider: {
    label: 'Consider',
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  weak_fit: {
    label: 'Weak Fit',
    icon: ThumbsDown,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
  },
};

export function RecruiterInsightPanel({
  summary,
  recommendation,
  candidateName = 'Candidate',
  jobTitle = 'Position',
  onExport,
  onShare
}: RecruiterInsightPanelProps) {
  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card h-fit sticky top-6"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Recruiter Insight</h3>
            <p className="text-xs text-muted-foreground">Powered by semantic analysis</p>
          </div>
        </div>
      </div>

      {/* Recommendation Badge */}
      <div className="p-4 border-b border-border">
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-lg border",
          config.bg,
          config.border
        )}>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            config.bg
          )}>
            <Icon className={cn("w-6 h-6", config.color)} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Recommendation</p>
            <p className={cn("text-lg font-semibold", config.color)}>{config.label}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 border-b border-border">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Analysis Summary
        </h4>
        <p className="text-sm text-foreground leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <Button onClick={onExport} className="w-full justify-center gap-2" variant="default">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
        <Button onClick={onShare} className="w-full justify-center gap-2" variant="outline">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </div>
    </motion.div>
  );
}
