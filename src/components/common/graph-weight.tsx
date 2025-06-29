import { WeightChartType } from "@/type";
import WeightChart from "./weight-chart";
interface Props {
    color: string;
    isOpenOpeModal: boolean;
    weightArr: WeightChartType[];
}
const GraphWeight = ({ color, isOpenOpeModal, weightArr }: Props) => {
    return (
        <div className="relative col-span-2 w-full min-w-[580px] h-[300px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] pt-[30px] px-[35px] pb-[9px">
            <p className="absolute text-white text-[24px] font-bold leading-6 w-fit">
                체중 변화
            </p>
            <WeightChart
                color={color}
                isOpenOpeModal={isOpenOpeModal}
                weightArr={weightArr}
            />
        </div>
    );
};
export default GraphWeight;
