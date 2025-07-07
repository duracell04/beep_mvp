import React, { createContext, useState, ReactNode, useContext } from 'react';
import type { UserAnswer, ImportanceLevel } from '../data/types';

interface QuizCtx {
  step: number;
  setStep: (n:number)=>void;
  answers: Record<string, UserAnswer>;
  setAnswerValue: (id:string, val:string|number)=>void;
  setImportance: (id:string, lvl:ImportanceLevel)=>void;
  toggleDealBreaker: (id:string)=>void;
}

const QuizContext = createContext<QuizCtx | undefined>(undefined);

export const QuizProvider:React.FC<{children:ReactNode}> = ({children})=>{
  const [step,setStep] = useState(0);
  const [answers,setAnswers] = useState<Record<string,UserAnswer>>({});

  const setAnswerValue = (id:string,value:string|number)=>{
    setAnswers(p=>({ ...p, [id]:{ ...p[id], value, importance: p[id]?.importance ?? 3 } }));
  };

  const setImportance = (id:string,lvl:ImportanceLevel)=>{
    setAnswers(p=>({ ...p, [id]:{ ...p[id], importance:lvl }}));
  };

  const toggleDealBreaker = (id:string)=>{
    setAnswers(p=>({ ...p, [id]:{ ...p[id], isDealBreaker:!p[id]?.isDealBreaker }}));
  };

  return (
    <QuizContext.Provider value={{step,setStep,answers,setAnswerValue,setImportance,toggleDealBreaker}}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz=()=>{
  const ctx = useContext(QuizContext);
  if(!ctx) throw new Error('useQuiz outside provider');
  return ctx;
};
