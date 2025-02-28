import {
    ClientInfoForModal,
    GraphAi,
    GraphWeight,
    ReservationInfo,
    Weights,
} from ".";
import CustomModal from "./custom-modal";
import { useEffect, useState } from "react";
import { OpeClientType, WeightsType } from "@/type";
import { handleBirthToAge } from "@/function";
interface Props {
    isOpenOpeModal: boolean;
    setIsOpenOpeModal: (v: boolean) => void;
}
const ModalOpeInfo = ({ isOpenOpeModal, setIsOpenOpeModal }: Props) => {
    const psEntry = "210046823";
    const doctorId = "drh82";
    // const { psEntry } = usePsentryStore();
    // const { doctorId } = useDoctorIdStore();
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);
    const [isAge, setIsAge] = useState(0);
    const [isWeights, setIsWeights] = useState<WeightsType>();

    // 수술 고객 정보
    const onHandleSelectOpe = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery/client?doctorId=${doctorId}&psEntry=${psEntry}`,
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

    // 고객 인바디 정보 불러오기
    const handleSelectInbodyLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/inbody?psEntry=${psEntry}`,
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

    // 수술 고객 정보 담기
    useEffect(() => {
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                console.log("!#!@");
            }
        });
    }, []);

    // 고객 인바디 정보 담기
    useEffect(() => {
        if (!psEntry) return;
        handleSelectInbodyLst(psEntry).then((res) => {
            if (res.success) {
                setIsWeights({
                    BD_WEIGHT: res?.inbody?.[0]?.["BD_WEIGHT"],
                    WC_WEIGHT: res?.inbody?.[0]?.["WC_WEIGHT"],
                    MUST_WEIGHTL: res?.inbody?.[0]?.["MUST_WEIGHTL"],
                });
            } else {
                console.log("INBODY_FAIL");
            }
        });
    }, [psEntry]);

    // 나이
    useEffect(() => {
        const age = handleBirthToAge(isOpeInfo?.[0]?.주민번호);
        setIsAge(Math.floor(Number(age)));
    }, [isOpeInfo]);
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
                {isAge !== 0 && (
                    <GraphAi
                        aiType="DOCTOR"
                        age={isAge}
                        sex={
                            Number(isOpeInfo?.[0]?.주민번호.slice(6, 7)) ===
                                1 ||
                            Number(isOpeInfo?.[0]?.주민번호.slice(6, 7)) === 3
                                ? "M"
                                : "F"
                        }
                    >
                        <>
                            <p className="text-white text-[24px] font-bold leading-6">
                                예측 지방 추출량
                            </p>
                        </>
                    </GraphAi>
                )}
                <div className="w-full grid grid-cols-3 gap-x-5">
                    <GraphWeight />
                    <Weights isWeights={isWeights} />
                </div>
            </div>
        </CustomModal>
    );
};
export default ModalOpeInfo;
