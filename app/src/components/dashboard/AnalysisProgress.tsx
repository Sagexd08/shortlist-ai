import { motion } from 'framer-motion';
import { FileText, Brain, GitCompare, Calculator, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
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
    <div className="glass-card p-8 max-w-xl mx-auto relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />

      <div className="text-center mb-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]"
        >
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
        </motion.div>
        <h2 className="text-xl font-semibold text-white">Analyzing Resume</h2>
        <p className="text-sm text-zinc-400 mt-1">
          AI is processing your documents
        </p>
      </div>

      <div className="space-y-3 relative z-10">
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
                "relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                isActive && "bg-indigo-500/10 border border-indigo-500/20",
                isComplete && "bg-green-500/5 border border-green-500/10",
                isPending && "bg-zinc-900/30 border border-white/5 opacity-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-lg",
                isActive && "bg-indigo-500 text-white",
                isComplete && "bg-green-500/20 text-green-400",
                isPending && "bg-zinc-800 text-zinc-500"
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
                  isActive && "text-indigo-400",
                  isComplete && "text-green-400",
                  isPending && "text-zinc-500"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {step.description}
                </p>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-xl bg-indigo-500/5 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Progress Line for Active Step */}
              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-indigo-500/50"
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
        className="mt-6 pt-4 border-t border-white/10"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Processing with AI-powered semantic analysis</span>
        </div>
      </motion.div>
    </div>
  );
}
