import { Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const sampleJD = `Senior Software Engineer

We are looking for a Senior Software Engineer to join our growing team. You will be responsible for building and maintaining scalable web applications.

Requirements:
• 5+ years of experience in software development
• Strong proficiency in React, TypeScript, and Node.js
• Experience with cloud services (AWS, GCP, or Azure)
• Knowledge of database systems (PostgreSQL, MongoDB)
• Experience with CI/CD pipelines and DevOps practices
• Strong problem-solving and communication skills

Nice to have:
• Experience with microservices architecture
• Knowledge of machine learning concepts
• Leadership experience`;

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const handleLoadSample = () => {
    onChange(sampleJD);
  };

  const wordCount = value.split(/\s+/).filter(Boolean).length;
  const isTooShort = value.length > 0 && value.length < 50;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/20">
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          Job Description
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoadSample}
          className="text-xs text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Load Sample
        </Button>
      </div>

      <div className="relative flex-1 group">
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the job description here (e.g., Requirements, Roles, Tech Stack)..."
          className="w-full h-full min-h-[200px] bg-zinc-900/50 border-white/10 hover:border-white/20 focus:border-purple-500/50 focus:ring-0 rounded-xl resize-none text-zinc-200 placeholder:text-zinc-600 transition-all font-mono text-sm leading-relaxed p-4"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full border bg-black/50 backdrop-blur-sm transition-colors",
            isTooShort ? "text-yellow-500 border-yellow-500/30" : "text-zinc-500 border-zinc-800"
          )}>
            {wordCount} words
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isTooShort && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-yellow-500"
          >
            <AlertCircle className="w-3 h-3" />
            Description is too short for accurate analysis (aim for &gt;50 chars)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
