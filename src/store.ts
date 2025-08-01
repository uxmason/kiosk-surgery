import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface Client {
    psEntry: string;
    name: string;
    branch: string;
    licence: string;
    part: string;
    opeCode: string;
    opeDate: string;
    promTime: string;
    opeTime: string;
    doctorId: string;
}

interface ClientStore {
    client: Client;
    setClient: (client: Client) => void;
    getClient: () => Client;
}

export const useClientStore = create<ClientStore>()(
    persist(
        (set, get) => ({
            client: {
                psEntry: "",
                name: "",
                branch: "",
                licence: "",
                part: "",
                opeCode: "",
                opeDate: "",
                promTime: "",
                opeTime: "",
                doctorId: "",
            },
            setClient: (newClient) => set({ client: newClient }),
            getClient: () => get().client,
        }),
        {
            name: "client-storage",
            partialize: (state) => ({ client: state.client }),
        }
    )
);

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
