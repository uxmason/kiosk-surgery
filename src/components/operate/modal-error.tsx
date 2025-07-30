import { updateErrorMessage } from "@/function";
import { useDoctorStore, useStore } from "@/store";
import { DeleteCdtmType } from "@/type";

interface Props {
    isErrorOpen: boolean;
    setIsErrorOpen: (v: boolean) => void;
    isIdForEdit: number | null;
    setIsIdForEdit: (v: number | null) => void;
}
const ModalError = ({
    isErrorOpen,
    setIsErrorOpen,
    isIdForEdit,
    setIsIdForEdit,
}: Props) => {
    const { deviceId } = useStore();
    const { doctor } = useDoctorStore();
    const deleteCdtmCannula = async () => {
        if (isIdForEdit === null) return;
        const data: DeleteCdtmType = {
            deviceId: deviceId,
            cdtmId: isIdForEdit,
            doctorId: doctor?.id,
        };
        const url = `/api/kiosk-surgery/cannula/list/delete`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setIsErrorOpen(false);
                    setIsIdForEdit(null);
                } else {
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor?.id,
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
        <div
            data-current={isErrorOpen}
            className={`fixed flex w-full h-full inset-0 backdrop-blur-[20px] bg-[rgba(29,31,45,.6)] transition-all duration-300 ${
                isErrorOpen
                    ? "opacity-100 pointer-events-auto z-10"
                    : "opacity-0 pointer-events-none hidden"
            }`}
        >
            <div
                className={`absolute w-full h-full`}
                onClick={() => setIsErrorOpen(false)}
            ></div>
            <div className={`flex w-full mx-[90px]`}>
                <div className="w-full flex flex-col items-center pt-[370px]">
                    <p className="text-white text-[54px] font-bold leading-[54px]">
                        {`"정말 삭제하시겠습니까?"`}
                    </p>
                    <p className="text-white text-[32px] font-bold leading-[54px] whitespace-break-spaces pt-[61px]">
                        한번 삭제된 툴은 다시 복구가 되지 않습니다.
                    </p>
                </div>
            </div>
            <div
                className="absolute flex w-full justify-center gap-x-5"
                style={{
                    top: `680px`,
                }}
            >
                <button
                    onClick={() => setIsErrorOpen(false)}
                    className="bg-[rgba(255,255,255,0.25)] w-60 h-30 rounded-[15px] text-white text-[32px] font-bold leading-8"
                >
                    취소
                </button>
                <button
                    onClick={() => deleteCdtmCannula()}
                    className="bg-[#F05579] w-60 h-30 rounded-[15px] text-white text-[32px] font-bold leading-8"
                >
                    삭제
                </button>
            </div>
        </div>
    );
};
export default ModalError;
