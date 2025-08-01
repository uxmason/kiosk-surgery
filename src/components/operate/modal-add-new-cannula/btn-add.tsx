"use client";
import { getFormattedDate } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { AddNewCunnulaType } from "@/type";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
interface Props {
    selectedCannulaIds: string[];
    isExistCannula: boolean;
    setIsOpenAddCannualModal: (v: boolean) => void;
    setSelectedCannulaIds: Dispatch<SetStateAction<string[]>>;
    isExistCannulaId: string;
    reloadCannulaList: () => void;
}
const BtnAdd = ({
    selectedCannulaIds,
    isExistCannula,
    setIsOpenAddCannualModal,
    setSelectedCannulaIds,
    isExistCannulaId,
    reloadCannulaList,
}: Props) => {
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const today = getFormattedDate();
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

    // 기존의 캐뉼라 등록
    const handleDirectAddCannula = async () => {
        const url = `/api/kiosk-surgery/cannula/direct-add`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deviceId: deviceId,
                    cannulaID: isExistCannulaId,
                    psEntry: client?.psEntry,
                    opDate: today,
                    doctorId: doctor?.id,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.error("API 호출 실패", response.status);
            }
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    // 새로운 캐뉼라 등록
    const handleAddNewCannula = async () => {
        const url = `/api/kiosk-surgery/cannula/add`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deviceId: deviceId,
                    modelNameID: model,
                    holeCountID: hole,
                    tipID: tip,
                    shapeID: shape,
                    lengthID: length,
                    thicknessID: thick,
                    psEntry: client?.psEntry,
                    opDate: getFormattedDate(),
                    doctorId: doctor.id,
                }),
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.error("API 호출 실패", response.status);
            }
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div
                className={`flex flex-col items-center transition-all duration-200 ease-in ${
                    isComplete && isExistCannula ? "pt-20" : "pt-0"
                }`}
            >
                <div
                    className={`flex items-center justify-center w-[480px] bg-[rgba(255,255,255,0.25)] backdrop-blur-[20px] rounded-[15px] transition-all duration-200 ease-in
                    ${
                        isComplete && isExistCannula
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
                        isComplete && isExistCannula
                            ? "opacity-100 pb-[30px] text-[32px]"
                            : "opacity-0 text-[0px] pb-[0px]"
                    }
                    `}
                >
                    {`“비록, 신규 등록은 안되지만, 이 캐뉼라를 사용한 것
                으로 기록하시겠습니까?”`}
                </p>
            </div>
            <button
                className={`text-center w-[480px] bg-[#15CF8F] rounded-[15px] transition-all duration-200 ease-in
                ${isComplete ? "opacity-100 h-[120px] z-10" : "opacity-0 h-0"}
                `}
                onClick={(e) => {
                    e.stopPropagation();

                    if (isExistCannula && isExistCannulaId !== "") {
                        handleDirectAddCannula().then((res) => {
                            if (res.success) {
                                setSelectedCannulaIds(
                                    selectedCannulaIds?.includes(res.cannulaID)
                                        ? selectedCannulaIds
                                        : [...selectedCannulaIds, res.cannulaID]
                                );
                                setIsOpenAddCannualModal(false);
                            } else {
                                toast.error(res.message);
                            }
                        });
                    } else {
                        handleAddNewCannula().then((res) => {
                            if (res.success) {
                                reloadCannulaList();
                                setSelectedCannulaIds(
                                    selectedCannulaIds?.includes(res.cannulaID)
                                        ? selectedCannulaIds
                                        : [...selectedCannulaIds, res.cannulaID]
                                );
                                setIsOpenAddCannualModal(false);
                            } else {
                                toast.error(res.message);
                            }
                        });
                    }
                }}
            >
                <p className="text-white text-[32px] font-bold">
                    {isExistCannula ? "네" : "신규 캐뉼라 등록"}
                </p>
            </button>
            <p
                className={`text-white text-center text-[32px] font-bold leading-12 whitespace-pre-line transition-all duration-200 ease-in
                    ${
                        !isComplete && !isExistCannula
                            ? "opacity-100"
                            : "opacity-0 text-[0px]"
                    }
                    `}
            >
                {`“6개 조건을 모두 선택하셔야 신규 캐뉼라 등록 조건
                    을 확인할 수 있습니다.”`}
            </p>
        </div>
    );
};
export default BtnAdd;
