import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { QuizAnswers, LayerBAnswer, layerAQuestions, layerBQuestions } from '@/data/questions';

interface QuizContextType {
  answers: QuizAnswers | null;
  updateLayerA: (questionId: string, value: string) => void;
  updateLayerB: (answer: LayerBAnswer) => void;
  clearAnswers: () => void;
  isComplete: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<QuizAnswers | null>(() => {
    const saved = localStorage.getItem('beep_quiz_answers');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (answers) {
      localStorage.setItem('beep_quiz_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const updateLayerA = (questionId: string, value: string) => {
    setAnswers(prev => {
      const eventCode = localStorage.getItem('beep_event_code') || '';
      return {
        layerA: { ...(prev?.layerA || {}), [questionId]: value },
        layerB: prev?.layerB || [],
        eventCode,
      };
    });
  };

  const updateLayerB = (answer: LayerBAnswer) => {
    setAnswers(prev => {
      if (!prev) {
        const eventCode = localStorage.getItem('beep_event_code') || '';
        return {
          layerA: {},
          layerB: [answer],
          eventCode,
        };
      }
      const existingIndex = prev.layerB.findIndex(a => a.questionId === answer.questionId);
      const newLayerB = [...prev.layerB];
      if (existingIndex >= 0) {
        newLayerB[existingIndex] = answer;
      } else {
        newLayerB.push(answer);
      }
      return { ...prev, layerB: newLayerB };
    });
  };

  const clearAnswers = () => {
    localStorage.removeItem('beep_quiz_answers');
    setAnswers(null);
  };

  const isComplete = !!(
    answers &&
    Object.keys(answers.layerA).length === layerAQuestions.length &&
    answers.layerB.length === layerBQuestions.length
  );

  return (
    <QuizContext.Provider value={{ answers, updateLayerA, updateLayerB, clearAnswers, isComplete }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};
