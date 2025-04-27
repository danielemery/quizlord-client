import { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';

export const unsubmittedAnswersCollectionName = 'unsubmittedAnswers' as const;

const unsubmittedAnswersSchema = {
  version: 0,
  primaryKey: 'unsubmittedAnswerId',
  type: 'object',
  properties: {
    unsubmittedAnswerId: {
      type: 'string',
      minLength: 36,
      maxLength: 36,
    },
    quizId: {
      type: 'string',
      minLength: 36,
      maxLength: 36,
    },
    questionNumber: {
      type: 'number',
    },
    score: {
      type: 'string',
      enum: ['CORRECT', 'INCORRECT', 'HALF_CORRECT'],
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['unsubmittedAnswerId', 'quizId', 'questionNumber', 'score', 'createdAt', 'updatedAt'],
} as const;

export type UnsubmittedAnswer = ExtractDocumentTypeFromTypedRxJsonSchema<typeof unsubmittedAnswersSchema>;

export default async function unsubmittedAnswersCollection(db: RxDatabase) {
  await db.addCollections({
    /** In-progress quiz questions */
    [unsubmittedAnswersCollectionName]: {
      schema: unsubmittedAnswersSchema,
    },
  });
}

export function getUpsertUnsubmittedAnswer(db: RxDatabase) {
  return async (quizId: string, questionNumber: number, score: UnsubmittedAnswer['score']) => {
    const collection: RxCollection<UnsubmittedAnswer> = db.collections[unsubmittedAnswersCollectionName];

    const existingAnswer = await collection
      .findOne({
        selector: {
          quizId,
          questionNumber,
        },
      })
      .exec();

    if (existingAnswer) {
      await collection.upsert({
        unsubmittedAnswerId: existingAnswer.get('unsubmittedAnswerId'),
        score,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const unsubmittedAnswerId = uuidv4();
      await collection.insert({
        unsubmittedAnswerId,
        quizId,
        questionNumber,
        score,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };
}
