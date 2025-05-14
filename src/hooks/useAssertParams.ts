import { useParams } from 'react-router-dom';

export default function useAssertParams<T extends string>() {
  const params = useParams() as Record<T, string | undefined>;

  for (const key of Object.keys(params) as T[]) {
    if (params[key] === undefined) {
      throw new Error(`Missing parameter: ${key}`);
    }
  }

  // Cast to ensure all keys have non-undefined values
  return params as Record<T, string>;
}
