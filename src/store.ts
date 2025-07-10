import { create } from "zustand";

interface Store {
    deviceId: string;
    setDeviceId: (newDeviceId: string) => void;
}

export const useStore = create<Store>((set) => ({
    deviceId: "",
    setDeviceId: (newDeviceId: string) => set({ deviceId: newDeviceId }),
}));

interface Client {
    psEntry: string;
    name: string;
    branch: string;
    licence: string;
    part: string;
    opeCode: string;
    opeDate: string;
}

interface ClientStore {
    client: Client;
    setClient: (client: Client) => void;
    getClient: () => Client;
}

export const useClientStore = create<ClientStore>((set, get) => ({
    client: {
        psEntry: "",
        name: "",
        branch: "",
        licence: "",
        part: "",
        opeCode: "",
        opeDate: "",
    },
    setClient: (newClient) => set({ client: newClient }),
    getClient: () => get().client,
}));

interface Doctor {
    id: string;
    name: string;
    branch: string;
    branchName: string;
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
        branchName: "",
    },
    setDoctor: (newDoctor) => set({ doctor: newDoctor }),
    getDoctor: () => get().doctor,
}));
