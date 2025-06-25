import {
    ClientInfoForModal,
    GraphAi,
    GraphWeight,
    ReservationInfo,
    Weights,
} from ".";
import CustomModal from "./custom-modal";
import { useEffect, useState } from "react";
import { OpeClientType, WeightChartType, WeightsType } from "@/type";
import { handleBirthToAge } from "@/function";
import { useClientStore } from "@/store";
import toast from "react-hot-toast";
interface Props {
    isOpeInfo: OpeClientType[];
    isOpenOpeModal: boolean;
    setIsOpenOpeModal: (v: boolean) => void;
}
const ModalOpeInfo = ({
    isOpeInfo,
    isOpenOpeModal,
    setIsOpenOpeModal,
}: Props) => {
    const { client } = useClientStore();
    const [isAge, setIsAge] = useState(0);
    const [isWeights, setIsWeights] = useState<WeightsType>();
    const [weightArr, setWeightArr] = useState<WeightChartType[]>([]);

    // 고객 인바디 정보 불러오기
    const handleSelectInbodyLst = async (psEntry: string, part: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/inbody?psEntry=${psEntry}&part=${part}`,
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

    // 고객 인바디 정보 담기
    useEffect(() => {
        if (!client) return;
        handleSelectInbodyLst(client.psEntry, client.part).then((res) => {
            if (res.success) {
                const inbody = res?.inbody;
                setIsWeights({
                    BD_WEIGHT: inbody?.[0]?.["BD_WEIGHT"],
                    WC_WEIGHT: inbody?.[0]?.["WC_WEIGHT"],
                    MUST_WEIGHTL: inbody?.[0]?.["MUST_WEIGHTL"],
                });
                setWeightArr(
                    inbody?.map((v: never) => {
                        return {
                            date: v?.["PRODATE"],
                            weight: v?.["BD_WEIGHT"],
                        };
                    })
                );
            } else {
                toast.error(res.message);
            }
        });
    }, [client]);

    // 나이
    useEffect(() => {
        const age = handleBirthToAge(client?.licence);
        setIsAge(Math.floor(Number(age)));
    }, [client]);

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
                <ReservationInfo isOpeInfo={isOpeInfo} />
                {isAge !== 0 && (
                    <GraphAi aiType="DOCTOR">
                        <>
                            <p className="text-white text-[24px] font-bold leading-6">
                                예측 지방 추출량
                            </p>
                        </>
                    </GraphAi>
                )}
                <div className="w-full grid grid-cols-3 gap-x-5">
                    <GraphWeight
                        isOpenOpeModal={isOpenOpeModal}
                        weightArr={weightArr}
                    />
                    <Weights isWeights={isWeights} />
                </div>
            </div>
        </CustomModal>
    );
};
export default ModalOpeInfo;
