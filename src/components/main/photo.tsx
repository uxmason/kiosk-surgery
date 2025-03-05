"use client";
import { formatDateToYYMMDD } from "@/function";
import { imgThumbUrl } from "@/variables";
import { useEffect, useState } from "react";
interface ImageItem {
    idx: number;
    filename: string;
}
interface ImgItemPack {
    regdate: string;
    image: ImageItem[];
}
interface Props {
    setModalImgsOpen: (v: boolean) => void;
    imgs: ImgItemPack[];
    isPaired: boolean;
    lastRegDate: string;
}
const Photo = ({ setModalImgsOpen, imgs, isPaired, lastRegDate }: Props) => {
    const allImages = imgs?.flatMap((imgPack) => imgPack?.image);
    const limitedImages = Array.from(
        { length: 15 },
        (_, index) => allImages?.[index] || null
    );
    const [randomOpacities, setRandomOpacities] = useState<number[]>([]);

    useEffect(() => {
        const newOpacities = limitedImages?.map(() =>
            Math?.floor(Math?.random() * 101)
        );
        setRandomOpacities(newOpacities);
    }, [imgs]);

    return (
        <button
            className="flex flex-col  text-start bg-[#169B7C] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setModalImgsOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                사진
            </p>
            {imgs && imgs?.length > 0 && lastRegDate && isPaired ? (
                <>
                    <div className="relative w-full h-[99px] max-h-[99px] grid grid-cols-5 mt-9">
                        {limitedImages.map((img, i) => (
                            <div key={i}>
                                <div
                                    className="absolute w-[33px] h-[33px] bg-[#343a40]"
                                    style={{
                                        opacity: `${randomOpacities?.[i]}%`,
                                    }}
                                />
                                <div
                                    className="w-[33px] h-[33px]"
                                    style={{
                                        background: `url(${imgThumbUrl}/${img?.filename.slice(
                                            4
                                        )})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex w-full justify-between items-center pt-[26px]">
                        <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                            <svg className="w-5 h-5 text-[#169B7C]">
                                <use href="/assets/sprite.svg#icon-search"></use>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold leading-[14px] text-[10px]">
                                최종촬영:{" "}
                                <span className="text-[14px] pl-[1px]">
                                    {formatDateToYYMMDD(lastRegDate)}
                                </span>
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-start pt-[21px]">
                    <p className="text-white text-[24px] font-bold leading-8">
                        (없음)
                    </p>
                </div>
            )}
        </button>
    );
};
export default Photo;
