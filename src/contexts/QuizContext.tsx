'use client';

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
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const saved = localStorage.getItem('beep_quiz_answers');
    setAnswers(saved ? JSON.parse(saved) : null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (answers) {
      localStorage.setItem('beep_quiz_answers', JSON.stringify(answers));
    } else {
      localStorage.removeItem('beep_quiz_answers');
    }
  }, [answers]);

  const getStoredEventCode = () => {
    if (typeof window === 'undefined') {
      return '';
    }
    return localStorage.getItem('beep_event_code') || '';
  };

  const updateLayerA = (questionId: string, value: string) => {
    const eventCode = getStoredEventCode();
    setAnswers(prev => {
      return {
        layerA: { ...(prev?.layerA || {}), [questionId]: value },
        layerB: prev?.layerB || [],
        eventCode,
      };
    });
  };

  const updateLayerB = (answer: LayerBAnswer) => {
    const eventCode = getStoredEventCode();
    setAnswers(prev => {
      if (!prev) {
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
    if (typeof window === 'undefined') {
      return;
    }
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
