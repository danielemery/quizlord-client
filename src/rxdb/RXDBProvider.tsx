import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { RxDatabase } from 'rxdb';
import { Provider } from 'rxdb-hooks';

import { initialize } from '../services/rxdb';

export function RXDBProvider({ children }: { children: ComponentChildren }) {
  const [db, setDb] = useState<RxDatabase>();

  useEffect(() => {
    // RxDB instantiation can be asynchronous
    initialize().then(setDb);
  }, []);

  // Until db becomes available, consumer hooks that
  // depend on it will still work, absorbing the delay
  // by setting their state to isFetching:true
  return <Provider db={db}>{children}</Provider>;
}
