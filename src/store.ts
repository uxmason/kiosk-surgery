import { create } from "zustand";

interface Store {
    deviceId: string;
    setDeviceId: (newDeviceId: string) => void;
}

const useStore = create<Store>((set) => ({
    deviceId: "",
    setDeviceId: (newDeviceId: string) => set({ deviceId: newDeviceId }),
}));

export default useStore;
