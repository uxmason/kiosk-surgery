import { BmiType } from "@/type";

interface Props {
    isBmi: BmiType[];
}

const GraphBmiPercent = ({ isBmi }: Props) => {
    let maxValue = 0;
    let minValue = 500;
    for (let i = 0; i < isBmi?.length; i++) {
        const obBmi = Number(isBmi?.[i]?.obBmi);
        const obstBmiH = Number(isBmi?.[i]?.obstBmiH);
        const obstBmiL = Number(isBmi?.[i]?.obstBmiL);

        maxValue = Math.max(maxValue, obBmi, obstBmiH);
        minValue = Math.min(minValue, obBmi, obstBmiL);
    }
    return (
        <div className="flex flex-col w-full h-[400px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] pt-[30px]">
            <p className="text-white text-[24px] font-bold leading-6 pl-[35px]">
                BMI 지수
            </p>
            <div className="relative w-full h-[346px] pt-[46px]">
                <div className="absolute flex w-full h-[300px]">
                    {isBmi?.map((data, i) => {
                        const standardHigh = data?.obstBmiH ?? 0;
                        const standardLow = data?.obstBmiL ?? 0;
                        const targetBmi = data?.obBmi ?? 0;

                        const bmiPercent =
                            ((targetBmi - minValue) / (maxValue - minValue)) *
                            100;
                        const maxHeight = 196;
                        const bmiPx = (bmiPercent / 100) * maxHeight;
                        const barTopPx =
                            maxHeight -
                            ((standardHigh - standardLow) /
                                (maxValue - minValue)) *
                                maxHeight;
                        const barHeightPx =
                            ((standardHigh - standardLow) /
                                (maxValue - minValue)) *
                            maxHeight;
                        const date = data?.date;
                        const year = date?.slice(0, 4);
                        const monthDay = `${date?.slice(4, 6)}-${date?.slice(
                            6,
                            8
                        )}`;
                        return (
                            <div key={i} className="flex w-full justify-around">
                                {/* 그래프바 */}
                                <div
                                    className="absolute bottom-[54px] w-5 bg-[rgba(255,255,255,0.2)] rounded-[5px] overflow-hidden"
                                    style={{
                                        top: `${barTopPx}px`,
                                        height: `${barHeightPx}px`,
                                    }}
                                ></div>
                                <div
                                    className="absolute bottom-[54px] z-10 w-[20px] h-[20px] bg-[#3A3E59] rounded-full border-[4px] border-white"
                                    style={{
                                        transform: `translateY(-${bmiPx}px)`,
                                    }}
                                ></div>
                                <div
                                    className="absolute bottom-[54px] w-1 bg-gradient-to-t from-transparent to-white"
                                    style={{
                                        height: `${bmiPx}px`,
                                    }}
                                ></div>
                                {/* 날짜 라벨 */}
                                <div className="absolute bottom-[10px] text-center">
                                    <p className="text-[11px] text-[rgba(255,255,255,0.50)] font-bold leading-[18px]">
                                        {year}
                                    </p>
                                    <p className="text-[13px] text-white font-bold leading-[18px]">
                                        {monthDay}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="absolute bottom-[50px] w-full border-t-[1px] border-[rgba(255,255,255,0.25)] border-dashed"></div>
            </div>
        </div>
    );
};

export default GraphBmiPercent;
