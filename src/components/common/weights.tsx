import { WeightsType } from "@/type";

interface Props {
    isWeights?: WeightsType;
}
const Weights = ({ isWeights }: Props) => {
    const limitWeight = Math.max(
        isWeights?.BD_WEIGHT ?? 0,
        isWeights?.WC_WEIGHT ?? 0
    );
    const colorForWeight =
        ((isWeights?.BD_WEIGHT ?? 0) - (isWeights?.WC_WEIGHT ?? 0)) * 100 - 100;
    const color =
        colorForWeight > 30
            ? "rgba(240,85,121)"
            : colorForWeight > 15
            ? "rgba(237,107,91)"
            : colorForWeight > 6
            ? "rgba(249,172,104)"
            : colorForWeight > 1
            ? "rgba(21,207,143)"
            : colorForWeight < -15
            ? "rgba(177,117,237)"
            : colorForWeight < -6
            ? "rgba(70,182,174)"
            : colorForWeight < -1
            ? "rgba(21,207,143)"
            : "rgba(91,135,237)";
    return (
        <div className="flex flex-col w-full h-[300px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] py-[30px] px-[35px] gap-y-[25px]">
            <div className="flex flex-col">
                <p className="text-white text-[24px] font-bold leading-6">
                    현재 체중
                </p>
                <div className="flex justify-between w-full pt-4 gap-x-5">
                    <div
                        className="backdrop-blur-[20px] rounded-[5px] h-[25px]"
                        style={{
                            width: `calc(${
                                100 -
                                ((limitWeight - (isWeights?.BD_WEIGHT ?? 0)) /
                                    limitWeight) *
                                    100
                            }% - 70px)`,
                            backgroundColor: color,
                        }}
                    />
                    <p className="text-white text-[32px] font-[250] leading-8">
                        {isWeights?.BD_WEIGHT?.toFixed(1)}
                        <span className="text-[10px] font-normal leading-4">
                            kg
                        </span>
                    </p>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-white text-[24px] font-bold leading-6">
                    적정 체중
                </p>
                <div className="flex justify-between w-full pt-4 gap-x-5">
                    <div
                        className="bg-[rgba(255,255,255,0.35)] backdrop-blur-[20px] rounded-[5px] h-[15px]"
                        style={{
                            width: `calc(${
                                100 -
                                ((limitWeight - (isWeights?.WC_WEIGHT ?? 0)) /
                                    limitWeight) *
                                    100
                            }% - 70px)`,
                        }}
                    />
                    <p className="text-white text-[20px] font-bold leading-[25px]">
                        {isWeights?.WC_WEIGHT?.toFixed(1)}
                        <span className="text-[10px] font-normal leading-4">
                            kg
                        </span>
                    </p>
                </div>
            </div>
            <div className="flex flex-col">
                <p className="text-white text-[24px] font-bold leading-6">
                    목표 체중
                </p>
                <div className="flex w-full justify-between pt-4 gap-x-5">
                    <div
                        className="bg-[rgba(255,255,255,0.35)] backdrop-blur-[20px] rounded-[5px] h-[15px]"
                        style={{
                            width: `calc(${
                                100 -
                                ((limitWeight -
                                    (isWeights?.MUST_WEIGHTL ?? 0)) /
                                    limitWeight) *
                                    100
                            }% - 70px)`,
                        }}
                    />
                    <p className="text-white text-[20px] font-bold leading-[25px]">
                        {isWeights?.MUST_WEIGHTL?.toFixed(1)}
                        <span className="text-[10px] font-normal leading-4">
                            kg
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Weights;
