import { formatTime } from "@/function";
import { OpeClientType } from "@/type";
import { useEffect, useState } from "react";
interface Props {
    isOpeInfo: OpeClientType[];
}
const ReservationInfo = ({ isOpeInfo }: Props) => {
    const info = isOpeInfo?.[0];
    const [isOpeName, setIsOpeName] = useState("");
    const [isContents, setIsContents] = useState<ContentType[]>([]);

    useEffect(() => {
        const contents: ContentType[] = [
            { name: "시작시간", content: formatTime(info?.시작시간) },
            { name: "종료시간", content: formatTime(info?.종료시간) },
            {
                name: "예상시간",
                content: info?.예상시간 ? `${info?.예상시간}시간` : ".",
            },
            {
                name: "추가시간",
                content: info?.추가시간 ? `${info?.추가시간}시간` : "0시간",
            },
            { name: "수술기수", content: info?.기수 },
            { name: "병실", content: info?.병실 ? info?.병실 : "." },
            {
                name: "참관여부",
                content: info?.참관구분 ? info?.참관구분 : ".",
            },
            {
                name: "우선순위",
                content: info?.우선순위여부 ? info?.우선순위여부 : ".",
            },
            {
                name: "이식용지방",
                content: info?.이식용지방 ? info?.이식용지방 : ".",
            },
            {
                name: "통역여부",
                content: info?.통역여부 ? info?.통역여부 : ".",
            },
        ];
        setIsContents(contents);
        setIsOpeName(info?.수술명);
    }, [isOpeInfo]);

    return (
        <div className="flex flex-col w-full h-[310px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] my-5 py-[30px] px-[35px]">
            <p className="text-white text-[24px] font-bold leading-6">
                수술 예약 정보
            </p>
            <p className="text-[#15CF8F] text-[20px] font-bold leading-5 pt-[31px] pb-[35px]">
                {isOpeName}
            </p>
            <div className="grid grid-cols-5 row-end-2 w-full gap-y-[30px]">
                {isContents?.map((c) => {
                    return (
                        <div
                            key={c?.name}
                            className="flex flex-col gap-y-[14px]"
                        >
                            <p className="text-[rgba(255,255,255,0.50)] text-[16px] font-normal leading-4">
                                {c?.name}
                            </p>
                            <p className="text-white text-[20px] font-bold leading-5">
                                {c?.content}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default ReservationInfo;

type ContentType = {
    name: string;
    content: string;
};
