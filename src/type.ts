export type TipType = {
    type: "사선형" | "블런트형" | "샤프형";
};
export type ShapeType = {
    type: "직선형" | "컨케이브";
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

export type ModelNameType = {
    _id: string;
    MODEL_NAME: string;
};
export type HolelCountType = {
    _id: string;
    HOLE_COUNT: string;
};
export type TipsType = {
    _id: string;
    TIP: string;
};
export type ShapesType = {
    _id: string;
    SHAPE: string;
};
export type LengthType = {
    _id: string;
    LENGTH: string;
};
export type ThicknessType = {
    _id: string;
    THICKNESS: string;
};
export type CannulaListType = {
    갯수: string;
    CANNULA_ID: string;
    MODEL_NAME: string;
    TIP: string;
    SHAPE: string;
    LENGTH: string;
    THICKNESS: string;
};

export type AddNewCunnulaType = {
    model: string | undefined | null;
    hole: string | undefined | null;
    tip: string | undefined | null;
    shape: string | undefined | null;
    length: string | undefined | null;
    thick: string | undefined | null;
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
