import { useStore, StoreApi } from 'zustand';

// Based on documentation here https://github.com/pmndrs/zustand/blob/808a72225ea8a87289898e69b360e89e9380b17d/docs/guides/typescript.md#bounded-usestore-hook-for-vanilla-stores
export const createBoundedUseStore = ((store) => (selector) => useStore(store, selector as never)) as <
  S extends StoreApi<unknown>,
>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T): T;
};

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;
