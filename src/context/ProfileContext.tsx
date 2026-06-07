import React, { createContext, useContext, useState } from 'react';
import { loadJSON, saveJSON, removeKey, STORAGE_KEYS } from '@/lib/storage';

// 온보딩에서 입력받는 개인 정보 (이름은 받지 않음)
export interface Profile {
  ageRange: string;      // 예: '20대'
  job: string;           // 예: '사무직'
  tendencies: string[];  // 주요 증상 성향 (acupressureData의 카테고리 id)
  createdAt: string;     // ISO 날짜
}

interface ProfileContextValue {
  profile: Profile | null;
  saveProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(() =>
    loadJSON<Profile | null>(STORAGE_KEYS.profile, null)
  );

  const saveProfile = (next: Profile) => {
    saveJSON(STORAGE_KEYS.profile, next);
    setProfile(next);
  };

  const clearProfile = () => {
    removeKey(STORAGE_KEYS.profile);
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
