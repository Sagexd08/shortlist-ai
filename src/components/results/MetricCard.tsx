import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'error' | 'neutral';
  delay?: number;
}

export function MetricCard({ label, value, suffix = '%', icon: Icon, variant, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const variantStyles = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
      icon: 'bg-success/20 text-success',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      text: 'text-warning',
      icon: 'bg-warning/20 text-warning',
    },
    error: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      text: 'text-destructive',
      icon: 'bg-destructive/20 text-destructive',
    },
    neutral: {
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      icon: 'bg-primary/20 text-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.4 }}
      className={cn(
        "glass-card p-5 hover-glow border",
        styles.border
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className={cn("metric-value", styles.text)}>
            {displayValue}
          </span>
          <span className="text-lg text-muted-foreground">{suffix}</span>
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay / 1000 + 0.2, duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", 
            variant === 'success' && "bg-success",
            variant === 'warning' && "bg-warning",
            variant === 'error' && "bg-destructive",
            variant === 'neutral' && "bg-primary"
          )}
        />
      </div>
    </motion.div>
  );
}
