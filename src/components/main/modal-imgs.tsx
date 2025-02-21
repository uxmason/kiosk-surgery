"use client";
import { ClientInfoForModal, CustomModal } from "../common";
import { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";

interface Props {
    isModalImgsOpen: boolean;
    setIsModalImgsOpen: (v: boolean) => void;
}

const serverDates = ["2025-01-21", "2025-01-22", "2025-01-23"];
const ModalImgs = ({ isModalImgsOpen, setIsModalImgsOpen }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        setCurrentDateIndex(serverDates?.length - 1);
    }, []);

    return (
        <CustomModal
            isOpen={isModalImgsOpen}
            onClose={() => setIsModalImgsOpen(false)}
        >
            <div className="flex flex-col w-full h-full items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    고객 사진 뷰어
                </p>
                <ClientInfoForModal />
                <div className="flex flex-col w-[885px] gap-y-5 pt-5">
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
                        {Array.from({ length: 9 }, (_, i) => {
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
                    <div className="flex py-5 px-[25px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] overflow-y-scroll">
                        <Swiper
                            watchSlidesProgress
                            onSwiper={setThumbsSwiper}
                            modules={[Thumbs]}
                            direction="horizontal"
                            className="overflow-y-scroll h-full"
                            spaceBetween={10}
                            slidesPerView={8}
                        >
                            {Array.from({ length: 9 }, (_, i) => {
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
                                            onClick={(e) => e.stopPropagation()}
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    "/assets/지방이.jpg")
                                            }
                                        />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                    <div className="flex items-center justify-center w-full h-[135px] backdrop-blur-[20px] py-5 gap-x-5 bg-[rgba(58,62,89,0.25)] rounded-[15px]">
                        {serverDates?.map((_, i) => {
                            return (
                                <button
                                    key={i}
                                    className={`flex flex-col items-start w-[190px] rounded-[10px] py-[15px] px-[25px] gap-y-[14px] 
                                            ${
                                                i === currentDateIndex
                                                    ? "bg-[#3A3E59] border-[#15CF8F] border-[3px] border-solid"
                                                    : "bg-[rgba(255,255,255,0.1)]"
                                            }
                                            `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentDateIndex(i);
                                    }}
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
        </CustomModal>
    );
};
export default ModalImgs;
