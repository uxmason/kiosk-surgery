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
import { WeightChartType, WeightsType } from "@/type";

interface Props {
    isInbodyOpen: boolean;
    setInbodyOpen: (v: boolean) => void;
    weightArr: WeightChartType[];
    isWeights?: WeightsType;
}
const ModalInbody = ({
    isInbodyOpen,
    setInbodyOpen,
    weightArr,
    isWeights,
}: Props) => {
    return (
        <CustomModal isOpen={isInbodyOpen} onClose={() => setInbodyOpen(false)}>
            <div className="flex flex-col w-full h-fit items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    고객 인바디 정보
                </p>
                <ClientInfoForModal />
                <div className="grid grid-cols-3 row-end-3 w-full h-full pt-5 gap-5">
                    <GraphWeight
                        isOpenOpeModal={isInbodyOpen}
                        weightArr={weightArr}
                    />
                    <Weights isWeights={isWeights} />
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
