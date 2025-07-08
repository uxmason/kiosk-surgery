/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ClientInfoForModal, CustomModal } from "../common";
import { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import { imgOriginalUrl, imgThumbUrl } from "@/variables";
import { ImgsType, ImgType } from "@/type";

interface Props {
    isModalImgsOpen: boolean;
    setModalImgsOpen: (v: boolean) => void;
    imgs: ImgsType[];
}

const ModalImgs = ({ isModalImgsOpen, setModalImgsOpen, imgs }: Props) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
        null
    );
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [currentImgs, setCurrentImgs] = useState<ImgsType[]>([]);
    const [hasInitialized, setHasInitialized] = useState(false);

    const regDates = imgs?.map((v) => v?.regdate) ?? [];

    const isFewSlides = regDates.length <= 3;

    useEffect(() => {
        if (imgs && imgs.length === 0) {
            setCurrentImgs([]);
        } else {
            setCurrentImgs(imgs?.filter((_, i) => i === currentDateIndex));
        }
    }, [imgs, currentDateIndex]);

    useEffect(() => {
        if (!swiperInstance || regDates.length < 2 || hasInitialized) return;
        if (isModalImgsOpen) {
            swiperInstance.slideTo(regDates.length - 2, 0);
            setCurrentDateIndex(regDates.length - 1);
            setHasInitialized(true);
        } else {
            setCurrentDateIndex(0);
            setHasInitialized(false);
        }
    }, [swiperInstance, regDates, hasInitialized, isModalImgsOpen]);

    return (
        <CustomModal
            isOpen={isModalImgsOpen}
            top={1300}
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
                        {currentImgs?.[0]?.image?.map(
                            (v: ImgType, i: number) => (
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
                            )
                        )}
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
                            centeredSlides={false}
                        >
                            {currentImgs?.[0]?.image?.map(
                                (f: any, i: number) => (
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
                                                currentImgIndex === i
                                                    ? "border-[3px] border-solid border-[#15CF8F]"
                                                    : ""
                                            } object-cover w-[95px] h-[95px] rounded-[10px]`}
                                            onClick={(e) => e.stopPropagation()}
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    "/assets/지방이.jpg")
                                            }
                                        />
                                    </SwiperSlide>
                                )
                            )}
                        </Swiper>
                    </div>
                    <div className="flex w-full h-[135px] px-[25px] bg-[rgba(58,62,89,0.15)] backdrop-blur-[20px] rounded-[15px]">
                        <Swiper
                            onSwiper={setSwiperInstance}
                            spaceBetween={20}
                            centeredSlides={true}
                            slidesPerView="auto"
                            className="overflow-y-scroll h-full w-full flex items-center"
                            allowTouchMove={!isFewSlides}
                            onSlideChange={(swiper) => {
                                if (isFewSlides) return;

                                const centerIndex = swiper.activeIndex;
                                const targetIndex =
                                    centerIndex + 1 < regDates.length
                                        ? centerIndex + 1
                                        : centerIndex;
                                setCurrentDateIndex(targetIndex);
                            }}
                        >
                            {regDates?.map((d, i) => (
                                <SwiperSlide
                                    key={i}
                                    className="flex justify-center pt-5"
                                    style={{
                                        width: "190px",
                                        height: "95px",
                                    }}
                                >
                                    <button
                                        className={`flex flex-col shrink-0 items-start w-[190px] h-[95px] bg-[rgba(255,255,255,0.05)] rounded-[10px] py-[15px] px-[25px] gap-y-[14px] border-[3px] border-solid
            ${
                i === currentDateIndex
                    ? "border-[#15CF8F]"
                    : "border-[rgba(255,255,255,0.15)]"
            }
          `}
                                        onClick={() => {
                                            if (
                                                swiperInstance &&
                                                !isFewSlides
                                            ) {
                                                const safeIndex =
                                                    i - 1 < 0 ? 0 : i - 1;
                                                swiperInstance.slideTo(
                                                    safeIndex
                                                );
                                            }
                                            setCurrentDateIndex(i);
                                        }}
                                    >
                                        <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                                            촬영일
                                        </p>
                                        <p className="text-white text-[24px] font-bold leading-6">
                                            {d}
                                        </p>
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};

export default ModalImgs;
