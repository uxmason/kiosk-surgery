"use client";
import { parseCannulType } from "@/parse";
import { CannulaType } from "@/type";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useState } from "react";
interface Props {
    setIsOpenAddCannualModal: (v: boolean) => void;
}
const Cannulas = ({ setIsOpenAddCannualModal }: Props) => {
    const [isCannulaId, setIsCannulaId] = useState(0);
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
                        {cannulas?.map((c, index) => (
                            <SwiperSlide
                                key={index}
                                className="w-full max-w-[235px]"
                            >
                                <button
                                    className={`flex flex-col text-start w-[235px] h-[285px] px-[30px] py-[30px]  rounded-[15px]
                                        ${
                                            isCannulaId === c?.id
                                                ? "outline-[5px] outline-[#15CF8F] bg-[#3A3E59]"
                                                : "bg-[rgba(58,62,89,0.50)]"
                                        }
                                        `}
                                    onClick={() => setIsCannulaId(c?.id)}
                                >
                                    <p className="text-white text-[24px] font-bold leading-6">
                                        {c.name}
                                    </p>
                                    <p className="text-white text-[20px] font-light leading-5 pt-[21px]">
                                        {c.hole}H / {c.length}cm / {c.thickness}
                                        mm
                                    </p>
                                    <div className="flex flex-col pt-[50px] gap-y-[10px]">
                                        {c?.type?.map((ct, ctIdx) => {
                                            const color = parseCannulType(
                                                ct?.type
                                            ).color;
                                            return (
                                                <div
                                                    key={ctIdx}
                                                    style={{
                                                        backgroundColor: `${color}33`,
                                                    }}
                                                    className="w-fit py-[15px] px-[15px] rounded-[10px]"
                                                >
                                                    <p
                                                        style={{
                                                            color: color,
                                                            opacity: 1,
                                                        }}
                                                        className="text-[20px] font-light leading-5"
                                                    >
                                                        {
                                                            parseCannulType(
                                                                ct?.type
                                                            ).text
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};
export default Cannulas;

const cannulas: Cannula[] = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: "메르세데스",
    hole: 2,
    length: 45,
    thickness: 6,
    type:
        (i + 1) % 2 === 0
            ? [{ type: "CURVE" }, { type: "CANCAVE" }]
            : [{ type: "BLUNT" }, { type: "LINE" }],
}));

type Cannula = {
    id: number;
    name: string;
    hole: number;
    length: number;
    thickness: number;
    type: CannulaType[];
};
