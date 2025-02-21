"use client";

import {
    ClientInfoForModal,
    CustomModal,
    GraphWeight,
    Weights,
} from "../../common";
import {
    GraphFatPercent,
    GraphBmiPercent,
    GraphBasalMetabolicRatePercent,
    GraphMineralPercent,
    GraphProteinPercent,
    GraphBodyWaterPercent,
} from ".";

interface Props {
    isInbodyOpen: boolean;
    setIsInbodyOpen: (v: boolean) => void;
}
const ModalInbody = ({ isInbodyOpen, setIsInbodyOpen }: Props) => {
    return (
        <CustomModal
            isOpen={isInbodyOpen}
            onClose={() => setIsInbodyOpen(false)}
        >
            <div className="flex flex-col w-full h-fit items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    고객 인바디 정보
                </p>
                <ClientInfoForModal />
                <div className="grid grid-cols-3 row-end-3 w-full h-full pt-5 gap-5">
                    <GraphWeight />
                    <Weights />
                    <GraphFatPercent />
                    <GraphBmiPercent />
                    <GraphBasalMetabolicRatePercent />
                    <GraphMineralPercent />
                    <GraphProteinPercent />
                    <GraphBodyWaterPercent />
                </div>
            </div>
        </CustomModal>
    );
};
export default ModalInbody;
