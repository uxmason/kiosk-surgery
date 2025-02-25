"use client";
import { AddNewCunnulaType } from "@/type";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const BtnAdd = () => {
    const [isClickComplete, setIsClickComplete] = useState(false);

    const { watch } = useFormContext<AddNewCunnulaType>();
    const model = watch()?.model;
    const hole = watch()?.hole;
    const tip = watch()?.tip;
    const shape = watch()?.shape;
    const length = watch()?.length;
    const thick = watch()?.thick;
    const isComplete =
        typeof model === "number" &&
        typeof hole === "number" &&
        typeof tip === "number" &&
        typeof shape === "number" &&
        typeof length === "number" &&
        typeof thick === "number";

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                className={`flex items-center justify-center w-[480px] bg-[rgba(255,255,255,0.25)] backdrop-blur-[20px] rounded-[15px] transition-all duration-200 ease-in
                ${
                    isComplete && isClickComplete
                        ? "opacity-100 h-[120px] mb-[30px]"
                        : "opacity-0 h-0 mb-[0px]"
                }
                `}
            >
                <p className="text-white text-[32px] font-bold leading-8">
                    이미 등록된 캐뉼라입니다.
                </p>
            </div>
            <p
                className={`text-white text-center font-bold leading-12 whitespace-pre-line transition-all duration-200 ease-in
                    ${
                        isComplete && isClickComplete
                            ? "opacity-100 pb-[30px] text-[32px]"
                            : "opacity-0 text-[0px] pb-[0px]"
                    }
                    `}
            >
                {`“비록, 신규 등록은 안되지만, 이 캐뉼라를 사용한 것
                으로 기록하시겠습니까?”`}
            </p>
            <button
                className={`text-center w-[480px] bg-[#15CF8F] rounded-[15px] transition-all duration-200 ease-in
                ${isComplete ? "opacity-100 h-[120px]" : "opacity-0 h-0"}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isClickComplete) {
                        setIsClickComplete(false);
                    } else {
                        setIsClickComplete(true);
                    }
                }}
            >
                <p className="text-white text-[32px] font-bold">
                    {isClickComplete ? "네" : "신규 캐뉼라 등록"}
                </p>
            </button>
            <p
                className={`text-white text-center text-[32px] font-bold leading-12 whitespace-pre-line transition-all duration-200 ease-in
                    ${!isComplete ? "opacity-100" : "opacity-0 text-[0px]"}
                    `}
            >
                {`“6개 조건을 모두 선택하셔야 신규 캐뉼라 등록 조건
                    을 확인할 수 있습니다.”`}
            </p>
        </div>
    );
};
export default BtnAdd;
