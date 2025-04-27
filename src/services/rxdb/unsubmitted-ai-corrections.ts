import { ExtractDocumentTypeFromTypedRxJsonSchema, RxDatabase } from 'rxdb';

export const unsubmittedAICorrectionsCollectionName = 'unsubmittedAICorrections' as const;

const unsubmittedAICorrectionsSchema = {
  version: 0,
  primaryKey: 'correctionId',
  type: 'object',
  properties: {
    correctionId: {
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
    question: {
      type: 'string',
    },
    answer: {
      type: 'string',
    },
  },
  required: ['correctionId', 'quizId', 'questionNumber'],
} as const;

export type UnsubmittedAICorrection = ExtractDocumentTypeFromTypedRxJsonSchema<typeof unsubmittedAICorrectionsSchema>;

export default async function unsubmittedAICorrectionsCollection(db: RxDatabase) {
  await db.addCollections({
    /** In progress ai corrections */
    [unsubmittedAICorrectionsCollectionName]: {
      schema: unsubmittedAICorrectionsSchema,
    },
  });
}
