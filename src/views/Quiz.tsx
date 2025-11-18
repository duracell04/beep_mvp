'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { rapidFireQuestions } from '@/data/rapidFireQuestions';
import { ImportanceLevel } from '@/data/questions';
import { useQuiz } from '@/contexts/QuizContext';
import { useEvent } from '@/contexts/EventContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type PreferenceState = Record<
  string,
  {
    value?: string;
    importance: ImportanceLevel;
    dealBreaker: boolean;
  }
>;

const totalQuestions = rapidFireQuestions.length;
const DEFAULT_IMPORTANCE: ImportanceLevel = 'medium';

const Quiz = () => {
  const { eventCode } = useEvent();
  const { answers, updateLayerA, updateLayerB } = useQuiz();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [layerAState, setLayerAState] = useState<Record<string, string>>(answers?.layerA ?? {});
  const [layerBState, setLayerBState] = useState<PreferenceState>(() => {
    const pref: PreferenceState = {};
    answers?.layerB.forEach((answer) => {
      pref[answer.questionId] = {
        value: answer.value,
        importance: answer.importance,
        dealBreaker: answer.dealBreaker,
      };
    });
    return pref;
  });

  useEffect(() => {
    if (!eventCode) {
      router.replace('/onboarding');
    }
  }, [eventCode, router]);

  if (!eventCode) {
    return null;
  }

  const answeredCount = useMemo(() => {
    return rapidFireQuestions.reduce((count, question) => {
      if (question.layer === 'A') {
        return layerAState[question.id] ? count + 1 : count;
      }
      return layerBState[question.id]?.value ? count + 1 : count;
    }, 0);
  }, [layerAState, layerBState]);

  const stack = rapidFireQuestions.slice(step, step + 3);
  const activeQuestion = rapidFireQuestions[step];

  const recordLayerB = (questionId: string, update: Partial<PreferenceState[string]>) => {
    setLayerBState((prev) => {
      const next = {
        ...prev,
        [questionId]: {
          value: prev[questionId]?.value,
          importance: prev[questionId]?.importance ?? DEFAULT_IMPORTANCE,
          dealBreaker: prev[questionId]?.dealBreaker ?? false,
          ...update,
        },
      };

      const entry = next[questionId];
      if (entry.value) {
        updateLayerB({
          questionId,
          value: entry.value,
          importance: entry.importance,
          dealBreaker: entry.dealBreaker,
        });
      }
      return next;
    });
  };

  const handleSelect = (questionId: string, layer: 'A' | 'B', value: string) => {
    if (layer === 'A') {
      setLayerAState((prev) => {
        const updated = { ...prev, [questionId]: value };
        updateLayerA(questionId, value);
        return updated;
      });
    } else {
      recordLayerB(questionId, { value });
    }

    const isLast = step === totalQuestions - 1;
    setTimeout(() => {
      if (isLast) {
        router.push('/myqr');
      } else {
        setStep((prev) => Math.min(totalQuestions - 1, prev + 1));
      }
    }, 300);
  };

  const handleImportanceChange = (questionId: string, level: ImportanceLevel) => {
    recordLayerB(questionId, { importance: level });
  };

  const handleToggleDealBreaker = (questionId: string) => {
    recordLayerB(questionId, {
      dealBreaker: !layerBState[questionId]?.dealBreaker,
    });
  };

  const goBack = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (!activeQuestion) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-900 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Rapid fire setup</p>
        <h1 className="mt-3 text-3xl font-semibold">10 corporate-ready questions</h1>
        <p className="mt-2 text-sm text-white/80">
          Prove onboarding adapts to offsites, SKOs, and internal summits.
        </p>
        <div className="mt-5 space-y-2">
          <Progress value={(answeredCount / totalQuestions) * 100} className="bg-white/30" />
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
            <span>Q{Math.min(step + 1, totalQuestions)}</span>
            <span>
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-1 text-xs text-white/70 sm:grid-cols-2">
          <p>Q1 Department? (Sales / Tech / HR / CS)</p>
          <p>Q2 Office superpower? (Excel wizard / Coffee brewer / Bug fixer)</p>
        </div>
      </section>

      <div className="relative h-[520px]">
        {stack.map((question, idx) => {
          const offset = idx;
          const positionClass =
            offset === 0
              ? 'z-30 translate-y-0 scale-100'
              : offset === 1
              ? 'z-20 translate-y-5 scale-[0.96] -rotate-2 opacity-90'
              : 'z-10 translate-y-10 scale-90 rotate-2 opacity-70';
          const isActive = offset === 0;
          const selectedValue =
            question.layer === 'A'
              ? layerAState[question.id]
              : layerBState[question.id]?.value;

          return (
            <div
              key={question.id}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 flex h-full flex-col justify-between rounded-[32px] bg-white p-6 shadow-2xl transition-all duration-500',
                positionClass,
                !isActive && 'pointer-events-none select-none blur-[1px]',
              )}
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit uppercase tracking-[0.4em]">
                  {question.badge}
                </Badge>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.6em] text-muted-foreground">
                    Card {step + 1} of {totalQuestions}
                  </p>
                  <h2 className="text-3xl font-semibold text-foreground">{question.question}</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {question.options.map((option) => {
                  const selected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => isActive && handleSelect(question.id, question.layer, option.value)}
                      className={cn(
                        'w-full rounded-2xl border-2 p-4 text-left transition-all duration-200',
                        selected
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                          : 'border-muted hover:-translate-y-0.5 hover:border-emerald-200',
                      )}
                    >
                      <p className="text-lg font-semibold text-foreground">{option.label}</p>
                      {option.note && (
                        <p className="text-sm text-muted-foreground">{option.note}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {question.layer === 'B' && (
                <div className="mt-4 rounded-2xl border border-dashed border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Customize the match
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(['low', 'medium', 'high'] as ImportanceLevel[]).map((level) => (
                      <Button
                        key={level}
                        type="button"
                        size="sm"
                        variant={layerBState[question.id]?.importance === level ? 'default' : 'outline'}
                        onClick={() => handleImportanceChange(question.id, level)}
                        className="flex-1 capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant={layerBState[question.id]?.dealBreaker ? 'destructive' : 'ghost'}
                    type="button"
                    onClick={() => handleToggleDealBreaker(question.id)}
                    className="mt-3 w-full text-sm uppercase tracking-[0.4em]"
                  >
                    Deal-breaker
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

  <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="font-semibold uppercase tracking-[0.3em] disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push('/myqr')}
          className="font-semibold uppercase tracking-[0.3em] text-emerald-600"
        >
          Jump to live badge
        </button>
      </div>
    </div>
  );
};

export default Quiz;
