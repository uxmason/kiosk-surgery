"use client";
import { useState } from "react";
import { CustomModal } from "../../common";
import { TimeLine } from ".";

interface Props {
    isOpen: boolean;
    setIsOpeOpen: (v: boolean) => void;
}

const ModalSelecOpe = ({ isOpen, setIsOpeOpen }: Props) => {
    const [isHospitalId, setIsHospitalId] = useState(0);
    const [isHospitalExpand, setIsHospitalExpand] = useState(false);
    const [doctorId, setDoctorId] = useState(2);

    return (
        <>
            <CustomModal isOpen={isOpen} onClose={() => setIsOpeOpen(false)}>
                <div className="flex flex-col w-full h-full items-center pt-20">
                    <p className="text-white text-[54px] font-bold leading-[54px]">
                        수술 고객 선택
                    </p>
                    <div className="flex w-full pt-[66px] gap-x-5">
                        <div className="flex w-full max-w-[580px] min-h-[1200px] h-full bg-[rgba(58,62,89,0.25)] rounded-[15px] pl-5 pr-[25px] pt-[42px]">
                            <TimeLine />
                        </div>
                        <div className="flex flex-col w-full max-w-[300px] gap-y-5">
                            {/* 병원 리스트 */}
                            <div
                                className={`flex flex-col w-full h-full gap-y-[10px] transition-all duration-300 ease-in-out bg-[rgba(58,62,89,0.25)] rounded-[15px] px-[15px] py-[15px]
                                    ${
                                        isHospitalExpand
                                            ? "max-h-[420px] overflow-auto"
                                            : "max-h-[100px] overflow-hidden"
                                    }
                                    `}
                            >
                                {hospitales.map((h) => (
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
                                {doctors?.map((d) => {
                                    return (
                                        <div
                                            key={d?.id}
                                            className={`flex relative w-[270px] h-[100px] text-white pt-[10px] px-5 bg-[rgba(58,62,89,0.25)] rounded-[10px]
                                                ${
                                                    doctorId === d?.id &&
                                                    "border-[4px] border-solid border-[#15CF8F] box-border"
                                                }
                                                `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDoctorId(d?.id);
                                            }}
                                        >
                                            <img
                                                src={d?.img}
                                                className="absolute w-[60px] h-[90px]"
                                            />
                                            <div className="flex flex-col pl-[85px] pt-[15px] gap-y-[13px]">
                                                <p className="text-[22px] font-bold leading-[22px]">
                                                    {d?.name}{" "}
                                                    <span className="font-[250]">
                                                        원장
                                                    </span>
                                                </p>
                                                <p className="text-[14px] font-light leading-[14px]">
                                                    오늘 수술:
                                                    <span className="text-[16px] font-bold mx-1">
                                                        {d?.count}
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
        </>
    );
};

export default ModalSelecOpe;

// 병원 리스트 데이터
const hospitales: HospitalType[] = [
    { id: 0, name: "서울" },
    { id: 1, name: "인천" },
    { id: 2, name: "대전" },
    { id: 3, name: "대구" },
    { id: 4, name: "부산" },
];

type HospitalType = {
    id: number;
    name: string;
};

// 의사
const doctors: DoctorType[] = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name:
        i === 0 ? "홍성훈" : i === 1 ? "송병철" : i === 2 ? "김현주" : "박윤찬",
    count: i + 1,
    img: "/images/mini-doctor.png",
}));
type DoctorType = {
    id: number;
    name: string;
    count: number;
    img: string;
};
