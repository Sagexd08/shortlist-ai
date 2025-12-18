import { motion } from 'framer-motion';
import { FileText, Brain, GitCompare, Calculator, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisStep } from '@/store/analysisStore';

interface AnalysisProgressProps {
  currentStep: AnalysisStep;
}

const steps = [
  { id: 'parsing', label: 'Parsing Resume', description: 'Extracting text and structure', icon: FileText },
  { id: 'extracting', label: 'Extracting Skills', description: 'Identifying skills and experience', icon: Brain },
  { id: 'matching', label: 'Semantic Matching', description: 'Analyzing job fit', icon: GitCompare },
  { id: 'computing', label: 'Computing Score', description: 'Calculating shortlist probability', icon: Calculator },
];

const stepOrder: AnalysisStep[] = ['parsing', 'extracting', 'matching', 'computing', 'complete'];

export function AnalysisProgress({ currentStep }: AnalysisProgressProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="glass-card p-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center animate-glow-pulse"
        >
          <Brain className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-xl font-semibold text-foreground">Analyzing Resume</h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI is processing your documents
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepIndex = stepOrder.indexOf(step.id as AnalysisStep);
          const isActive = stepIndex === currentIndex;
          const isComplete = stepIndex < currentIndex;
          const isPending = stepIndex > currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "progress-step",
                isActive && "progress-step-active",
                isComplete && "progress-step-complete",
                isPending && "progress-step-pending"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isActive && "bg-primary text-primary-foreground",
                isComplete && "bg-success/20 text-success",
                isPending && "bg-muted text-muted-foreground"
              )}>
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  isActive && "text-primary",
                  isComplete && "text-success",
                  isPending && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>

              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-4 border-t border-border"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Processing with AI-powered semantic analysis</span>
        </div>
      </motion.div>
    </div>
  );
}
