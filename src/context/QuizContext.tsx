import React, { createContext, useReducer, useContext } from 'react';

type Answers = Record<string, string | number>;

interface QuizState {
  answers: Answers;
}

type Action = {
  type: 'SET_ANSWER';
  questionId: string;
  value: string | number;
};

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    default:
      return state;
  }
}

interface QuizContextValue {
  answers: Answers;
  setAnswer: (id: string, value: string | number) => void;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export const QuizProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { answers: {} });
  const setAnswer = (id: string, value: string | number) => {
    dispatch({ type: 'SET_ANSWER', questionId: id, value });
  };
  return (
    <QuizContext.Provider value={{ answers: state.answers, setAnswer }}>
      {children}
    </QuizContext.Provider>
  );
};

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
