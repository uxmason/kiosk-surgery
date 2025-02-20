"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";

interface Props {
    isFirstOpen: boolean;
    isSecondOpen: boolean;
    setIsFirstOpen: (v: boolean) => void;
}
const serverDates = ["2025-01-21", "2025-01-22", "2025-01-23"];
const FirstImgs = ({ isFirstOpen, isSecondOpen, setIsFirstOpen }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        setCurrentDateIndex(serverDates?.length - 1);
    }, []);

    return (
        <>
            <div className="flex w-full gap-x-5 pt-5">
                {isFirstOpen ? (
                    <>
                        <div className="flex flex-col w-[885px] gap-y-5">
                            <Swiper
                                className="flex w-full overflow-hidden"
                                spaceBetween={10}
                                navigation
                                thumbs={{
                                    swiper:
                                        thumbsSwiper && !thumbsSwiper.destroyed
                                            ? thumbsSwiper
                                            : null,
                                }}
                                modules={[Thumbs]}
                                onSlideChange={({ activeIndex }) =>
                                    setCurrentImgIndex(activeIndex)
                                }
                            >
                                {Array.from({ length: 7 }, (_, i) => {
                                    return (
                                        <SwiperSlide
                                            key={i}
                                            className="flex flex-col h-[95px] items-center justify-center"
                                        >
                                            <img
                                                src="/images/client.png"
                                                width={885}
                                                height={565}
                                                className="object-cover"
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="flex w-full">
                                {isSecondOpen && (
                                    <button
                                        className="flex justify-center items-center bg-[rgba(58,62,89,0.50)] w-full max-w-[135px] h-[135px] rounded-[15px] mr-[23px]"
                                        onClick={() => setIsFirstOpen(false)}
                                    >
                                        <img
                                            src="/assets/close.svg"
                                            width={64}
                                            height={64}
                                            className="scale-150"
                                        />
                                    </button>
                                )}
                                <div className="flex items-center justify-center w-full h-[135px] py-5 gap-x-5 bg-[rgba(58,62,89,0.15)] rounded-[15px]">
                                    {serverDates?.map((_, i) => {
                                        return (
                                            <button
                                                key={i}
                                                className={`flex flex-col items-start w-[190px] bg-[rgba(255,255,255,0.05);] rounded-[10px] py-[15px] px-[25px] gap-y-[14px] border-[3px] border-solid
                                            ${
                                                i === currentDateIndex
                                                    ? "border-[#15CF8F]"
                                                    : "border-[rgba(255,255,255,0.15)]"
                                            }
                                            `}
                                                onClick={() =>
                                                    setCurrentDateIndex(i)
                                                }
                                            >
                                                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                                                    촬영일
                                                </p>
                                                <p className="text-white text-[24px] font-bold leading-6">{`2025-01-2${
                                                    i + 1
                                                }`}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col h-[720px] w-[135px] py-5 px-5 bg-[rgba(58,62,89,0.15)] rounded-[15px] overflow-y-scroll">
                            <Swiper
                                watchSlidesProgress
                                onSwiper={setThumbsSwiper}
                                modules={[Thumbs]}
                                direction="vertical"
                                className="overflow-y-scroll h-full"
                                spaceBetween={10}
                                slidesPerView={6.5}
                            >
                                {Array.from({ length: 7 }, (_, i) => {
                                    return (
                                        <SwiperSlide
                                            style={{ height: 95 }}
                                            key={i}
                                            className="h-[95px] flex items-center justify-center"
                                        >
                                            <img
                                                src="/images/client.png"
                                                width={95}
                                                height={95}
                                                className={`${
                                                    currentImgIndex === i &&
                                                    "border-[3px] border-solid border-[#15CF8F]"
                                                } object-cover w-[95px] h-[95px] aspect-square rounded-[10px]`}
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    </>
                ) : (
                    <button
                        className="flex justify-center items-center rounded-[15px] w-full h-[275px] bg-[rgba(58,62,89,0.15)]"
                        onClick={() => setIsFirstOpen(true)}
                    >
                        <img src="/assets/add.svg" width={64} height={64} />
                    </button>
                )}
            </div>
        </>
    );
};
export default FirstImgs;
