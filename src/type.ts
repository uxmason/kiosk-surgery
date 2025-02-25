export type CannulaType = {
    type: "CURVE" | "CANCAVE" | "BLUNT" | "LINE";
};
export type PartType =
    | "THIGH"
    | "ABDOMEN"
    | "ARM"
    | "LOVEHANDLE"
    | "BACK"
    | "HIP"
    | "FACE"
    | "CALVES";
export type OpeStateType = "0" | "1" | "2" | "3";

export type ModelType = {
    id: number;
    name: string;
};
export type HolelType = {
    id: number;
    name: string;
};
export type TipType = {
    id: number;
    name: string;
};
export type ShapeType = {
    id: number;
    name: string;
};
export type LengthType = {
    id: number;
    name: string;
};
export type ThicknessType = {
    id: number;
    name: string;
};

export type AddNewCunnulaType = {
    model: number | undefined | null;
    hole: number | undefined | null;
    tip: number | undefined | null;
    shape: number | undefined | null;
    length: number | undefined | null;
    thick: number | undefined | null;
};

export type OpeType = {
    clientName: string;
    part: PartType;
    opeCode: string;
    psEntry: string;
    startTime: string;
    endTime: string;
    opeDate: string;
    state: OpeStateType;
};
