import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { layerA } from '../data/layerA';
import { layerB } from '../data/layerB';
import type { Question, ImportanceLevel } from '../data/types';

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

  /** helpers */
  const impLabel=(lvl:ImportanceLevel)=>({1:'Low',3:'Medium',5:'High'}[lvl]);

  /** rendering */
  const renderInput=(q:Question)=>{
    const a=answers[q.id]||{};
    switch(q.type){
      case 'yesno':
        return ['yes','no'].map(opt=>(
          <label key={opt} className="mr-4">
            <input type="radio" name={q.id} value={opt}
              checked={a.value===opt}
              onChange={()=>setAnswerValue(q.id,opt)} /> {opt}
          </label>
        ));
      case 'slider':
        return (
          <input type="range" min={1} max={5} className="w-full"
            value={(a.value as number)||3}
            onChange={e=>setAnswerValue(q.id,Number(e.target.value))}/>
        );
      case 'select':
        return (
          <select value={(a.value as string)||''} onChange={e=>setAnswerValue(q.id,e.target.value)}
            className="border p-2 rounded w-full">
            <option value="" disabled>Choose…</option>
            {q.options!.map(o=><option key={o}>{o}</option>)}
          </select>
        );
    }
  };

  const QuestionCard=(q:Question,layerIdx:number)=>{
    const a=answers[q.id]||{};
    return(
      <div key={q.id} className="bg-white shadow p-4 rounded mb-6">
        <div className="flex justify-between">
          <p className="font-medium">{q.text}</p>
          {layerIdx===0 && q.weight && (
            <span className="text-sm text-blue-600">★{q.weight}</span>
          )}
        </div>
        <div className="mt-2">{renderInput(q)}</div>

        {layerIdx===1 && (
          <>
            {/* importance selector */}
            <div className="mt-4 flex gap-2 text-sm">
              {[1,3,5].map(lvl=>(
                <button key={lvl} onClick={()=>setImportance(q.id,lvl as ImportanceLevel)}
                  className={`flex-1 py-1 rounded ${a.importance===lvl?'bg-blue-600 text-white':'bg-gray-100'}`}>
                  {impLabel(lvl as ImportanceLevel)}
                </button>
              ))}
            </div>
            {/* deal-breaker toggle */}
            <label className="mt-2 flex items-center text-sm">
              <input type="checkbox" className="mr-2"
                checked={a.isDealBreaker||false}
                onChange={()=>toggleDealBreaker(q.id)}/>
              Deal-breaker
            </label>
          </>
        )}
      </div>
    );
  };

  return(
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {step===0?'Who I Am':step===1?'What I Want':'Review'}
      </h1>

      {step<layers.length
        ? layers[step].map(q=>QuestionCard(q,step))
        : (
          <div className="bg-white p-4 rounded shadow">
            {layerA.concat(layerB).map(q=>{
              const a=answers[q.id];
              return(
                <div key={q.id} className="border-b py-2 text-sm">
                  <p>{q.text}</p>
                  <p className="text-gray-600">
                    {a?.value?.toString()} 
                    {layerB.find(x=>x.id===q.id) && a?.importance && ` – ${impLabel(a.importance)}`}
                    {a?.isDealBreaker && ' – Deal-breaker'}
                  </p>
                </div>
              );
            })}
          </div>
        )
      }

      <div className="flex justify-between mt-6">
        <button disabled={step===0} onClick={()=>setStep(step-1)}
          className={`px-4 py-2 rounded ${step===0?'bg-gray-300':'bg-gray-100 hover:bg-gray-200'}`}>
          Back
        </button>
        <button disabled={!isStepComplete} onClick={next}
          className={`px-4 py-2 rounded text-white ${isStepComplete?'bg-blue-600 hover:bg-blue-700':'bg-blue-300'}`}>
          {step<totalSteps-1?'Next':'Submit'}
        </button>
      </div>
    </div>
  );
}
