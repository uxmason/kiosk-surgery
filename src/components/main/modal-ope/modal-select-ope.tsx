"use client";
import { useEffect, useState } from "react";
import { CustomModal } from "../../common";
import { ModalError, TimeLine } from ".";
import _ from "lodash";
import { useDoctorIdStore } from "@/store";

interface Props {
    isOpen: boolean;
    setOpeOpen: (v: boolean) => void;
}

const ModalSelecOpe = ({ isOpen, setOpeOpen }: Props) => {
    const { doctorId, branch } = useDoctorIdStore();
    const [isHospitalId, setIsHospitalId] = useState(branch);
    const [isOriginalHospitalId, setIsOriginalHospitalId] = useState(branch);
    const [isHospitalExpand, setIsHospitalExpand] = useState(false);
    const [userId, setUserId] = useState(doctorId);
    const [originalUserId, setOriginalUserId] = useState(doctorId);
    const [isErrorMessage, setIsErrorMessage] = useState(false);
    const [isAllOpe, setIsAllOpe] = useState([]);
    console.log({ setIsOriginalHospitalId, userId, setOriginalUserId });
    // 모든 지점의 수술 정보를 받아오기
    // const handleSelectAllOpe = async () => {
    //     try {
    //         const response = await fetch(`/api/kiosk-surgery/schedule/`, {
    //             method: "GET",
    //         });

    //         if (!response.ok) {
    //             throw new Error("Network response was not ok");
    //         }

    //         const result = await response.json();
    //         return result;
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (isOpen) {
    //         handleSelectAllOpe().then((res) => {
    //             if (res.success) {
    //                 setIsAllOpe(res.list);
    //             } else {
    //                 console.error(res.success);
    //             }
    //         });
    //     }
    // }, [isOpen]);

    const groupedByBranch = _.groupBy(isAllOpe, "지점");
    const finalGroupedData = Object.entries(groupedByBranch).map(
        ([branch, branchData]) => ({
            branch,
            doctors: Object.entries(_.groupBy(branchData, "담당의ID")),
        })
    );
    const list = finalGroupedData
        ?.filter((f) => f.branch === isOriginalHospitalId)
        ?.map((d) => d)?.[0];
    const timelineList = list?.doctors
        ?.filter((s) => s?.[1]?.[0])
        ?.filter((n) => n?.[0] === originalUserId)?.[0]?.[1];

    // useEffect(() => {
    //     if (userId === "") return;
    //     eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     handleChangeDoctor().then((res: any) => {
    //         if (res.success === true) {
    //             setUserId("");
    //         } else {
    //             setIsErrorMessage(true);
    //             setUserId(originalUserId);
    //         }
    //     });
    // }, [userId]);

    return (
        <>
            <CustomModal isOpen={isOpen} onClose={() => setOpeOpen(false)}>
                <div className="flex flex-col w-full h-full items-center pt-20">
                    <p className="text-white text-[54px] font-bold leading-[54px]">
                        수술 고객 선택
                    </p>
                    <div className="flex w-full pt-[66px] gap-x-5">
                        <div className="flex w-full max-w-[580px] min-h-[1200px] h-full bg-[rgba(58,62,89,0.25)] rounded-[15px] pl-5 pr-[25px] pt-[42px]">
                            <TimeLine timelineList={timelineList} />
                        </div>
                        <div className="flex flex-col w-full max-w-[300px] gap-y-5">
                            <div
                                className={`flex flex-col w-full h-full gap-y-[10px] transition-all duration-300 ease-in-out bg-[rgba(58,62,89,0.25)] rounded-[15px] px-[15px] py-[15px]
                                    ${
                                        isHospitalExpand
                                            ? "max-h-[420px] overflow-auto"
                                            : "max-h-[100px] overflow-hidden"
                                    }
                                    `}
                            >
                                {hospitales?.map((h) => (
                                    <div
                                        key={h.id}
                                        className={`flex items-center w-[270px] h-[70px] bg-[rgba(58,62,89,0.25)] transition-all duration-300 ease-in-out rounded-[10px] px-[25px] py-5 cursor-pointer
                                            ${
                                                isHospitalId === h.id
                                                    ? "border-[4px] border-solid border-[#15CF8F]"
                                                    : !isHospitalExpand &&
                                                      isHospitalId !== h.id
                                                    ? "hidden"
                                                    : ""
                                            }
                                        `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsHospitalExpand(
                                                (prev) => !prev
                                            );
                                            setIsHospitalId(h.id);
                                        }}
                                    >
                                        <p className="text-white text-[22px] font-bold leading-[30px]">
                                            {h.name}365mc병원
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div
                                className={`flex flex-col w-full h-full gap-y-[10px] px-[15px] py-[15px] transition-all duration-300 ease-in-out bg-[rgba(58,62,89,0.25)] rounded-[15px]
                                ${
                                    isHospitalExpand
                                        ? "max-h-[780px]"
                                        : "max-h-[1080px]"
                                }
                                `}
                            >
                                {finalGroupedData
                                    ?.filter((f) => f.branch === isHospitalId)
                                    ?.map((d) => d)?.[0]
                                    ?.doctors?.map((s) => {
                                        return (
                                            <div
                                                key={s?.[1]?.[0]?.["담당의ID"]}
                                                className={`flex relative box-border w-[270px] h-[100px] text-white pt-[10px] px-5 bg-[rgba(58,62,89,0.25)] rounded-[10px]
                                                ${
                                                    originalUserId ===
                                                        s?.[1]?.[0]?.[
                                                            "담당의ID"
                                                        ] &&
                                                    "border-[4px] border-solid border-[#15CF8F] h-[104px]"
                                                }
                                                `}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUserId(
                                                        s?.[1]?.[0]?.[
                                                            "담당의ID"
                                                        ]
                                                    );
                                                }}
                                            >
                                                <div
                                                    className={`isPortrait I${s?.[1]?.[0]?.["담당의ID"]} absolute w-[60px] h-[90px]`}
                                                />
                                                <div className="flex flex-col pl-[85px] pt-[15px] gap-y-[13px]">
                                                    <p className="text-[22px] font-bold leading-[22px]">
                                                        {
                                                            s?.[1]?.[0]?.[
                                                                "담당의명"
                                                            ]
                                                        }
                                                        <span className="font-[250]">
                                                            원장
                                                        </span>
                                                    </p>
                                                    <p className="text-[14px] font-light leading-[14px]">
                                                        오늘 수술:
                                                        <span className="text-[16px] font-bold mx-1">
                                                            {s?.[1]?.length}
                                                        </span>
                                                        건
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </CustomModal>
            <ModalError
                isErrorOpen={isErrorMessage}
                setIsErrorOpen={setIsErrorMessage}
            />
        </>
    );
};

export default ModalSelecOpe;

// 병원 리스트 데이터
const hospitales: HospitalType[] = [
    { id: "36", name: "서울" },
    { id: "34", name: "인천" },
    { id: "18", name: "대전" },
    { id: "35", name: "대구" },
    { id: "21", name: "부산" },
];

type HospitalType = {
    id: string;
    name: string;
};
