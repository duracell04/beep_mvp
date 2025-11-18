import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import { useQuiz } from '../contexts/QuizContext';
import { rapidFireQuestions } from '../data/rapidFireQuestions';
import { cn } from '../lib/utils';

const totalQuestions = rapidFireQuestions.length;

export default function Quiz() {
  const navigate = useNavigate();
  const { step, setStep, answers, setAnswerValue } = useQuiz();
  const safeStep = Math.min(step, totalQuestions - 1);
  const activeQuestion = rapidFireQuestions[safeStep];

  const answeredCount = useMemo(
    () =>
      rapidFireQuestions.reduce((count, q) => {
        const value = answers[q.id]?.value;
        return value === undefined || value === '' ? count : count + 1;
      }, 0),
    [answers]
  );

  const stack = rapidFireQuestions.slice(safeStep, safeStep + 3);

  const handleSelect = (value: string) => {
    if (!activeQuestion) return;
    setAnswerValue(activeQuestion.id, value);
    if (safeStep === totalQuestions - 1) {
      setTimeout(() => navigate('/myqr'), 450);
    } else {
      setTimeout(() => setStep(safeStep + 1), 300);
    }
  };

  const goBack = () => {
    if (safeStep === 0) return;
    setStep(safeStep - 1);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-900 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">
          Rapid fire setup
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          10 corporate-ready questions
        </h1>
        <p className="mt-2 text-sm text-white/80">
          Built to prove onboarding is configurable for offsites, SKOs, and summits.
        </p>
        <div className="mt-5 space-y-2">
          <Progress value={answeredCount} max={totalQuestions} className="bg-white/30" />
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
            <span>Q{Math.min(safeStep + 1, totalQuestions)}</span>
            <span>{answeredCount}/{totalQuestions} answered</span>
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

          return (
            <div
              key={question.id}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 flex h-full flex-col justify-between rounded-[32px] bg-white p-6 shadow-2xl transition-all duration-500',
                positionClass,
                !isActive && 'pointer-events-none select-none blur-[1px]'
              )}
            >
              <div className="space-y-4">
                <Badge className="w-fit bg-slate-100 text-slate-700">{question.badge}</Badge>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.6em] text-slate-400">
                    Card {safeStep + 1} of {totalQuestions}
                  </p>
                  <h2 className="text-3xl font-semibold text-slate-900">{question.question}</h2>
                  {question.description && (
                    <p className="text-base text-slate-500">{question.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {question.options.map((option) => {
                  const selected = answers[question.id]?.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => isActive && handleSelect(option.value)}
                      className={cn(
                        'w-full rounded-2xl border-2 p-4 text-left transition-all duration-200',
                        selected
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                          : 'border-slate-200 hover:-translate-y-0.5 hover:border-emerald-200'
                      )}
                    >
                      <p className="text-lg font-semibold text-slate-900">{option.label}</p>
                      {option.note && (
                        <p className="text-sm text-slate-500">{option.note}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={safeStep === 0}
          className="font-semibold uppercase tracking-[0.3em] disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/myqr')}
          className="font-semibold uppercase tracking-[0.3em] text-emerald-600"
        >
          Jump to live badge
        </button>
      </div>
    </div>
  );
}
