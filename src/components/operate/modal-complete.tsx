"use client";
import { useRouter } from "next/navigation";
import { CustomModal } from "../common";

interface Props {
    isModalComplete: boolean;
    setIsModalComplete: (v: boolean) => void;
}

const ModalComplete = ({ isModalComplete, setIsModalComplete }: Props) => {
    const router = useRouter();
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
                    className="w-[420px] h-[120px] rounded-[15px] bg-[#15CF8F] z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsModalComplete(false);
                        router.replace("/");
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
