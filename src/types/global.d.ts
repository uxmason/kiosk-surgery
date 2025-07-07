// src/types/global.d.ts
export {};                      // 모듈 스코프로 만들어 “중복 변수” 경고 방지

declare global {
  interface Window {
    /** Electron preload 가 주입하는 API */
    electronAPI?: {
      /** 구 버전 호환용 별칭 – 기기 ID */
      getCPUID?: () => Promise<string>;
      /** 새 이름 – 기기 ID */
      getMachineId?: () => Promise<string>;
    };
  }
}