import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

import unsubmittedAICorrectionsCollection, {
  unsubmittedAICorrectionsCollectionName,
} from './unsubmitted-ai-corrections';
import unsubmittedAnswersCollection, {
  unsubmittedAnswersCollectionName,
  getUpsertUnsubmittedAnswer,
} from './unsubmitted-answers';

let database: RxDatabase | null = null;

export async function initialize() {
  if (!database) {
    console.log('Initializing RxDB');
    console.log(window.env.VITE_ENVIRONMENT_NAME);
    if (window.env.VITE_ENVIRONMENT_NAME === 'dev_daniel') {
      console.log('Detected local environment, Adding dev mode plugin');
      addRxPlugin(RxDBDevModePlugin);
    }
    addRxPlugin(RxDBQueryBuilderPlugin);

    const quizlordDatabase = await createRxDatabase({
      name: 'quizlord',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageLocalstorage(),
        
      }),
    });

    await unsubmittedAnswersCollection(quizlordDatabase);
    await unsubmittedAICorrectionsCollection(quizlordDatabase);

    database = quizlordDatabase;
  } else {
    console.warn('RxDB already initialized');
  }

  return database;
}

export const CollectionName = {
  [unsubmittedAICorrectionsCollectionName]: unsubmittedAICorrectionsCollectionName,
  [unsubmittedAnswersCollectionName]: unsubmittedAnswersCollectionName,
};

export function getOperations() {
  if (!database) {
    throw new Error('RxDB not initialized');
  }

  return {
    upsertUnsubmittedAnswer: getUpsertUnsubmittedAnswer(database),
  };
}
