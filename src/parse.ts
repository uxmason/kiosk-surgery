import { OpeStateType, PartType } from "./type";

type Nullish<T> = T | null | undefined;

function generateParseKeyForObject<T extends string>(
    obj: { [_ in T]: { text: string; color: string } },
    fallback = { text: "-", color: "default" }
) {
    return (v: Nullish<T>) => (v ? obj[v] : fallback);
}
export const parseCannulType = generateParseKeyForObject<
    "CURVE" | "CANCAVE" | "BLUNT" | "LINE"
>({
    CURVE: { text: "사선형", color: "#F9AC68" },
    BLUNT: { text: "블런트형", color: "#ED6B5B" },
    CANCAVE: { text: "컨케이브", color: "#F8ABBD" },
    LINE: { text: "직선형", color: "#5B87ED" },
});
export const parseOpePart = generateParseKeyForObject<PartType>({
    THIGH: { text: "허벅지", color: "#38ABBE" },
    ARM: { text: "팔", color: "#15CF8F" },
    ABDOMEN: { text: "복부", color: "#ED6B5B" },
    BACK: { text: "등", color: "#F9AC68" },
    LOVEHANDLE: { text: "러브핸들", color: "#F05579" },
    HIP: { text: "엉덩이", color: "#F9AC68" },
    FACE: { text: "얼굴", color: "#F9AC68" },
    CALVES: { text: "종아리", color: "#5B87ED" },
});
export const parseOpeState = generateParseKeyForObject<OpeStateType>({
    0: { text: "선택하기", color: "#15CF8F" },
    1: { text: "수술 중", color: "#ED6B5B" },
    2: { text: "수술 완료", color: "#ED6B5B" },
    3: { text: "기록 완료", color: "#5B87ED" },
});
