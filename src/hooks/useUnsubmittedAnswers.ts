import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

import { db, UnsubmittedAnswer } from '../services/db';

export function useUnsubmittedAnswers(quizId: string) {
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

  const handleScoresDeleted = async () => {
    db.unsubmittedAnswers.where('quizId').equals(quizId).delete();
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

  const currentTotalScore = unsubmittedAnswers.reduce((total, answer) => {
    switch (answer.score) {
      case 'CORRECT':
        return total + 1;
      case 'INCORRECT':
        return total;
      case 'HALF_CORRECT':
        return total + 0.5;
      default:
        return total;
    }
  }, 0);

  return {
    unsubmittedAnswers,
    handleScoreSelected,
    currentTotalScore,
    handleScoresDeleted,
  };
}
