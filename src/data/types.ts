export type QuestionType = 'yesno' | 'slider' | 'select';
export type ImportanceLevel = 1 | 3 | 5;          // Low | Med | High

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  weight?: number;           // fixed weight (Layer A)
  dealBreaker?: boolean;     // fixed deal-breaker (Layer A)
  options?: string[];
}

export interface UserAnswer {
  value: string | number;
  importance?: ImportanceLevel; // user weight for Layer B
  isDealBreaker?: boolean;      // user toggle for Layer B
}
