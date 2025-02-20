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
