"use client";
import { AnesthesiaType } from "@/type";

interface Props {
    isAnesthesia: AnesthesiaType[];
}

const AnesthesiaSafety = ({ isAnesthesia }: Props) => {
    const riskLevel = isAnesthesia?.[0]?.riskLevel
        ? Math.trunc(isAnesthesia?.[0]?.riskLevel * 1000) / 10
        : 0;
    const warningLevel = isAnesthesia?.[0]?.warningLevel;

    // 각 구간 정의
    const zones = {
        NORMAL: { min: 0, max: 37, startPx: 0, endPx: 48.1 },
        WARNING: { min: 38, max: 93, startPx: 49.4, endPx: 121.9 },
        DANGER: { min: 94, max: 100, startPx: 123.5, endPx: 130 },
    };

    // 현재 구간 및 위치 계산
    let percent = 0;

    if (warningLevel === "DANGER") {
        percent =
            (zones.DANGER.max - riskLevel) /
            (zones.DANGER.max - zones.DANGER.min);
    } else if (warningLevel === "WARNING") {
        percent =
            (zones.WARNING.max - riskLevel) /
            (zones.WARNING.max - zones.WARNING.min);
    } else {
        percent =
            (zones.NORMAL.max - riskLevel) /
            (zones.NORMAL.max - zones.NORMAL.min);
    }

    const levels = [
        { label: "위험", value: "DANGER", color: "#ED6B5B" },
        { label: "경고", value: "WARNING", color: "#F9AC68" },
        { label: "안전", value: "NORMAL", color: "#15CF8F" },
    ];

    return (
        <div className="flex justify-between w-full h-[135px] my-5 bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] pt-[26px] pb-[25px] px-[35px] rounded-[15px]">
            <div className="w-50">
                <p className="text-white text-[24px] font-bold leading-[42px]">
                    마취 안전
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-[24px] font-bold leading-[42px]">
                    응급 / 긴급 확률
                </p>
            </div>

            <div className="flex items-center justify-around w-[calc(100%-340px)]">
                {levels.map(({ label, value, color }) => {
                    const isActive = warningLevel === value;
                    return (
                        <div key={value} className="flex flex-col gap-y-[6px]">
                            <p
                                style={{
                                    color: isActive
                                        ? color
                                        : "rgba(255,255,255,0.30)",
                                }}
                                className="text-[16px] text-center font-medium leading-normal"
                            >
                                {label}
                            </p>
                            <div
                                className="relative w-[130px] h-5 rounded-[10px] backdrop-blur-[20px]"
                                style={{
                                    backgroundColor: isActive
                                        ? color
                                        : "rgba(255,255,255,0.30)",
                                }}
                            >
                                {isActive && (
                                    <div
                                        className="absolute top-1/2 w-7 h-7 border-[4px] border-white rounded-full"
                                        style={{
                                            backgroundColor: color,
                                            left: `${percent * 100}%`,
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end items-baseline pt-[14px] w-[140px]">
                {riskLevel !== 0 && (
                    <p
                        className={`italic text-[40px] font-light leading-[44px] ${
                            warningLevel === "DANGER"
                                ? "text-[#ED6B5B]"
                                : warningLevel === "WARNING"
                                ? "text-[#F9AC68]"
                                : "text-[#15CF8F]"
                        }`}
                    >
                        {riskLevel?.toLocaleString()}
                    </p>
                )}
                <p
                    className={`font-[20px] italic leading-[44px] ${
                        riskLevel !== 0
                            ? warningLevel === "DANGER"
                                ? "text-[#ED6B5B]"
                                : warningLevel === "WARNING"
                                ? "text-[#F9AC68]"
                                : "text-[#15CF8F]"
                            : "text-[rgba(255,255,255,0.30)] pt-4"
                    }`}
                >
                    {riskLevel !== 0 ? "%" : "데이터 없음"}
                </p>
            </div>
        </div>
    );
};

export default AnesthesiaSafety;
