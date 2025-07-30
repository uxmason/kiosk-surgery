"use client";

import { updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { OpeInfoItem } from "@/type";
import { useRouter } from "next/navigation";

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
    setIsErrorOpen?: (v: string) => void;
    setIsRemoveClient?: (v: boolean) => void;
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
    setIsErrorOpen,
    setIsRemoveClient,
}: Props) => {
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const router = useRouter();
    const buttonStyle = {
        backgroundColor: bg,
    };
    const handleClick = async (btnStatus: number, next: boolean) => {
        if (!isPaired || dataOpeInfo?.length === 0) return;
        if (btnStatus === 4) {
            return setIsModalComplete?.(true);
        }
        if (btnStatus === 1) {
            const opeDate = client?.opeDate;
            const opeTime = client?.opeTime;
            const now = new Date();
            const today = new Date(now.getTime() + 9 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "");
            const koreaISO = new Date(now.getTime() + 9 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
                .split(" ")?.[1]
                ?.split(":");
            const nowTime = koreaISO?.[0] + koreaISO?.[1];
            if (opeDate === today && opeTime <= nowTime) {
                localStorage.removeItem("client-storage");
                setIsErrorOpen?.(`"이미 종료된 수술입니다."`);
                setIsRemoveClient?.(true);
                return;
            }
        }
        if (path) {
            const url = `/api/kiosk-surgery/changeDevice`;
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
                    } else {
                        updateErrorMessage({
                            deviceID: deviceId,
                            userID: doctor.id,
                            message: result.message,
                        });
                    }
                } else {
                    console.error("API 호출 실패", response.status);
                }
            } catch (error) {
                console.error("에러 발생", error);
            }
        }
    };

    return (
        <div className="flex w-full">
            {isShow && (
                <button
                    className="flex items-center justify-between w-full min-w-[340px] rounded-[15px] bg-[rgba(255,255,255,0.25)] px-[35px] mr-5"
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
                className={`w-full h-[120px] rounded-[15px] ${
                    status === 4 ? "min-w-[591px]" : "min-w-[680px]"
                } `}
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
