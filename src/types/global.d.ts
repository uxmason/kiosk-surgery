// src/types/global.d.ts
export {};                      // 모듈 스코프로 만들어 “중복 변수” 경고 방지

declare global {
  interface Window {
    electronAPI?: {
      /* 존재하면 반드시 함수 */
      getCPUID: () => Promise<string>;
      getMachineId: () => Promise<string>;
    };
  }
}