import { User } from './user';

export interface QuizCompletion {
  completedAt: string;
  completedBy: User[];
  score: number;
}

export type QuizImageType = 'QUESTION' | 'ANSWER' | 'QUESTION_AND_ANSWER';

export interface QuizImage {
  imageLink: string;
  state: string;
  type: QuizImageType;
}

export interface QuizQuestion {
  questionNum: number;
  question: string;
  answer: string;
}

export type QuizAIProcessingState = 'NOT_QUEUED' | 'QUEUED' | 'COMPLETED' | 'ERRORED';

export interface Quiz {
  id: string;
  date: string;
  type: string;
  uploadedBy: User;
  uploadedAt: string;
  completions: QuizCompletion[];
  images: QuizImage[];
  questions: QuizQuestion[];
  aiProcessingState: QuizAIProcessingState;
}
