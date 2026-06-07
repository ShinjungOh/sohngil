import React, { createContext, useContext, useMemo, useState } from 'react';
import { acupressurePoints, symptoms } from '@/data/acupressureData';

/**
 * 지압 한 회차(세션)의 진행 상태.
 * URL 라우트가 나뉘어도 단계 간 데이터(선택 증상/추천 지압점/완료 지압점)를
 * 공유하기 위해 컨텍스트로 관리한다.
 */
interface SessionContextValue {
  selectedSymptoms: string[];
  setSelectedSymptoms: (ids: string[]) => void;
  recommendedPoints: string[];
  completedPoints: string[];
  /** 선택된 증상으로부터 추천 지압점을 계산해 저장 */
  analyze: () => void;
  markCompleted: (pointId: string) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendedPoints, setRecommendedPoints] = useState<string[]>([]);
  const [completedPoints, setCompletedPoints] = useState<string[]>([]);

  const analyze = () => {
    const ids = new Set<string>();
    selectedSymptoms.forEach((sid) => {
      const symptom = symptoms.find((s) => s.id === sid);
      symptom?.relatedPoints.forEach((pid) => {
        // 실제 정의된 지압점만 추천에 포함
        if (acupressurePoints.some((p) => p.id === pid)) ids.add(pid);
      });
    });
    setRecommendedPoints(Array.from(ids));
    setCompletedPoints([]);
  };

  const markCompleted = (pointId: string) => {
    setCompletedPoints((prev) => (prev.includes(pointId) ? prev : [...prev, pointId]));
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setRecommendedPoints([]);
    setCompletedPoints([]);
  };

  const value = useMemo(
    () => ({
      selectedSymptoms,
      setSelectedSymptoms,
      recommendedPoints,
      completedPoints,
      analyze,
      markCompleted,
      reset,
    }),
    [selectedSymptoms, recommendedPoints, completedPoints]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
