"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import { PhotsArrType } from "@/type";
import { imgOriginalUrl, imgThumbUrl } from "@/variables";

interface Props {
    isFirstOpen: boolean;
    isSecondOpen: boolean;
    setIsSecondOpen: (v: boolean) => void;
    imgs: PhotsArrType[];
}
const SecondImgs = ({
    isFirstOpen,
    isSecondOpen,
    setIsSecondOpen,
    imgs,
}: Props) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
        null
    );
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const dates = imgs?.map((v) => v?.regdate);
    const selectedImgs = imgs?.[currentDateIndex]?.image;

    useEffect(() => {
        if (!swiperInstance || currentDateIndex === undefined) return;

        const totalSlides = swiperInstance.slides.length;
        const slidesPerView = swiperInstance.params.slidesPerView as number;

        let targetIndex = currentDateIndex;

        // 조건 1: 3개 이하일 때는 1번 인덱스를 가운데로
        if (totalSlides <= 3) {
            targetIndex = 1;
        }
        // 조건 2: 맨 처음 인덱스
        else if (swiperInstance.isBeginning) {
            targetIndex = 0;
        }
        // 조건 3: 맨 마지막 인덱스
        else if (swiperInstance.isEnd) {
            targetIndex = totalSlides - slidesPerView;
        }

        // 범위 밖 보호
        if (targetIndex < 0) targetIndex = 0;

        swiperInstance.slideTo(targetIndex, 300); // 300ms 애니메이션
    }, [currentDateIndex, swiperInstance]);

    useEffect(() => {
        setCurrentDateIndex(imgs?.length - 1);
    }, [imgs]);
    return (
        <>
            <div className="flex w-full h-fit gap-x-5 pt-5 px-5">
                {isSecondOpen ? (
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
                                {selectedImgs?.map((img, imgIdx) => {
                                    return (
                                        <SwiperSlide
                                            key={imgIdx}
                                            className="flex flex-col h-[95px] items-center justify-center"
                                        >
                                            <img
                                                src={`${imgOriginalUrl}/${img?.filename?.slice(
                                                    4
                                                )}`}
                                                width={885}
                                                height={565}
                                                className="object-cover w-[885px] h-[565px] rounded-[15px] aspect-[885/565]"
                                            />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className="flex w-full">
                                {isSecondOpen && isFirstOpen && (
                                    <button
                                        className="flex justify-center items-center bg-[rgba(58,62,89,0.50)] w-full max-w-[135px] h-[135px] rounded-[15px] mr-[23px]"
                                        onClick={() => setIsSecondOpen(false)}
                                    >
                                        <img
                                            src="/assets/close.svg"
                                            width={64}
                                            height={64}
                                            className="scale-150"
                                        />
                                    </button>
                                )}
                                <Swiper
                                    onSwiper={setSwiperInstance}
                                    spaceBetween={20}
                                    centeredSlides={true}
                                    slidesPerView="auto"
                                    className="flex w-full h-[135px] py-5 bg-[rgba(58,62,89,0.15)] rounded-[15px]"
                                    onSlideChange={() =>
                                        setCurrentDateIndex(currentDateIndex)
                                    }
                                >
                                    {dates?.map((d, i) => {
                                        return (
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
                                                    onClick={() =>
                                                        setCurrentDateIndex(i)
                                                    }
                                                >
                                                    <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                                                        촬영일
                                                    </p>
                                                    <p className="text-white text-[24px] font-bold leading-6">
                                                        {d}
                                                    </p>
                                                </button>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
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
                                {selectedImgs?.map((thumb, thumdIdx) => {
                                    return (
                                        <SwiperSlide
                                            style={{ height: 95 }}
                                            key={thumdIdx}
                                            className="h-[95px] flex items-center justify-center"
                                        >
                                            <img
                                                src={`${imgThumbUrl}/${thumb?.filename?.slice(
                                                    4
                                                )}`}
                                                width={95}
                                                height={95}
                                                className={`${
                                                    currentImgIndex ===
                                                        thumdIdx &&
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
                        onClick={() => setIsSecondOpen(true)}
                    >
                        <img src="/assets/add.svg" width={64} height={64} />
                    </button>
                )}
            </div>
        </>
    );
};
export default SecondImgs;
