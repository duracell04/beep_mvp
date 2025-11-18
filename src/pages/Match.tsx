'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQuiz } from '@/contexts/QuizContext';
import { useEvent } from '@/contexts/EventContext';
import { useToast } from '@/hooks/use-toast';
import { match, type MatchResult as AlgoMatchResult } from '@/algo/matcher';
import { getPeerAnswers } from '@/api/sessions';
import { withEventCode } from '@/lib/session';
import MatchResult from '@/components/MatchResult';
import type { QuizAnswers } from '@/data/questions';
import { rapidFireQuestions, describeSharedAnswer } from '@/data/rapidFireQuestions';

const defaultInsight = {
  topic: 'Shared curiosity',
  sparkLine: 'You both just unlocked Active Mode to meet someone new.',
  promptLine: 'Ask them: What would make this summit a breakout success?',
};

const questionMeta = new Map(rapidFireQuestions.map((question) => [question.id, question]));

const buildConversationInsight = (me?: QuizAnswers | null, peer?: QuizAnswers | null) => {
  if (!me || !peer) {
    return defaultInsight;
  }

  for (const [questionId, value] of Object.entries(me.layerA)) {
    if (value && peer.layerA[questionId] === value) {
      const label =
        questionMeta.get(questionId)?.options.find((option) => option.value === value)?.label ??
        value;
      return describeSharedAnswer(questionId, label);
    }
  }

  const peerPreferences = new Map(peer.layerB.map((answer) => [answer.questionId, answer.value]));
  for (const answer of me.layerB) {
    const peerValue = peerPreferences.get(answer.questionId);
    if (answer.value && peerValue === answer.value) {
      const label =
        questionMeta
          .get(answer.questionId)
          ?.options.find((option) => option.value === answer.value)?.label ?? answer.value;
      return describeSharedAnswer(answer.questionId, label);
    }
  }

  return defaultInsight;
};

const Match = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const peerToken = searchParams.get('peer');
  const { answers } = useQuiz();
  const { eventCode } = useEvent();
  const { toast } = useToast();
  const [result, setResult] = useState<AlgoMatchResult | null>(null);
  const [insight, setInsight] = useState(defaultInsight);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!peerToken || !answers || !eventCode) {
      router.replace('/scan');
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
          router.replace('/scan');
          return;
        }

        const computed = match(withEventCode(answers, eventCode), peerAnswers);
        const story = buildConversationInsight(answers, peerAnswers);

        if (!cancelled) {
          setResult(computed);
          setInsight(story);
        }
      } catch (error) {
        console.error('Failed to compute match:', error);
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try scanning again.',
          variant: 'destructive',
        });
        router.replace('/scan');
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
  }, [peerToken, answers, eventCode, router, toast]);

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
      <MatchResult
        color={result.color}
        score={result.score}
        topic={insight.topic}
        sparkLine={insight.sparkLine}
        promptLine={insight.promptLine}
      />
    </div>
  );
};

export default Match;
