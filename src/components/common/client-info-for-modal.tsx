import { handleBirthToAge } from "@/function";
import { parseOpePart, parseSexType } from "@/parse";
import { useClientStore, useDoctorStore } from "@/store";
import { OpeClientType } from "@/type";
import { useEffect, useState } from "react";

const ClientInfoForModal = () => {
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);

    // 수술 고객 정보
    const onHandleSelectOpe = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery/client?doctorId=${doctor?.id}&psEntry=${client?.psEntry}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const info = isOpeInfo?.[0];
    const isPsEntry = info?.고객번호;
    const isClientName = info?.고객명;
    const isSex =
        info?.주민번호?.slice(8, 9) === "2" ||
        info?.주민번호?.slice(8, 9) === "4"
            ? "F"
            : "M";
    const isAge = handleBirthToAge(info?.주민번호);
    const isOpeCode = info?.수술코드;

    const isPart = info?.["수술부위"];
    const engPart =
        isPart === "허벅지"
            ? "THIGH"
            : isPart === "팔"
            ? "ARM"
            : isPart === "복부"
            ? "ABDOMEN"
            : isPart === "등"
            ? "BACK"
            : isPart === "러브핸들"
            ? "LOVEHANDLE"
            : isPart === "엉덩이"
            ? "HIP"
            : isPart === "얼굴"
            ? "FACE"
            : "CALVES";

    // 수술 고객 정보 담기
    useEffect(() => {
        if (!client || !doctor) return;
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                console.log("!#!@");
            }
        });
    }, [client, doctor]);
    return (
        <div className="flex justify-between w-full h-[135px] mt-[66px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] pt-[30px] pb-[41px] px-[35px] rounded-[15px]">
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객번호
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {isPsEntry}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객명
                </p>
                <p className="text-white text-[32px] font-light leading-6">
                    {isClientName}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    성별
                </p>
                <p
                    style={{
                        color: parseSexType(isSex).color,
                    }}
                    className="text-[24px] font-bold leading-6"
                >
                    {parseSexType(isSex)?.text}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    나이
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {isAge}세
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    부위
                </p>
                <p
                    style={{
                        color: parseOpePart(engPart).color,
                    }}
                    className="text-[32px] font-light leading-6"
                >
                    {parseOpePart(engPart).text}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    수술코드
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {isOpeCode}
                </p>
            </div>
        </div>
    );
};
export default ClientInfoForModal;
