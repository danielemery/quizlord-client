import Dexie, { type EntityTable } from 'dexie';

interface UnsubmittedAnswer {
  id: number;
  quizId: string;
  questionNumber: number;
  score: 'CORRECT' | 'INCORRECT' | 'HALF_CORRECT';
  createdAt: Date;
  updatedAt: Date;
}

export const db = new Dexie('QuizlordDatabase') as Dexie & {
  unsubmittedAnswers: EntityTable<UnsubmittedAnswer, 'id'>;
};
db.version(1).stores({
  unsubmittedAnswers: '++id, quizId, questionNumber, score, createdAt, updatedAt',
});

export type { UnsubmittedAnswer };
