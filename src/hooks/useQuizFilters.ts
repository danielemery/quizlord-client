import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

import { db } from '../services/db';

const EXCLUDED_USER_EMAILS_KEY = 'QUIZ_FILTER_EXCLUDED_USER_EMAILS';
const IS_FILTERING_ON_ILLEGIBLE_KEY = 'QUIZ_FILTER_IS_FILTERING_ON_ILLEGIBLE';
const CURRENT_USER_KEY = 'CURRENT_USER_EMAIL';

export interface QuizFilters {
  excludedUserEmails: string[];
  isFilteringOnIllegible: boolean;
}

const DEFAULT_FILTERS: QuizFilters = {
  excludedUserEmails: [],
  isFilteringOnIllegible: true,
};

export function useQuizFilters(authenticatedUserEmail?: string | null) {
  // Default filter excludes quizzes completed by the authenticated user
  const initialFilters: QuizFilters = {
    ...DEFAULT_FILTERS,
    excludedUserEmails: authenticatedUserEmail ? [authenticatedUserEmail] : [],
  };

  const [filters, setFilters] = useState<QuizFilters | undefined>(undefined);

  const settings$ = liveQuery(() => db.settings.toArray());

  useEffect(() => {
    const subscription = settings$.subscribe(async (settings) => {
      // Check if we have a stored user
      const storedUserSetting = settings.find((setting) => setting.name === CURRENT_USER_KEY);
      const storedUserEmail = storedUserSetting ? storedUserSetting.value : null;

      // If the authenticated user has changed or no user is stored yet
      if (authenticatedUserEmail && storedUserEmail !== authenticatedUserEmail) {
        // User has changed or first login - clear settings and store new user
        await db.settings.clear();

        // Store the new user
        await db.settings.add({
          name: CURRENT_USER_KEY,
          value: authenticatedUserEmail,
        });

        // Initialize excludedUserEmails setting
        await db.settings.add({
          name: EXCLUDED_USER_EMAILS_KEY,
          value: JSON.stringify([authenticatedUserEmail]),
        });

        // Initialize isFilteringOnIllegible setting
        await db.settings.add({
          name: IS_FILTERING_ON_ILLEGIBLE_KEY,
          value: String(initialFilters.isFilteringOnIllegible),
        });

        // Set filters directly to avoid delay in UI update
        setFilters({
          excludedUserEmails: [authenticatedUserEmail],
          isFilteringOnIllegible: initialFilters.isFilteringOnIllegible,
        });

        return;
      }

      // If settings are empty (for any other reason)
      if (settings.length === 0 || !settings.some((s) => s.name === EXCLUDED_USER_EMAILS_KEY)) {
        if (authenticatedUserEmail) {
          // Initialize excludedUserEmails setting
          await db.settings.add({
            name: EXCLUDED_USER_EMAILS_KEY,
            value: JSON.stringify([authenticatedUserEmail]),
          });

          // Initialize isFilteringOnIllegible setting
          await db.settings.add({
            name: IS_FILTERING_ON_ILLEGIBLE_KEY,
            value: String(initialFilters.isFilteringOnIllegible),
          });

          // Store current user if not already stored
          if (!settings.some((s) => s.name === CURRENT_USER_KEY)) {
            await db.settings.add({
              name: CURRENT_USER_KEY,
              value: authenticatedUserEmail,
            });
          }

          // Set filters directly to avoid delay in UI update
          setFilters({
            excludedUserEmails: [authenticatedUserEmail],
            isFilteringOnIllegible: initialFilters.isFilteringOnIllegible,
          });

          return;
        }
      }

      const excludedUserEmailsSetting = settings.find((setting) => setting.name === EXCLUDED_USER_EMAILS_KEY);
      let excludedUserEmails = initialFilters.excludedUserEmails;

      if (excludedUserEmailsSetting) {
        try {
          excludedUserEmails = JSON.parse(excludedUserEmailsSetting.value);
        } catch (e) {
          console.error('Failed to parse excluded user emails', e);
        }
      } else {
        await db.settings.add({
          name: EXCLUDED_USER_EMAILS_KEY,
          value: JSON.stringify(initialFilters.excludedUserEmails),
        });
      }

      const isFilteringOnIllegibleSetting = settings.find((setting) => setting.name === IS_FILTERING_ON_ILLEGIBLE_KEY);
      let isFilteringOnIllegible = initialFilters.isFilteringOnIllegible;

      if (isFilteringOnIllegibleSetting) {
        isFilteringOnIllegible = isFilteringOnIllegibleSetting.value === 'true';
      } else {
        await db.settings.add({
          name: IS_FILTERING_ON_ILLEGIBLE_KEY,
          value: String(initialFilters.isFilteringOnIllegible),
        });
      }

      setFilters({
        excludedUserEmails,
        isFilteringOnIllegible,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [settings$, initialFilters]);

  const updateFilters = async (changes: Partial<QuizFilters>) => {
    if (changes.excludedUserEmails !== undefined) {
      await db.settings.put({
        name: EXCLUDED_USER_EMAILS_KEY,
        value: JSON.stringify(changes.excludedUserEmails),
      });
    }

    if (changes.isFilteringOnIllegible !== undefined) {
      await db.settings.put({
        name: IS_FILTERING_ON_ILLEGIBLE_KEY,
        value: String(changes.isFilteringOnIllegible),
      });
    }
  };

  return {
    filters: filters ?? initialFilters,
    updateFilters,
    loading: filters === undefined,
  };
}
