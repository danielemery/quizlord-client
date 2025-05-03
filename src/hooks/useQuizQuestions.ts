import { useQuery } from '@apollo/client';
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

import { QUIZ } from '../queries/quiz';
import { db, UnsubmittedAnswer } from '../services/db';
import { Quiz as QuizType } from '../types/quiz';

export function useQuizQuestions(quizId: string) {
  const { loading, data } = useQuery<{
    quiz: QuizType;
  }>(QUIZ, {
    variables: { id: quizId },
  });

  const [unsubmittedAnswers, setUnsubmittedAnswers] = useState<UnsubmittedAnswer[]>([]);

  const handleScoreSelected = async (quizId: string, questionNumber: number, score: UnsubmittedAnswer['score']) => {
    const existingUnsubmitted = await db.unsubmittedAnswers
      .where('quizId')
      .equals(quizId)
      .and((answer) => answer.questionNumber === questionNumber)
      .first();
    if (existingUnsubmitted) {
      db.unsubmittedAnswers.update(existingUnsubmitted.id, {
        score,
        updatedAt: new Date(),
      });
    } else {
      db.unsubmittedAnswers.add({
        quizId,
        questionNumber,
        score,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  const unsubmittedAnswers$ = liveQuery(() => db.unsubmittedAnswers.where('quizId').equals(quizId).toArray()) ?? [];
  useEffect(() => {
    const subscription = unsubmittedAnswers$.subscribe((answers) => {
      setUnsubmittedAnswers(answers);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [unsubmittedAnswers$]);

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
