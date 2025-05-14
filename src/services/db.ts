import Dexie, { type EntityTable } from 'dexie';

interface UnsubmittedAnswer {
  id: number;
  quizId: string;
  questionNumber: number;
  score: 'CORRECT' | 'INCORRECT' | 'HALF_CORRECT';
  createdAt: Date;
  updatedAt: Date;
}

interface Setting {
  name: string;
  value: string;
}

export const db = new Dexie('QuizlordDatabase') as Dexie & {
  unsubmittedAnswers: EntityTable<UnsubmittedAnswer, 'id'>;
  settings: EntityTable<Setting, 'name'>;
};
db.version(1).stores({
  unsubmittedAnswers: '++id, quizId, questionNumber, score, createdAt, updatedAt',
  settings: 'name, value',
});

export type { UnsubmittedAnswer, Setting };
