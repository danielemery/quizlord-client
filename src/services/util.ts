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

export function scoreToColor(score: string | undefined): string {
  switch (score) {
    case 'CORRECT':
      return 'bg-emerald-400';
    case 'HALF_CORRECT':
      return 'bg-amber-400';
    case 'INCORRECT':
      return 'bg-rose-400';
    default:
      return 'bg-gray-400';
  }
}

export function closestScore(score: number): string {
  if (score >= 0.75) return 'CORRECT';
  if (score >= 0.25) return 'HALF_CORRECT';
  return 'INCORRECT';
}
