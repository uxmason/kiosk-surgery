import { create } from "zustand";

interface Store {
    deviceId: string;
    setDeviceId: (newDeviceId: string) => void;
}

export const useStore = create<Store>((set) => ({
    deviceId: "",
    setDeviceId: (newDeviceId: string) => set({ deviceId: newDeviceId }),
}));

interface PsentryStore {
    psEntry: string;
    setPsEntry: (newPsEntry: string) => void;
}

export const usePsentryStore = create<PsentryStore>((set) => ({
    psEntry: "",
    setPsEntry: (newPsEntry: string) => set({ psEntry: newPsEntry }),
}));

interface Doctor {
    id: string;
    name: string;
    branch: string;
}

interface DoctorStore {
    doctor: Doctor;
    setDoctor: (doctor: Doctor) => void;
    getDoctor: () => Doctor;
}

export const useDoctorStore = create<DoctorStore>((set, get) => ({
    doctor: {
        id: "",
        name: "",
        branch: "",
    },
    setDoctor: (newDoctor) => set({ doctor: newDoctor }),
    getDoctor: () => get().doctor,
}));
