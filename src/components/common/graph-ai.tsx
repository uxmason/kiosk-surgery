"use client";
import { handleBirthToAge, updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { FatListType, LimitFatPartsType } from "@/type";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
    isOpen: boolean;
    children: ReactNode;
    aiType: "DOCTOR" | "AVERAGE";
}
const order = ["팔", "복부", "허벅지"];
const GraphAi = ({ isOpen, children, aiType }: Props) => {
    const { deviceId } = useStore();
    // 수술 고객 정보
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [isLimitFatParts, setIsLimitFatParts] = useState<LimitFatPartsType[]>(
        []
    );
    const [isFatList, setIsFatList] = useState<FatListType[]>([]);
    const sortedArray = isFatList?.sort((a, b) => {
        return order.indexOf(a?.메인부위명) - order.indexOf(b?.메인부위명);
    });
    const onHandleSelectFepa = async (
        psEntry: string,
        age: number,
        sex: string
    ) => {
        try {
            const url =
                aiType === "DOCTOR"
                    ? `/api/kiosk-surgery/fepa?doctorId=${doctor?.id}&psEntry=${psEntry}&age=${age}&sex=${sex}`
                    : `/api/kiosk-surgery/fepa/average?psEntry=${psEntry}&age=${age}&sex=${sex}`;
            const response = await fetch(url, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (
            !isOpen ||
            typeof client?.psEntry === "undefined" ||
            client?.psEntry === "" ||
            client?.opeCode === ""
        ) {
            return;
        } else {
            const age = Number(handleBirthToAge(client?.licence));
            const sex =
                client?.licence?.slice(6, 7) === "2" ||
                client?.licence?.slice(6, 7) === "4"
                    ? "F"
                    : "M";
            onHandleSelectFepa(client?.psEntry, age, sex)?.then((res) => {
                if (res?.success) {
                    setIsLimitFatParts(res?.limitFatPart);
                    setIsFatList(res?.fatList);
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            });
        }
    }, [isOpen, client, aiType]);

    return (
        <div className="flex flex-col w-full h-[400px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] py-[30px] px-[35px] mb-5">
            {children}
            <div className="flex flex-col w-full h-full pt-[51px] gap-y-[46px]">
                {sortedArray?.map((part, index) => {
                    const max = isLimitFatParts?.filter(
                        (v) => v?.메인부위명 === part?.메인부위명
                    )?.[0];
                    return (
                        <div key={index} className="flex w-full">
                            <div className="flex gap-x-[15px] w-[205px]">
                                <div
                                    className={`flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[15px] border-[5px] border-solid ${
                                        part?.메인부위명 === "팔"
                                            ? "border-[#15CF8F]"
                                            : part?.메인부위명 === "복부"
                                            ? "border-[#ED6B5B]"
                                            : "border-[#38ABBE]"
                                    }`}
                                >
                                    <img
                                        src={`/assets/${
                                            part?.메인부위명 === "복부"
                                                ? "abdomen"
                                                : part?.메인부위명 === "팔"
                                                ? "arm"
                                                : "thigh"
                                        }.svg`}
                                        width={
                                            part?.메인부위명 === "복부"
                                                ? 35.5
                                                : part?.메인부위명 === "팔"
                                                ? 33
                                                : 32.5
                                        }
                                        height={
                                            part?.메인부위명 === "복부"
                                                ? 29
                                                : part?.메인부위명 === "팔"
                                                ? 25
                                                : 30
                                        }
                                    />
                                </div>
                                <p
                                    className={`text-[44px] w-[140px] font-light leading-11 ${
                                        part?.메인부위명 === "팔"
                                            ? "text-[#15CF8F]"
                                            : part?.메인부위명 === "복부"
                                            ? "text-[#ED6B5B]"
                                            : "text-[#38ABBE]"
                                    }`}
                                >
                                    {part?.메인부위명}
                                </p>
                            </div>
                            <div className="flex flex-col w-[440px] gap-y-[10px]">
                                <p className="text-white text-[20px] font-bold leading-5 w-fit">
                                    추출 예측량
                                    <span className="text-[16px] font-light pl-4">
                                        최소:
                                    </span>
                                    {part?.최소예측지방량?.toLocaleString()}
                                    <span className="text-[16px] font-light pl-4">
                                        최대:
                                    </span>
                                    {part?.최대예측지방량?.toLocaleString()}
                                </p>
                                <div className="relative w-[440px] h-5 rounded-[10px] bg-[rgba(255,255,255,0.20)] backdrop-blur-[20px]">
                                    <div
                                        className={`absolute h-full  backdrop-blur-[20px] rounded-[10px]
                                            ${
                                                aiType === "DOCTOR"
                                                    ? "bg-[#15CF8F]"
                                                    : "bg-[rgba(255,255,255,0.5)]"
                                            }
                                            `}
                                        style={{
                                            width: `${
                                                ((part?.최대예측지방량 -
                                                    part?.최소예측지방량) /
                                                    max?.최대예측지방량최대치) *
                                                100
                                            }%`,
                                            left: `${
                                                (part?.최소예측지방량 /
                                                    max?.최대예측지방량최대치) *
                                                100
                                            }%`,
                                        }}
                                    />
                                    <div
                                        className={`absolute top-[-4px] w-7 h-7 rounded-full border-[4px] border-solid border-white
                                                ${
                                                    aiType === "AVERAGE" &&
                                                    "bg-[#3A3E59]"
                                                }
                                            `}
                                        style={{
                                            left: `${
                                                (part?.평균예측지방량 /
                                                    max?.최대예측지방량최대치) *
                                                100
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-[165px] text-end ml-11">
                                <p
                                    className={`text-[44px] font-light italic leading-11 ${
                                        aiType === "DOCTOR"
                                            ? "text-[#15CF8F]"
                                            : "text-white"
                                    }`}
                                >
                                    {part?.평균예측지방량?.toLocaleString()}
                                    <span className="text-[20px]">cc</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default GraphAi;
