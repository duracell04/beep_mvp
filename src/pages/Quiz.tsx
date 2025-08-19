import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { layerA } from '../data/layerA';
import { layerB } from '../data/layerB';
import type { Question, ImportanceLevel } from '../data/types';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';
import { Card } from '../components/ui/Card';

const layers = [layerA, layerB];
const totalSteps = layers.length + 1; // + review

export default function Quiz(){
  const nav = useNavigate();
  const {step,setStep,answers,setAnswerValue,setImportance,toggleDealBreaker}=useQuiz();

  const layerComplete = (qs:Question[]) =>
    qs.every(q => {
      const a = answers[q.id];
      return a?.value !== undefined && (step===0 || a.importance!==undefined);
    });

  const isStepComplete = step<layers.length
    ? layerComplete(layers[step])
    : layerA.concat(layerB).every(q=>answers[q.id]?.value!==undefined);

  const next=()=> step<totalSteps-1 ? setStep(step+1) : nav('/myqr');

  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      if(e.key==='ArrowRight' && isStepComplete){
        step<totalSteps-1 ? setStep(step+1) : nav('/myqr');
      }
      if(e.key==='ArrowLeft' && step>0) setStep(step-1);
    };
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[isStepComplete, step, nav, setStep]);

  useEffect(()=>{ window.scrollTo({top:0}); },[step]);

  /** helpers */
  const impLabel=(lvl:ImportanceLevel)=>({1:'Low',3:'Medium',5:'High'}[lvl]);

  /** rendering */
  const renderInput=(q:Question)=>{
    const a=answers[q.id]||{};
    switch(q.type){
      case 'yesno':
        return (
          <div className="flex gap-2">
            {['yes','no'].map(opt => (
              <Button
                key={opt}
                type="button"
                variant={a.value===opt ? 'primary' : 'outline'}
                onClick={()=>setAnswerValue(q.id,opt)}
              >
                {opt.toUpperCase()}
              </Button>
            ))}
          </div>
        );
      case 'slider':
        return (
          <input
            type="range"
            min={1}
            max={5}
            className="w-full accent-brand"
            value={(a.value as number)||3}
            onChange={e=>setAnswerValue(q.id,Number(e.target.value))}
          />
        );
      case 'select':
        return (
          <select
            value={(a.value as string)||''}
            onChange={e=>setAnswerValue(q.id,e.target.value)}
            className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="" disabled>Choose…</option>
            {q.options!.map(o=>(<option key={o}>{o}</option>))}
          </select>
        );
    }
  };

  const QuestionCard=(q:Question,layerIdx:number)=>{
    const a=answers[q.id]||{};
    return(
      <Card key={q.id} className="mb-6">
        <div className="flex justify-between">
          <p className="font-medium">{q.text}</p>
          {layerIdx===0 && q.weight && (
            <span className="text-sm text-brand">★{q.weight}</span>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {renderInput(q)}
          {layerIdx===1 && (
            <>
              <div className="flex gap-2 text-sm">
                {[1,3,5].map(lvl=>(
                  <Button
                    key={lvl}
                    type="button"
                    variant={a.importance===lvl?'primary':'outline'}
                    size="sm"
                    onClick={()=>setImportance(q.id,lvl as ImportanceLevel)}
                    className="flex-1"
                  >
                    {impLabel(lvl as ImportanceLevel)}
                  </Button>
                ))}
              </div>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-slate-300 text-brand focus:ring-brand"
                  checked={a.isDealBreaker||false}
                  onChange={()=>toggleDealBreaker(q.id)}
                />
                Deal-breaker
              </label>
            </>
          )}
        </div>
      </Card>
    );
  };

  return(
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm"><span>Step {Math.min(step+1,totalSteps)}</span><span>{totalSteps}</span></div>
        <Progress value={step} max={totalSteps-1} />
      </div>

      <h1 className="text-2xl font-bold">
        {step===0?'Who I Am':step===1?'What I Want':'Review'}
      </h1>

      {step<layers.length
        ? layers[step].map(q=>QuestionCard(q,step))
        : (
          <Card>
            {layerA.concat(layerB).map(q=>{
              const a=answers[q.id];
              return(
                <div key={q.id} className="border-b py-2 text-sm last:border-none dark:border-slate-700">
                  <p>{q.text}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {a?.value?.toString()}
                    {layerB.find(x=>x.id===q.id) && a?.importance && ` – ${impLabel(a.importance)}`}
                    {a?.isDealBreaker && ' – Deal-breaker'}
                  </p>
                </div>
              );
            })}
          </Card>
        )
      }

      <div className="sticky bottom-0 flex justify-between gap-4 border-t border-slate-200 bg-gray-50/80 py-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <Button variant="outline" disabled={step===0} onClick={()=>setStep(step-1)}>
          Back
        </Button>
        <Button disabled={!isStepComplete} onClick={next}>
          {step<totalSteps-1?'Next':'Submit'}
        </Button>
      </div>
    </div>
  );
}
