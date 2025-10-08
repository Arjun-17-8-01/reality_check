import { Card } from '@/components/ui/card';
import { VerdictBadge } from './VerdictBadge';
import { ClaimCard } from './ClaimCard';
import { Separator } from '@/components/ui/separator';

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

interface AnalysisData {
  overallVerdict: 'TRUE' | 'FALSE' | 'MIXED' | 'UNCERTAIN';
  overallConfidence: number;
  overallSummary: string;
  claims: Claim[];
}

interface AnalysisResultProps {
  data: AnalysisData;
}

export const AnalysisResult = ({ data }: AnalysisResultProps) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <Card className="p-6 space-y-4 bg-gradient-subtle border-border shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Overall Verdict</h2>
            <p className="text-sm text-muted-foreground">Based on analysis of {data.claims.length} claim{data.claims.length !== 1 ? 's' : ''}</p>
          </div>
          <VerdictBadge verdict={data.overallVerdict} confidence={data.overallConfidence} size="lg" />
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.overallSummary}
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Individual Claims</h3>
        <div className="space-y-3">
          {data.claims.map((claim, index) => (
            <ClaimCard key={index} claim={claim} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
