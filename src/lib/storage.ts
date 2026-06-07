/**
 * 앱의 모든 영구 저장은 이 파일을 통해서만 한다.
 *
 * 지금은 브라우저 localStorage를 사용하지만, 추후 데스크탑(Tauri) 전환 시
 * 여기 구현만 Tauri Store 플러그인/파일/SQLite 등으로 교체하면
 * 나머지 코드는 손대지 않아도 되도록 한 곳에 모아둔다.
 */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간 초과 등은 조용히 무시 (개인 데이터라 치명적이지 않음)
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// 저장 키는 여기서 한 번에 관리
export const STORAGE_KEYS = {
  profile: 'sohngil-profile',
  history: 'sohngil-history',
} as const;
