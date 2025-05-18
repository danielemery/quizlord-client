import { liveQuery } from 'dexie';
import { useEffect, useState } from 'preact/hooks';

import { db, Setting } from '../services/db';

interface AutoContinueSetting {
  name: 'AUTO_CONTINUE';
  value: boolean;
}

interface LockAnswerSetting {
  name: 'LOCK_ANSWER';
  value: boolean;
}

const SETTINGS = {
  AUTO_CONTINUE: {
    default: true,
  },
  LOCK_ANSWER: {
    default: false,
  },
};

type SetSettingArguments = AutoContinueSetting | LockAnswerSetting;

export function useSettings() {
  const [settings, setSettings] = useState<Setting[] | undefined>([]);

  const settings$ = liveQuery(() => db.settings.toArray() ?? []);

  useEffect(() => {
    const subscription = settings$.subscribe((settings) => {
      setSettings(settings);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [settings$]);

  const setSetting = async (setter: SetSettingArguments) => {
    const existingSetting = await db.settings.where('name').equals(setter.name).first();
    if (existingSetting) {
      db.settings.update(existingSetting.name, { value: `${setter.value}` });
    } else {
      db.settings.add({ name: setter.name, value: `${setter.value}` });
    }
  };

  const resolvedSettings =
    settings !== undefined
      ? {
          AUTO_CONTINUE: settingValueToBoolean(
            settings.find((setting) => setting.name === 'AUTO_CONTINUE')?.value,
            SETTINGS.AUTO_CONTINUE.default,
          ),
          LOCK_ANSWER: settingValueToBoolean(
            settings.find((setting) => setting.name === 'LOCK_ANSWER')?.value,
            SETTINGS.LOCK_ANSWER.default,
          ),
        }
      : undefined;

  return {
    settings: resolvedSettings,
    setSetting,
    loading: settings === undefined,
  };
}

function settingValueToBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true';
}
