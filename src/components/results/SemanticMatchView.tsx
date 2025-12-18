import { motion } from 'framer-motion';
import { FileText, Briefcase } from 'lucide-react';

interface SemanticMatchViewProps {
  resumeText: string;
  jobDescription: string;
  matchedSkills: string[];
  missingSkills: string[];
}

function highlightText(text: string, matchedSkills: string[], missingSkills: string[]) {
  let result = text;

  // Create a regex pattern that matches whole words only
  matchedSkills.forEach(skill => {
    const regex = new RegExp(`\\b(${skill})\\b`, 'gi');
    result = result.replace(regex, '<span class="highlight-strong">$1</span>');
  });

  missingSkills.forEach(skill => {
    const regex = new RegExp(`\\b(${skill})\\b`, 'gi');
    result = result.replace(regex, '<span class="highlight-weak">$1</span>');
  });

  return result;
}

export function SemanticMatchView({ 
  resumeText, 
  jobDescription, 
  matchedSkills,
  missingSkills 
}: SemanticMatchViewProps) {
  const highlightedResume = highlightText(resumeText, matchedSkills, []);
  const highlightedJD = highlightText(jobDescription, matchedSkills, missingSkills);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Semantic Match Analysis</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-success/30" />
            Matched
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-warning/30" />
            Missing
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Panel */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-accent/30">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Resume</span>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <p 
              className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedResume }}
            />
          </div>
        </div>

        {/* Job Description Panel */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-accent/30">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Job Description</span>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <p 
              className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedJD }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
