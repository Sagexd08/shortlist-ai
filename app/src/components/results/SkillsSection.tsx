import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
}

interface SkillCategoryProps {
  title: string;
  skills: string[];
  variant: 'matched' | 'missing' | 'extra';
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

function SkillCategory({ title, skills, variant, icon, defaultOpen = false }: SkillCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const tagClass = {
    matched: 'skill-matched',
    missing: 'skill-missing',
    extra: 'skill-extra',
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-sm text-muted-foreground">({skills.length})</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn("skill-tag", tagClass[variant])}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SkillsSection({ matchedSkills, missingSkills, extraSkills }: SkillsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-foreground">Skill Intelligence</h3>
      
      <div className="space-y-3">
        <SkillCategory
          title="Matched Skills"
          skills={matchedSkills}
          variant="matched"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          defaultOpen={true}
        />
        
        <SkillCategory
          title="Missing Skills"
          skills={missingSkills}
          variant="missing"
          icon={<XCircle className="w-5 h-5 text-destructive" />}
        />
        
        <SkillCategory
          title="Additional Skills"
          skills={extraSkills}
          variant="extra"
          icon={<Sparkles className="w-5 h-5 text-primary" />}
        />
      </div>
    </motion.div>
  );
}
