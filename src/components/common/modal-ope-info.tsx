import {
    ClientInfoForModal,
    GraphAi,
    GraphWeight,
    ReservationInfo,
    Weights,
} from ".";
import CustomModal from "./custom-modal";
import { useEffect, useState } from "react";
import { OpeClientType } from "@/type";
interface Props {
    isOpenOpeModal: boolean;
    setIsOpenOpeModal: (v: boolean) => void;
}
const ModalOpeInfo = ({ isOpenOpeModal, setIsOpenOpeModal }: Props) => {
    // const { psEntry } = usePsentryStore();
    const psEntry = "210040378";
    const doctorId = "pyc21";
    // const { doctorId } = useDoctorIdStore();
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);

    // 수술 고객 정보
    const onHandleSelectOpe = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery?doctorId=${doctorId}&psEntry=${psEntry}`,
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
    useEffect(() => {
        if (!isOpenOpeModal) return;
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                console.log("!#!@");
            }
        });
    }, [isOpenOpeModal]);
    console.log(isOpeInfo);
    return (
        <CustomModal
            isOpen={isOpenOpeModal}
            onClose={() => setIsOpenOpeModal(false)}
        >
            <div className="flex flex-col w-full h-full items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    수술 정보
                </p>
                <ClientInfoForModal isOpeInfo={isOpeInfo} />
                <ReservationInfo isOpeInfo={isOpeInfo} />
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
