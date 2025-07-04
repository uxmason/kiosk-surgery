import { WeightChartType, WeightsType } from "@/type";
import InbodyGraph from "./inbody-graph";

interface Props {
    setInbodyOpen: (v: boolean) => void;
    isPaired: boolean;
    weightArr: WeightChartType[];
    isWeights?: WeightsType;
    height: number | null;
}
const Inbody = ({
    weightArr,
    setInbodyOpen,
    isPaired,
    isWeights,
    height,
}: Props) => {
    return (
        <button
            className="flex flex-col text-start bg-[rgba(91,135,237,0.60)] pt-[25px] pb-5 px-5 rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setInbodyOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px] px-[10px]">
                인바디
            </p>
            {weightArr?.length > 0 && isPaired ? (
                <>
                    <InbodyGraph weightArr={weightArr} isWeights={isWeights} />
                    <div className="flex w-full justify-between items-center px-[10px]">
                        <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                            <svg className="w-5 h-5 text-[rgba(91,135,237)]">
                                <use href="/assets/sprite.svg#icon-search"></use>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold leading-[16px] text-[10px]">
                                키:{" "}
                                <span className="text-[16px] pl-[1px]">
                                    {height}
                                </span>{" "}
                                cm
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-start pt-[21px]">
                    <p className="text-white text-[24px] font-bold leading-8">
                        (없음)
                    </p>
                </div>
            )}
        </button>
    );
};
export default Inbody;
