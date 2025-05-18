import { useQuery } from '@apollo/client';

import { QUIZ } from '../queries/quiz';
import { UnsubmittedAnswer } from '../services/db';
import { Quiz as QuizType } from '../types/quiz';
import { useUnsubmittedAnswers } from './useUnsubmittedAnswers';

export function useQuizQuestions(quizId: string) {
  const { loading, data } = useQuery<{
    quiz: QuizType;
  }>(QUIZ, {
    variables: { id: quizId },
  });
  const { handleScoreSelected, unsubmittedAnswers } = useUnsubmittedAnswers(quizId);
  const questions = data?.quiz?.questions ? mergeData(data.quiz.questions, unsubmittedAnswers) : undefined;

  return {
    questions,
    loading,
    handleScoreSelected,
  };
}

export interface LocalQuestion {
  questionNum: number;
  question: string;
  answer: string;
  unsubmittedScore?: UnsubmittedAnswer['score'];
}

function mergeData(
  questions: QuizType['questions'],
  unsubmittedAnswers: UnsubmittedAnswer[],
): Map<number, LocalQuestion> {
  const questionMap = new Map<number, LocalQuestion>();

  questions.forEach((question) => {
    questionMap.set(question.questionNum, {
      questionNum: question.questionNum,
      question: question.question,
      answer: question.answer,
    });
  });

  unsubmittedAnswers.forEach((answer) => {
    const existingQuestion = questionMap.get(answer.questionNumber);
    if (existingQuestion) {
      existingQuestion.unsubmittedScore = answer.score;
    }
  });

  return questionMap;
}
