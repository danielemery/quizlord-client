export interface QuizCompletion {
  completedAt: string;
  completedBy: string[];
  score: number;
}

export type QuizImageType = 'QUESTION' | 'ANSWER' | 'QUESTION_AND_ANSWER';

export interface QuizImage {
  imageLink: string;
  state: string;
  type: QuizImageType;
}

export interface Quiz {
  id: string;
  date: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  completions: QuizCompletion[];
  images: QuizImage[];
}
