import { CheckCircle2, XCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Verdict = 'TRUE' | 'FALSE' | 'MIXED' | 'UNCERTAIN';

interface VerdictBadgeProps {
  verdict: Verdict;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge = ({ verdict, confidence, size = 'md' }: VerdictBadgeProps) => {
  const getVerdictConfig = (verdict: Verdict) => {
    switch (verdict) {
      case 'TRUE':
        return {
          icon: CheckCircle2,
          label: 'Likely True',
          className: 'bg-success/10 text-success border-success/20',
        };
      case 'FALSE':
        return {
          icon: XCircle,
          label: 'Likely False',
          className: 'bg-destructive/10 text-destructive border-destructive/20',
        };
      case 'MIXED':
        return {
          icon: AlertCircle,
          label: 'Mixed Evidence',
          className: 'bg-warning/10 text-warning border-warning/20',
        };
      case 'UNCERTAIN':
        return {
          icon: HelpCircle,
          label: 'Uncertain',
          className: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  const config = getVerdictConfig(verdict);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full border font-medium',
      config.className,
      sizeClasses[size]
    )}>
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {confidence !== undefined && (
        <span className="opacity-75">({confidence}%)</span>
      )}
    </div>
  );
};
