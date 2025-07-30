"use client";
import { updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { OpeInfoItem } from "@/type";
import { useRouter } from "next/navigation";
import { CustomModal } from "../common";

interface Props {
    isModalComplete: boolean;
    setIsModalComplete: (v: boolean) => void;
    isPaired?: boolean;
    dataOpeInfo: OpeInfoItem[];
}

const ModalComplete = ({
    isModalComplete,
    setIsModalComplete,
    isPaired,
    dataOpeInfo,
}: Props) => {
    const router = useRouter();
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const handleClick = async () => {
        if (!isPaired || dataOpeInfo?.length == 0) return;
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
                    status: 4,
                    forced: false,
                }),
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setIsModalComplete(false);
                    localStorage.removeItem("client-storage");
                    router.replace("/");
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
    };
    return (
        <CustomModal
            isOpen={isModalComplete}
            onClose={() => setIsModalComplete(false)}
        >
            <div className="flex flex-col w-full items-center pt-[370px]">
                <p className="text-white text-[54px] font-bold leading-[54px]">{`“정말 완료하시겠어요?”`}</p>
                <p className="text-white w-[800px] text-center text-[32px] font-bold leading-[54px] pt-[61px] pb-[87px]">
                    한번 평가까지 완료된 수술일정은 더 이상 수정되지 않으니,
                    신중하게 결정해주세요.
                </p>
                <button
                    className="w-[420px] h-[120px] rounded-[15px] bg-[#5B87ED] z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    <p className="text-white text-[32px] font-bold leading-8">
                        완료하겠습니다.
                    </p>
                </button>
            </div>
        </CustomModal>
    );
};
export default ModalComplete;
