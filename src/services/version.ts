import { ApolloLink } from '@apollo/client';
import { createStore } from 'zustand/vanilla';

import { createBoundedUseStore } from './util';

interface VersionState {
  version?: string;
  setVersion: (newVersion: string) => void;
}

const QUIZLORD_VERSION_HEADER = 'X-Quizlord-Api-Version';

export const versionStore = createStore<VersionState>((set) => ({
  version: undefined,
  setVersion: (newVersion: string) => set({ version: newVersion }),
}));

export const useVersionStore = createBoundedUseStore(versionStore);

export const extractVersionLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      const quizlordVersion = headers.get(QUIZLORD_VERSION_HEADER);
      if (quizlordVersion) {
        const { setState } = versionStore;
        setState({ version: quizlordVersion });
      }
    }

    return response;
  });
});
