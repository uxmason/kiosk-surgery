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
import {
    CaloriesType,
    BmiFatType,
    BmiType,
    WeightChartType,
    WeightsType,
    MineralType,
    ProteinType,
    WaterType,
} from "@/type";

interface Props {
    isInbodyOpen: boolean;
    setInbodyOpen: (v: boolean) => void;
    weightArr: WeightChartType[];
    isWeights?: WeightsType;
    isCalories: CaloriesType[];
    isBmiFat: BmiFatType[];
    isBmi: BmiType[];
    isMineral: MineralType[];
    isProtein: ProteinType[];
    isWater: WaterType[];
}
const ModalInbody = ({
    isInbodyOpen,
    setInbodyOpen,
    weightArr,
    isWeights,
    isCalories,
    isBmiFat,
    isBmi,
    isMineral,
    isProtein,
    isWater,
}: Props) => {
    const colorForWeight =
        ((isWeights?.BD_WEIGHT ?? 0) - (isWeights?.WC_WEIGHT ?? 0)) * 100 - 100;
    const color =
        colorForWeight > 30
            ? "240,85,121"
            : colorForWeight > 15
            ? "237,107,91"
            : colorForWeight > 6
            ? "249,172,10"
            : colorForWeight > 1
            ? "21,207,143"
            : colorForWeight < -15
            ? "177,117,23"
            : colorForWeight < -6
            ? "70,182,174"
            : colorForWeight < -1
            ? "21,207,143"
            : "91,135,237";
    return (
        <CustomModal
            isOpen={isInbodyOpen}
            top={1600}
            onClose={() => setInbodyOpen(false)}
        >
            <div className="flex flex-col w-full h-fit items-center pt-20">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    고객 인바디 정보
                </p>
                <ClientInfoForModal />
                <div className="grid grid-cols-3 row-end-3 w-full h-full pt-5 gap-5">
                    <GraphWeight
                        isOpenOpeModal={isInbodyOpen}
                        weightArr={weightArr}
                        color={color}
                    />
                    <Weights isWeights={isWeights} color={color} />
                    <GraphFatPercent isBmiFat={isBmiFat} />
                    <GraphBmiPercent isBmi={isBmi} />
                    <GraphBasalMetabolicRatePercent
                        isInbodyOpen={isInbodyOpen}
                        isCalories={isCalories}
                        wcWeight={isWeights?.WC_WEIGHT}
                    />
                    <GraphMineralPercent isMineral={isMineral} />
                    <GraphProteinPercent isProtein={isProtein} />
                    <GraphBodyWaterPercent isWater={isWater} />
                </div>
            </div>
        </CustomModal>
    );
};
export default ModalInbody;
