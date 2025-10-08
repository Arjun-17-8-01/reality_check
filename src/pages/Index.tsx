import { useState } from 'react';
import { FactCheckInput } from '@/components/FactCheckInput';
import { AnalysisResult } from '@/components/AnalysisResult';
import { ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisData {
  overallVerdict: 'TRUE' | 'FALSE' | 'MIXED' | 'UNCERTAIN';
  overallConfidence: number;
  overallSummary: string;
  claims: Array<{
    text: string;
    verdict: 'TRUE' | 'FALSE' | 'UNCERTAIN';
    confidence: number;
    explanation: string;
    sources: Array<{
      title: string;
      url: string;
      excerpt: string;
    }>;
  }>;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setAnalysisData(null);

    try {
      const { data, error } = await supabase.functions.invoke('fact-check', {
        body: { text },
      });

      if (error) {
        console.error('Error calling fact-check function:', error);
        toast.error(error.message || 'Failed to analyze content. Please try again.');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalysisData(data as AnalysisData);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast.error('Failed to analyze content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-lg">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12" />
            <h1 className="text-3xl md:text-5xl font-bold">Reality Check</h1>
          </div>
          <p className="text-center text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            AI-Powered Fact Checker — Verify claims, analyze evidence, and discover the truth
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-8">
          <FactCheckInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          {analysisData && <AnalysisResult data={analysisData} />}
          
          {!analysisData && !isLoading && (
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">How it works</h3>
              <div className="max-w-2xl mx-auto space-y-3 text-sm text-muted-foreground">
                <p>1. Paste news articles, claims, or statements into the text box above</p>
                <p>2. Our AI analyzes the content and extracts individual claims</p>
                <p>3. Each claim is fact-checked and assigned a truthfulness rating</p>
                <p>4. View detailed explanations and source citations for each claim</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Powered by AI • Built for transparency and truth
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
