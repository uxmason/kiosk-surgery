"use client";
import { parseCannulShapeType, parseCannulTipType } from "@/parse";
import { CannulaListType } from "@/type";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useState } from "react";
import { getFormattedDate, removeSpace } from "@/function";
import { useClientStore, useStore } from "@/store";
interface Props {
    setIsOpenAddCannualModal: (v: boolean) => void;
    cannulaInSurgeryList: CannulaListType[];
}
const Cannulas = ({
    setIsOpenAddCannualModal,
    cannulaInSurgeryList,
}: Props) => {
    const today = getFormattedDate();
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const [selectedCannulaIds, setSelectedCannulaIds] = useState<string[]>([]);
    const [isCurrentCannulaId, setIsCurrentCannulaId] = useState("");
    const handleSelectCannula = (id: string) => {
        const data: DataType = {
            deviceId: deviceId,
            cannulaID: isCurrentCannulaId,
            psEntry: client?.psEntry,
            opDate: today,
        };

        if (selectedCannulaIds?.includes(id)) {
            handleInDirectDeleteCannula(data).then((res) => {
                if (res.success) {
                    console.log(res);
                } else {
                    console.log(res);
                }
            });
        } else {
            handleDirectAddCannula(data).then((res) => {
                if (res.success) {
                    console.log(res);
                } else {
                    console.log("FAIL_CANNULA_ DIRECTADD");
                }
            });
        }
        setSelectedCannulaIds((prev) =>
            prev?.includes(id)
                ? prev?.filter((cId) => cId !== id)
                : [...prev, id]
        );
    };

    const handleDirectAddCannula = async (data: DataType) => {
        const url = `/api/kiosk-surgery/cannula/direct-add/`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
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

    const handleInDirectDeleteCannula = async (data: DataType) => {
        const url = `/api/kiosk-surgery/cannula/in-direct-delete/`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
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
        <div className="flex flex-col w-full pt-10">
            <div className="flex px-5 items-end justify-between">
                <p className="text-white text-[32px] font-bold leading-8 pb-3">
                    {`"사용한 `}
                    <span className="text-[#15CF8F]">캐뉼라</span>
                    {` 툴을 선택해주세요."`}
                </p>
                <button
                    className="w-[235px] h-[95px] bg-[#15CF8F] rounded-[15px]"
                    onClick={() => setIsOpenAddCannualModal(true)}
                >
                    <p className="text-white text-[28px] font-bold leading-7">
                        신규 툴 등록
                    </p>
                </button>
            </div>
            <div className="relative pt-6 w-full">
                <div className="absolute swiper-button-prev left-[-2.5%] top-[50%] transform -translate-y-[50%] w-[85px] h-[85px] bg-[rgba(0,0,0,0.15)] rounded-full flex items-center justify-center cursor-pointer z-10">
                    <img src="/assets/swiper-prev.svg" width={24} height={24} />
                </div>
                <div className="absolute swiper-button-next right-[-2.5%] top-[50%] transform -translate-y-[50%] w-[85px] h-[85px] bg-[rgba(0,0,0,0.15)] rounded-full flex items-center justify-center cursor-pointer z-10">
                    <img src="/assets/swiper-next.svg" width={24} height={24} />
                </div>
                <div className="flex px-5 w-full">
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={20}
                        modules={[Navigation]}
                        style={{
                            padding: 20,
                        }}
                        className="flex w-[1040px] h-[325px] bg-[rgba(58,62,89,0.15)] rounded-[10px]"
                        navigation={{
                            prevEl: ".swiper-button-prev",
                            nextEl: ".swiper-button-next",
                        }}
                    >
                        {cannulaInSurgeryList?.map((c, index) => {
                            const tipColor = parseCannulTipType(
                                removeSpace(c?.TIP) as
                                    | "사선형"
                                    | "블런트형"
                                    | "샤프형"
                            )?.color;
                            const shapeColor = parseCannulShapeType(
                                c?.SHAPE as "직선형" | "컨케이브"
                            )?.color;
                            return (
                                <SwiperSlide
                                    key={index}
                                    className="w-full max-w-[235px]"
                                >
                                    <button
                                        className={`flex flex-col text-start w-[235px] h-[285px] px-[30px] py-[30px]  rounded-[15px]
                                        ${
                                            selectedCannulaIds.includes(
                                                c?.CANNULA_ID
                                            )
                                                ? "outline-[5px] outline-[#15CF8F] bg-[#3A3E59]"
                                                : "bg-[rgba(58,62,89,0.50)]"
                                        }
                                        `}
                                        onClick={() => {
                                            setIsCurrentCannulaId(
                                                c?.CANNULA_ID
                                            );
                                            handleSelectCannula(c?.CANNULA_ID);
                                        }}
                                    >
                                        <p className="text-white text-[24px] font-bold leading-6">
                                            {c?.MODEL_NAME}
                                        </p>
                                        <p className="text-white text-[20px] font-light leading-5 pt-[21px]">
                                            {c?.갯수}H /{" "}
                                            {Number(c?.LENGTH) / 10}cm /{" "}
                                            {c?.THICKNESS}
                                            mm
                                        </p>
                                        <div className="flex flex-col pt-[50px] gap-y-[10px]">
                                            <div
                                                style={{
                                                    backgroundColor: `${tipColor}33`,
                                                }}
                                                className="w-fit py-[15px] px-[15px] rounded-[10px]"
                                            >
                                                <p
                                                    style={{
                                                        color: tipColor,
                                                        opacity: 1,
                                                    }}
                                                    className="text-[20px] font-light leading-5"
                                                >
                                                    {c?.TIP}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    backgroundColor: `${shapeColor}33`,
                                                }}
                                                className="w-fit py-[15px] px-[15px] rounded-[10px]"
                                            >
                                                <p
                                                    style={{
                                                        color: shapeColor,
                                                        opacity: 1,
                                                    }}
                                                    className="text-[20px] font-light leading-5"
                                                >
                                                    {c?.SHAPE}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};
export default Cannulas;

type DataType = {
    deviceId: string;
    cannulaID: string;
    psEntry: string;
    opDate: string;
};
