import { Briefcase, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Job Description
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoadSample}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Load Sample
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="min-h-[200px] bg-card border-border resize-none focus:ring-primary/20 focus:border-primary/50"
      />

      <p className="text-xs text-muted-foreground">
        {value.length > 0 ? `${value.split(/\s+/).filter(Boolean).length} words` : 'Paste or type the full job description'}
      </p>
    </div>
  );
}
