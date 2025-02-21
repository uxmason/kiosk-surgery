import {
    ClientInfoForModal,
    GraphAi,
    GraphWeight,
    ReservationInfo,
    Weights,
} from ".";
import CustomModal from "./custom-modal";
interface Props {
    isOpenOpeModal: boolean;
    setIsOpenOpeModal: (v: boolean) => void;
}
const ModalOpeInfo = ({ isOpenOpeModal, setIsOpenOpeModal }: Props) => {
    return (
        <CustomModal
            isOpen={isOpenOpeModal}
            onClose={() => setIsOpenOpeModal(false)}
        >
            <div className="flex flex-col w-full h-full items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    수술 정보
                </p>
                <ClientInfoForModal />
                <ReservationInfo />
                <GraphAi aiType="DOCTOR">
                    <>
                        <p className="text-white text-[24px] font-bold leading-6">
                            예측 지방 추출량
                        </p>
                    </>
                </GraphAi>
                <div className="w-full grid grid-cols-3 gap-x-5">
                    <GraphWeight />
                    <Weights />
                </div>
            </div>
        </CustomModal>
    );
};
export default ModalOpeInfo;
