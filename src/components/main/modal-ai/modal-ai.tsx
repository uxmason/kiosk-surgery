"use client";
import { ClientInfoForModal, CustomModal, GraphAi } from "../../common";
import "swiper/css";

interface Props {
    isModalAIOpen: boolean;
    setModalAIOpen: (v: boolean) => void;
}

const ModalAI = ({ isModalAIOpen, setModalAIOpen }: Props) => {
    return (
        <CustomModal
            isOpen={isModalAIOpen}
            onClose={() => setModalAIOpen(false)}
        >
            <div className="flex flex-col w-full h-full items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    예측 지방 추출량
                </p>
                <ClientInfoForModal />
                <GraphAi aiType="DOCTOR">
                    <>
                        <p className="text-white text-[24px] font-bold leading-6">
                            예측 지방 추출량 -
                            <span className="text-[#15CF8F] mx-2">홍성훈</span>
                            <span className="font-[250]">원장</span>
                        </p>
                    </>
                </GraphAi>
                <div className="h-5" />
                <GraphAi aiType="AVERAGE">
                    <>
                        <p className="text-white text-[24px] font-bold leading-6">
                            예측 지방 추출량 - 365mc 전체 평균
                        </p>
                    </>
                </GraphAi>
            </div>
        </CustomModal>
    );
};
export default ModalAI;
