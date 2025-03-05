/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ClientInfoForModal, CustomModal } from "../common";
import { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import { imgOriginalUrl, imgThumbUrl } from "@/variables";

interface Props {
    isModalImgsOpen: boolean;
    setModalImgsOpen: (v: boolean) => void;
    imgs: never[];
}

const ModalImgs = ({ isModalImgsOpen, setModalImgsOpen, imgs }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [currentImgs, setCurrentImgs] = useState([]);

    const regDates = imgs?.map((v: any) => v?.regdate);

    useEffect(() => {
        if (imgs && imgs.length === 0) return;
        setCurrentDateIndex(imgs?.length - 1);
    }, [imgs]);

    useEffect(() => {
        setCurrentImgs(
            imgs?.filter((_, i) => i === currentDateIndex)?.[0]?.["image"]
        );
    }, [imgs, currentDateIndex]);

    return (
        <CustomModal
            isOpen={isModalImgsOpen}
            onClose={() => setModalImgsOpen(false)}
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
                        {currentImgs?.map((v: any, i: number) => {
                            return (
                                <SwiperSlide
                                    key={i}
                                    className="flex flex-col h-[95px] items-center justify-center"
                                >
                                    <img
                                        src={`${imgOriginalUrl}/${String(
                                            v?.filename
                                        )?.slice(4)}`}
                                        width={885}
                                        height={565}
                                        className="w-[885px] h-[565px] aspect-[885/565] object-cover rounded-[15px]"
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
                            className="overflow-y-scroll h-full w-full flex items-center"
                            spaceBetween={10}
                            slidesPerView={8}
                            centeredSlides={currentImgs?.length < 8}
                        >
                            {currentImgs?.map((f: any, i: number) => {
                                return (
                                    <SwiperSlide
                                        style={{ height: 95 }}
                                        key={i}
                                        className="h-[95px] w-[95px] flex items-center justify-center"
                                    >
                                        <img
                                            src={`${imgThumbUrl}/${String(
                                                f?.filename
                                            )?.slice(4)}`}
                                            width={95}
                                            height={95}
                                            className={`${
                                                currentImgIndex === i &&
                                                "border-[3px] border-solid border-[#15CF8F]"
                                            } object-cover w-[95px] h-[95px] rounded-[10px]`}
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
                        {regDates?.map((r, i) => {
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
                                    <p className="text-white text-[24px] font-bold leading-6">
                                        {r}
                                    </p>
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
