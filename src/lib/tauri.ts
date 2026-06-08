import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

/** 데스크탑(Tauri) 환경에서 실행 중인지 */
export const isTauri =
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

/** Tauri 명령 호출 — 웹 환경에서는 조용히 무시 */
export async function invokeSafe(
  cmd: string,
  args?: Record<string, unknown>
): Promise<void> {
  if (!isTauri) return;
  try {
    await invoke(cmd, args);
  } catch (e) {
    console.warn(`[tauri] invoke "${cmd}" 실패`, e);
  }
}

/** Tauri 명령 호출(결과 반환) — 웹 환경에서는 null */
export async function invokeResult<T>(
  cmd: string,
  args?: Record<string, unknown>
): Promise<T | null> {
  if (!isTauri) return null;
  try {
    return await invoke<T>(cmd, args);
  } catch (e) {
    console.warn(`[tauri] invoke "${cmd}" 실패`, e);
    return null;
  }
}

/** Tauri 이벤트 구독 — 웹 환경에서는 no-op */
export async function onTauriEvent(
  event: string,
  handler: () => void
): Promise<() => void> {
  if (!isTauri) return () => {};
  return listen(event, () => handler());
}
