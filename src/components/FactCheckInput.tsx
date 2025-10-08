import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FactCheckInputProps {
  onAnalyze: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const FactCheckInput = ({ onAnalyze, isLoading }: FactCheckInputProps) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (inputText.trim().length < 20) {
      toast.error('Please enter at least 20 characters for meaningful analysis');
      return;
    }

    await onAnalyze(inputText.trim());
  };

  return (
    <Card className="p-6 space-y-4 bg-card border-border shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fact-input" className="text-sm font-medium text-foreground">
            Enter text or paste an article to fact-check
          </label>
          <Textarea
            id="fact-input"
            placeholder="Paste news article text, claims, or statements here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-y bg-background border-border focus:ring-primary"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {inputText.length} characters
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || !inputText.trim()}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing claims...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Fact Check This
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
