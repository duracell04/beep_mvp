import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../context/QuizContext';
import layerA from '../data/layerA';
import layerB from '../data/layerB';

function QuestionList({ questions }: { questions: any[] }) {
  const { answers, setAnswer } = useQuiz();

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q) => (
        <div key={q.id} className="flex flex-col gap-2">
          <label className="font-semibold">{q.text}</label>
          {q.type === 'radio' && (
            <div className="flex gap-2">
              {q.options.map((o: string) => (
                <label key={o} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={q.id}
                    value={o}
                    checked={answers[q.id] === o}
                    onChange={() => setAnswer(q.id, o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          )}
          {q.type === 'slider' && (
            <input
              type="range"
              min={q.min}
              max={q.max}
              value={answers[q.id] ?? q.min}
              onChange={(e) => setAnswer(q.id, Number(e.target.value))}
            />
          )}
          {q.type === 'select' && (
            <select
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            >
              <option value="" disabled>
                Select...
              </option>
              {q.options.map((o: string) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

function QuizInner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { answers } = useQuiz();
  const layers = [layerA, layerB];
  const questions = step < 2 ? layers[step] : [...layerA, ...layerB];

  const allAnswered =
    step < 2 && questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  const handleNext = () => setStep((s) => s + 1);
  const handleSubmit = () => navigate('/myqr');

  return (
    <div className="p-4 flex flex-col gap-4">
      {step < 2 ? (
        <QuestionList questions={questions} />
      ) : (
        <div className="flex flex-col gap-2">
          {questions.map((q) => (
            <div key={q.id} className="border p-2">
              <span className="font-semibold mr-2">{q.text}:</span>
              <span>{String(answers[q.id])}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        {step < 2 && (
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        )}
        {step === 2 && (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default function Quiz() {
  return (
    <QuizProvider>
      <QuizInner />
    </QuizProvider>
  );
}
