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

interface DoctorIdStore {
    doctorId: string;
    branch: string;
    setDoctorId: (newDoctorId: string, newBranch: string) => void;
}

export const useDoctorIdStore = create<DoctorIdStore>((set) => ({
    doctorId: "",
    branch: "",
    setDoctorId: (newDoctorId: string, newBranch: string) =>
        set({ doctorId: newDoctorId, branch: newBranch }),
}));
