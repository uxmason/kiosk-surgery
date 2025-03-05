"use client";
import { useEffect, useState } from "react";
import { CustomModal } from "../../common";
import { ModalError } from ".";
import { returnDoubleFormatNumber } from "@/function";
import toast from "react-hot-toast";
import { useDoctorStore } from "@/store";

interface SurgeryItem {
    지점코드: string;
    지점명: string;
    시작시간: string;
    종료시간: string;
    고객번호: string;
    수술코드: string;
    담당의ID: string;
    담당의명: string;
    수술부위: string;
    예상시간: number;
    고객명: string;
    주민번호: string;
    추가시간: number | null;
    STATUS: number | null;
}
interface DoctorItem {
    doctorId: string;
    surgeries: SurgeryItem[];
}

interface DataAllOpeItem {
    branch: string;
    branchId: string;
    doctor: DoctorItem[];
}

interface Props {
    isOpen: boolean;
    isOpeOpenNext: boolean;
    setTargetPsEntry: (v: string) => void;
    setOpeOpen: (v: boolean) => void;
    dataAllOpe: DataAllOpeItem[];
    fingerprint: string;
}

const ModalSelecOpe = ({
    isOpen,
    isOpeOpenNext,
    setOpeOpen,
    setTargetPsEntry,
    dataAllOpe,
    fingerprint,
}: Props) => {
    const { doctor } = useDoctorStore();
    const [hospitalIndex, setHospitalIndex] = useState(0);
    const [doctorIndex, setDoctorIndex] = useState(0);
    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const currentTimeHHMM =
        new Date().getHours() +
        "" +
        returnDoubleFormatNumber(new Date().getMinutes());

    useEffect(() => {
        const hospitalIndex = dataAllOpe?.findIndex(
            (h) => h?.branchId === doctor?.branch
        );
        const doctorIdx = dataAllOpe?.[hospitalIndex]?.doctor?.findIndex(
            (d) => d?.doctorId === doctor?.id
        );
        setHospitalIndex(hospitalIndex);
        setDoctorIndex(doctorIdx);
    }, [doctor, dataAllOpe]);

    return (
        <>
            <CustomModal
                isOpen={isOpen}
                onClose={() => {
                    setOpeOpen(false);
                }}
            >
                <div className="flex flex-col w-full items-center">
                    <p className="text-white text-[54px] font-bold leading-[54px] mt-20">
                        수술 고객 선택
                    </p>
                    <div className="flex w-full pt-[66px] gap-x-5">
                        <div className="relative w-full max-w-[580px] min-h-[1200px] h-full bg-[rgba(58,62,89,0.25)] rounded-[15px] pl-5 pr-[25px]">
                            {isOpeOpenNext ? (
                                <>
                                    <div className="absolute w-full h-full max-h-[1200px] mt-[45px]">
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const time = i + 9;
                                            const formatTime =
                                                i === 0
                                                    ? `0${time}:00`
                                                    : `${time}:00`;
                                            return (
                                                <div
                                                    key={time}
                                                    className={`relative flex w-[530px] ${
                                                        i == 11
                                                            ? "h-[50px]"
                                                            : "h-[100px]"
                                                    }`}
                                                >
                                                    <p className="text-white/50 text-[13px] font-bold leading-[13px] w-10">
                                                        {formatTime}
                                                    </p>
                                                    <div className="w-full ml-[10px] mt-[5px] border-t-[1px] border-[white]/20 border-dashed" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {(
                                        dataAllOpe?.[hospitalIndex]?.doctor?.[
                                            doctorIndex
                                        ]?.surgeries ?? []
                                    ).map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`absolute p-[20px] ${
                                                    Number(item.예상시간) <= 1
                                                        ? "py-[10px]"
                                                        : ""
                                                } ${
                                                    item.수술부위 == "가슴"
                                                        ? "bg-[#55DAF222]"
                                                        : item.수술부위 == "팔"
                                                        ? "bg-[#15CF8F22]"
                                                        : item.수술부위 ==
                                                          "복부"
                                                        ? "bg-[#ED6B5B22]"
                                                        : item.수술부위 ==
                                                          "허벅지"
                                                        ? "bg-[#38ABBE22]"
                                                        : item.수술부위 ==
                                                          "얼굴"
                                                        ? "bg-[#F9AC6822]"
                                                        : item.수술부위 ==
                                                          "러브핸들"
                                                        ? "bg-[#F0557922]"
                                                        : item.수술부위 == "힙"
                                                        ? "bg-[#F9AC6822]"
                                                        : item.수술부위 ==
                                                          "종아리"
                                                        ? "bg-[#5B87ED22]"
                                                        : item.수술부위 == "등"
                                                        ? "bg-[#ED8E5B22]"
                                                        : null
                                                } text-white rounded-[15px] left-[75px] w-[470px]`}
                                                style={{
                                                    top:
                                                        60 +
                                                        (Number(
                                                            item.시작시간.substring(
                                                                0,
                                                                2
                                                            )
                                                        ) -
                                                            9) *
                                                            100 +
                                                        (Number(
                                                            item.시작시간.substring(
                                                                2,
                                                                4
                                                            )
                                                        ) /
                                                            60) *
                                                            100 +
                                                        "px",
                                                    height:
                                                        Number(item.예상시간) *
                                                            100 -
                                                        20 +
                                                        "px",
                                                    minHeight:
                                                        Number(item.예상시간) <=
                                                        1
                                                            ? "70px"
                                                            : "90px",
                                                }}
                                            >
                                                <div
                                                    className={`styleSheet absolute w-[50px] h-[50px] rounded-[15px] border-[5px] ${
                                                        item.수술부위 == "가슴"
                                                            ? "border-[#55DAF2]"
                                                            : item.수술부위 ==
                                                              "팔"
                                                            ? "border-[#15CF8F]"
                                                            : item.수술부위 ==
                                                              "복부"
                                                            ? "border-[#ED6B5B]"
                                                            : item.수술부위 ==
                                                              "허벅지"
                                                            ? "border-[#38ABBE]"
                                                            : item.수술부위 ==
                                                              "얼굴"
                                                            ? "border-[#F9AC68]"
                                                            : item.수술부위 ==
                                                              "러브핸들"
                                                            ? "border-[#F05579]"
                                                            : item.수술부위 ==
                                                              "힙"
                                                            ? "border-[#F9AC68]"
                                                            : item.수술부위 ==
                                                              "종아리"
                                                            ? "border-[#5B87ED]"
                                                            : item.수술부위 ==
                                                              "등"
                                                            ? "border-[#ED8E5B]"
                                                            : null
                                                    } bg-no-repeat bg-white`}
                                                    style={{
                                                        backgroundPositionX: `${
                                                            item.수술부위 ==
                                                            "가슴"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "복부"
                                                                ? -55
                                                                : item.수술부위 ==
                                                                  "힙"
                                                                ? -105
                                                                : item.수술부위 ==
                                                                  "허벅지"
                                                                ? -155
                                                                : item.수술부위 ==
                                                                  "종아리"
                                                                ? -205
                                                                : item.수술부위 ==
                                                                  "팔"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "등"
                                                                ? -55
                                                                : item.수술부위 ==
                                                                  "러브핸들"
                                                                ? -105
                                                                : item.수술부위 ==
                                                                  "얼굴"
                                                                ? -155
                                                                : 50
                                                        }px`,
                                                        backgroundPositionY: `${
                                                            item.수술부위 ==
                                                            "가슴"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "복부"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "힙"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "허벅지"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "종아리"
                                                                ? -5
                                                                : item.수술부위 ==
                                                                  "팔"
                                                                ? -55
                                                                : item.수술부위 ==
                                                                  "등"
                                                                ? -55
                                                                : item.수술부위 ==
                                                                  "러브핸들"
                                                                ? -55
                                                                : item.수술부위 ==
                                                                  "얼굴"
                                                                ? -55
                                                                : 50
                                                        }px`,
                                                    }}
                                                ></div>
                                                <div
                                                    className={`ml-[65px] float-left w-[110px]`}
                                                >
                                                    <p
                                                        className={`text-[24px] leading-[24px] ${
                                                            item.수술부위 ==
                                                            "가슴"
                                                                ? "text-[#55DAF2]"
                                                                : item.수술부위 ==
                                                                  "팔"
                                                                ? "text-[#15CF8F]"
                                                                : item.수술부위 ==
                                                                  "복부"
                                                                ? "text-[#ED6B5B]"
                                                                : item.수술부위 ==
                                                                  "허벅지"
                                                                ? "text-[#38ABBE]"
                                                                : item.수술부위 ==
                                                                  "얼굴"
                                                                ? "text-[#F9AC68]"
                                                                : item.수술부위 ==
                                                                  "러브핸들"
                                                                ? "text-[#F05579]"
                                                                : item.수술부위 ==
                                                                  "힙"
                                                                ? "text-[#F9AC68]"
                                                                : item.수술부위 ==
                                                                  "종아리"
                                                                ? "text-[#5B87ED]"
                                                                : item.수술부위 ==
                                                                  "등"
                                                                ? "text-[#ED8E5B]"
                                                                : null
                                                        }`}
                                                    >
                                                        {item.수술부위}
                                                    </p>
                                                    <p
                                                        className={`text-[16px] leading-[24px] font-bold`}
                                                    >
                                                        {item.수술코드}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`float-left w-[150px]`}
                                                >
                                                    <p
                                                        className={`text-[24px] leading-[24px] font-bold`}
                                                    >
                                                        {item.고객명}
                                                    </p>
                                                    <p
                                                        className={`text-[14px] leading-[24px]`}
                                                    >
                                                        {item.고객번호}
                                                    </p>
                                                </div>
                                                {Number(currentTimeHHMM) >=
                                                Number(item.종료시간) ? (
                                                    <p
                                                        className={`float-right w-[100px] bg-[#fff2] h-[50px] rounded-[10px] text-center leading-[50px] font-bold text-[16px]`}
                                                    >
                                                        수술종료
                                                    </p>
                                                ) : item.STATUS == null ||
                                                  item.STATUS == 0 ? (
                                                    <p
                                                        className={`float-right w-[100px] bg-[#15cf8f] h-[50px] rounded-[10px] text-center leading-[50px] font-bold text-[16px]`}
                                                        style={{
                                                            filter: "drop-shadow(0px 4px 40px rgba(21,207,143,.5))",
                                                        }}
                                                        onClick={async () => {
                                                            const url = `/api/kiosk-surgery/schedule/add/`;
                                                            try {
                                                                const response =
                                                                    await fetch(
                                                                        url,
                                                                        {
                                                                            method: "POST",
                                                                            headers:
                                                                                {
                                                                                    "Content-Type":
                                                                                        "application/json",
                                                                                },
                                                                            body: JSON.stringify(
                                                                                {
                                                                                    deviceID:
                                                                                        fingerprint,
                                                                                    userID: dataAllOpe?.[
                                                                                        hospitalIndex
                                                                                    ]
                                                                                        ?.doctor?.[
                                                                                        doctorIndex
                                                                                    ]
                                                                                        ?.surgeries[
                                                                                        index
                                                                                    ]
                                                                                        ?.담당의ID,
                                                                                    opCode: dataAllOpe?.[
                                                                                        hospitalIndex
                                                                                    ]
                                                                                        ?.doctor?.[
                                                                                        doctorIndex
                                                                                    ]
                                                                                        ?.surgeries[
                                                                                        index
                                                                                    ]
                                                                                        ?.수술코드,
                                                                                    psEntry:
                                                                                        dataAllOpe?.[
                                                                                            hospitalIndex
                                                                                        ]
                                                                                            ?.doctor?.[
                                                                                            doctorIndex
                                                                                        ]
                                                                                            ?.surgeries[
                                                                                            index
                                                                                        ]
                                                                                            ?.고객번호,
                                                                                }
                                                                            ),
                                                                        }
                                                                    );
                                                                if (
                                                                    response.ok
                                                                ) {
                                                                    const result =
                                                                        await response.json();
                                                                    if (
                                                                        result.success
                                                                    ) {
                                                                        setTargetPsEntry(
                                                                            result
                                                                                .client
                                                                                .PSENTRY
                                                                        );
                                                                        setOpeOpen(
                                                                            false
                                                                        );
                                                                    } else {
                                                                        toast.error(
                                                                            result.message
                                                                        );
                                                                    }
                                                                } else {
                                                                    console.error(
                                                                        "API 호출 실패",
                                                                        response.status
                                                                    );
                                                                }
                                                            } catch (error) {
                                                                console.error(
                                                                    "에러 발생",
                                                                    error
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        선택하기
                                                    </p>
                                                ) : item.STATUS == 1 ? (
                                                    <p
                                                        className={`float-right w-[100px] bg-[#ED6B5B] h-[50px] rounded-[10px] text-center leading-[50px] font-bold text-[16px]`}
                                                    >
                                                        수술중
                                                    </p>
                                                ) : item.STATUS == 2 ? (
                                                    <p
                                                        className={`float-right w-[100px] bg-[#ED6B5B] h-[50px] rounded-[10px] text-center leading-[50px] font-bold text-[16px]`}
                                                    >
                                                        수술완료
                                                    </p>
                                                ) : item.STATUS == 3 ? (
                                                    <p
                                                        className={`float-right w-[100px] bg-[#5B87ED] h-[50px] rounded-[10px] text-center leading-[50px] font-bold text-[16px]`}
                                                    >
                                                        기록완료
                                                    </p>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <p className="">...</p>
                            )}
                        </div>
                        <div className="flex flex-col w-full max-w-[300px] gap-y-5">
                            <div
                                className={`flex flex-col w-full gap-y-[10px] transition-all duration-300 bg-[rgba(58,62,89,0.25)] rounded-[15px] px-[15px] py-[15px]`}
                            >
                                {dataAllOpe.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center w-[270px] h-[70px] transition-all duration-300 rounded-[10px] py-5 cursor-pointer ${
                                            index == hospitalIndex
                                                ? "border-solid border-[4px] border-[#15CF8F] bg-[#3A3E59] px-[21px]"
                                                : "bg-[rgba(58,62,89,.25)] px-[25px]"
                                        } z-1`}
                                        onClick={() => {
                                            setHospitalIndex(index);
                                        }}
                                    >
                                        <p className="text-white text-[22px] font-bold leading-[30px]">
                                            {item?.["branch"]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div
                                className={`flex flex-col w-full h-full gap-y-[10px] px-[15px] py-[15px] transition-all duration-300 bg-[rgba(58,62,89,0.25)] rounded-[15px]`}
                            >
                                {(dataAllOpe[hospitalIndex]?.doctor ?? []).map(
                                    (item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`flex relative box-border w-[270px] h-[100px] text-white  rounded-[10px] transition-all duration-300 cursor-pointer ${
                                                    doctorIndex == index
                                                        ? "border-solid border-[4px] border-[#15CF8F] bg-[#3A3E59] pt-[6px] px-[6px]"
                                                        : "bg-[rgba(58,62,89,.25)] pt-[10px] px-[10px]"
                                                }`}
                                                onClick={() => {
                                                    setDoctorIndex(index);
                                                }}
                                            >
                                                <div
                                                    className={`absolute isPortrait I${item?.doctorId} h-[90px] w-[61.651px]`}
                                                />
                                                <div className="flex flex-col pl-[85px] pt-[15px] gap-y-[13px]">
                                                    <p className="text-[22px] font-bold leading-[22px]">
                                                        {
                                                            item.surgeries[0]
                                                                .담당의명
                                                        }{" "}
                                                        <span className="font-[250]">
                                                            원장
                                                        </span>
                                                    </p>
                                                    <p className="text-[14px] font-light leading-[14px]">
                                                        오늘 수술:{" "}
                                                        <span className="text-[16px] font-bold mx-1">
                                                            {
                                                                item.surgeries
                                                                    .length
                                                            }
                                                        </span>
                                                        건
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
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
