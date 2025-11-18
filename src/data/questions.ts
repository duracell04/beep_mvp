import { rapidFireQuestions } from './rapidFireQuestions';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  layer: 'A' | 'B';
  weight?: number;
  options: QuestionOption[];
}

export const layerAQuestions: Question[] = rapidFireQuestions
  .filter((question) => question.layer === 'A')
  .map((question) => ({
    id: question.id,
    text: question.question,
    layer: 'A',
    weight: question.weight ?? 1,
    options: question.options.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  }));

export const layerBQuestions: Question[] = rapidFireQuestions
  .filter((question) => question.layer === 'B')
  .map((question) => ({
    id: question.id,
    text: question.question,
    layer: 'B',
    options: question.options.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  }));

export type ImportanceLevel = 'low' | 'medium' | 'high';

export interface LayerBAnswer {
  questionId: string;
  value: string;
  importance: ImportanceLevel;
  dealBreaker: boolean;
}

export interface QuizAnswers {
  layerA: Record<string, string>;
  layerB: LayerBAnswer[];
  eventCode: string;
}
