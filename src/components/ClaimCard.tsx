import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VerdictBadge } from './VerdictBadge';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Source {
  title: string;
  url: string;
  excerpt: string;
}

interface Claim {
  text: string;
  verdict: 'TRUE' | 'FALSE' | 'UNCERTAIN';
  confidence: number;
  explanation: string;
  sources: Source[];
}

interface ClaimCardProps {
  claim: Claim;
  index: number;
}

export const ClaimCard = ({ claim, index }: ClaimCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(
      "p-5 space-y-4 transition-all duration-300 hover:shadow-md",
      "border-l-4",
      claim.verdict === 'TRUE' && "border-l-success",
      claim.verdict === 'FALSE' && "border-l-destructive",
      claim.verdict === 'UNCERTAIN' && "border-l-muted-foreground"
    )}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Claim #{index + 1}
          </span>
          <VerdictBadge verdict={claim.verdict} confidence={claim.confidence} size="sm" />
        </div>

        <p className="text-foreground font-medium leading-relaxed">
          "{claim.text}"
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <span className="text-sm font-medium">
            {isExpanded ? 'Hide details' : 'Show explanation & sources'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Explanation</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {claim.explanation}
            </p>
          </div>

          {claim.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Sources</h4>
              <div className="space-y-2">
                {claim.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-lg border border-border space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-medium text-foreground">
                        {source.title}
                      </h5>
                      {source.url !== 'General Knowledge' && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {source.excerpt && (
                      <p className="text-xs text-muted-foreground italic">
                        "{source.excerpt}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
