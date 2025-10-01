import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MatchResult as MatchResultComponent } from '@/components/MatchResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';
import { useEvent } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';
import { getPeerAnswers } from '@/api/sessions';
import { match, type MatchResult } from '@/algo/matcher';
import { withEventCode } from '@/lib/session';

const colorLabels: Record<MatchResult['color'], string> = {
  green: 'Strong Match',
  yellow: 'Potential Match',
  red: 'Limited Match',
};

type MatchLocationState = {
  peerToken?: string;
};

const Match = () => {
  const { state } = useLocation() as { state?: MatchLocationState };
  const peerToken = state?.peerToken;
  const navigate = useNavigate();
  const { answers } = useQuiz();
  const { eventCode } = useEvent();
  const { toast } = useToast();

  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!peerToken || !answers || !eventCode) {
      navigate('/');
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const peerAnswers = await getPeerAnswers(peerToken);

        if (!peerAnswers || peerAnswers.eventCode !== eventCode) {
          toast({
            title: 'No match found',
            description: 'We could not retrieve that person. Please scan again.',
            variant: 'destructive',
          });
          navigate('/scan');
          return;
        }

        if (!cancelled) {
          const computed = match(withEventCode(answers, eventCode), peerAnswers);
          setResult(computed);
        }
      } catch (error) {
        console.error('Failed to compute match:', error);
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try scanning again.',
          variant: 'destructive',
        });
        navigate('/scan');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [peerToken, answers, eventCode, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardContent className="pt-6">
          <MatchResultComponent
            color={result.color}
            score={result.pct}
            colorLabel={colorLabels[result.color]}
          />
          <div className="space-y-3 mt-6">
            <Button
              onClick={() => navigate('/scan')}
              className="w-full"
              size="lg"
            >
              Scan Another
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/myqr')}
              className="w-full"
            >
              Back to My Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Match;
