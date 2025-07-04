export {};

declare global {
    interface Window {
        electronAPI: {
            getCPUID: () => Promise<string>;
        };
    }
}
