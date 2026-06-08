import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/lib/storage';
import { invokeSafe } from '@/lib/tauri';

export interface Settings {
  reminderEnabled: boolean;
  reminderInterval: number; // 분
  soundEnabled: boolean;
  notifyOnComplete: boolean;
}

const DEFAULTS: Settings = {
  reminderEnabled: false,
  reminderInterval: 60,
  soundEnabled: true,
  notifyOnComplete: true,
};

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULTS,
    ...loadJSON<Partial<Settings>>(STORAGE_KEYS.settings, {}),
  }));

  // 리마인더 설정이 바뀌면(앱 시작 포함) Rust 백그라운드 타이머에 동기화
  useEffect(() => {
    invokeSafe('set_reminder', {
      enabled: settings.reminderEnabled,
      intervalMinutes: settings.reminderInterval,
    });
  }, [settings.reminderEnabled, settings.reminderInterval]);

  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveJSON(STORAGE_KEYS.settings, next);
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
