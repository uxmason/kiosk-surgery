"use client";

import { useClientStore, useDoctorStore, useStore } from "@/store";
import { useRouter } from "next/navigation";

interface OpeInfoItem {
    담당의ID: string;
    담당의명: string;
    수술부위: string;
    시작시간: string;
    수술코드: string;
    고객번호: string;
    고객명: string;
    주민번호: string;
}

interface Props {
    text: string;
    bg: string;
    isShow: boolean;
    isShowBtnText?: string;
    path?: string | undefined;
    setIsModalComplete?: (v: boolean) => void;
    isPaired?: boolean;
    dataOpeInfo: OpeInfoItem[];
    status: number;
}
const CustomBtn = ({
    text,
    bg,
    isShow,
    isShowBtnText,
    path,
    setIsModalComplete,
    isPaired,
    dataOpeInfo,
    status,
}: Props) => {
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const router = useRouter();
    const buttonStyle = {
        backgroundColor: bg,
    };

    const handleClick = async (btnStatus: number, next: boolean) => {
        console.log("btnStatus", btnStatus);
        if (!isPaired || dataOpeInfo?.length == 0) return;
        console.log('aa');
        if (path) {
            const url = `/api/kiosk-surgery/changeDevice/`;
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        deviceID: deviceId,
                        userID: doctor.id,
                        psEntry: client.psEntry,
                        part: client.part,
                        opCode: client.opeCode,
                        status: btnStatus,
                        forced: false,
                    }),
                });
        console.log('aa', response);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        if (next) {
                            router.push(path);
                        } else {
                            if (status === 0) {
                                router.push("/");
                                return;
                            }
                            router.back();
                        }
                    }
                } else {
                    console.error("API 호출 실패", response.status);
                }
            } catch (error) {
                console.error("에러 발생", error);
            }
        } else {
            setIsModalComplete?.(true);
        }
    };

    return (
        <div className="flex w-full">
            {isShow && (
                <button
                    className="flex items-center justify-between w-full max-w-[340px] rounded-[15px] bg-[rgba(255,255,255,0.25)] px-[35px] mr-5"
                    onClick={() => handleClick(status - 2, false)}
                >
                    <div className="flex items-center justify-center bg-[rgba(255,255,255,0.75)] w-12 h-12 rounded-full">
                        <img
                            src="/assets/left-arrow.svg"
                            width={22}
                            height={24}
                        />
                    </div>
                    <p className="text-white text-[32px] font-bold leading-8">
                        {isShowBtnText}
                    </p>
                </button>
            )}
            <button
                style={buttonStyle}
                className={`w-full min-w-[680px] h-[120px] rounded-[15px]`}
                onClick={() => handleClick(status, true)}
            >
                <p className="text-white text-[32px] font-bold leading-[32px]">
                    {text}
                </p>
            </button>
        </div>
    );
};
export default CustomBtn;
