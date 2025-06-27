export type TipType = {
    type: "사선형" | "블런트형" | "샤프형";
};
export type ShapeType = {
    type: "직선형" | "컨케이브";
};
export type FatPartType = "복부" | "팔" | "허벅지";
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
    HOLE_COUNT: string;
    TIP: string;
    SHAPE: string;
    LENGTH: string;
    THICKNESS: string;
    SELECTED: number;
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
export type IncisionListType = {
    _id: string;
    SURGERY_ID: number;
    POINT_NAME: string;
    AJAX_ID: string;
    SELECTED: number;
};
export type ButtonDataType = {
    style: { top: string; left?: string; right?: string };
    id: number;
};
export type UpdatedButtonDataType = {
    _id?: string;
    SURGERY_ID?: number;
    POINT_NAME?: string;
    AJAX_ID?: string;
    style: { top: string; left?: string; right?: string };
    id: number;
    SELECTED?: number;
};
export type PhotsArrType = {
    regdate: string;
    image: { idx: number; filename: string }[];
};
export type OpeClientType = {
    고객명: string;
    고객번호: string;
    수술일: string;
    기수: string;
    담당의ID: string;
    담당의명: string;
    병실: string | null;
    수술부위: string;
    수술명: string;
    수술코드: string;
    시작시간: string;
    예상시간: number;
    우선순위여부: string;
    이식용지방: string;
    종료시간: string;
    주민번호: string;
    지점: string;
    참관구분: "Y" | "N" | null;
    추가시간: number;
    통역여부: "Y" | "N" | null;
};

export type LimitFatPartsType = {
    메인부위명: FatPartType;
    평균예측지방량최대치: number;
    평균예측지방량평균치: number;
    평균예측지방량최소치: number;
    최대예측지방량최소치: number;
    최대예측지방량평균치: number;
    최대예측지방량최대치: number;
};
export type FatListType = {
    지점명: string;
    수술의ID: string;
    수술의: string;
    메인부위명: FatPartType;
    데이터갯수: number;
    최소예측지방량: number;
    평균예측지방량: number;
    최대예측지방량: number;
};
export type WeightsType = {
    WC_WEIGHT: number;
    BD_WEIGHT: number;
    MUST_WEIGHTL: number;
};
export type ImgsType = {
    regdate: string;
    image: ImgType[];
};
export type ImgType = {
    idx: number;
    filename: string;
};
export type WeightChartType = {
    date: string;
    weight: number;
};
export type ErrorMessageDataType = {
    deviceID: string;
    userID: string;
    message: string;
};
export type OpeInfoItem = {
    담당의ID: string;
    담당의명: string;
    수술부위: string;
    시작시간: string;
    수술코드: string;
    고객번호: string;
    고객명: string;
    주민번호: string;
};
