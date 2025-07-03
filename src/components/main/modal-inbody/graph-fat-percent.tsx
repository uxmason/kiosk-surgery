import { ObBmiFatType } from "@/type";

interface Props {
    isBmiFat: ObBmiFatType[];
}

const GraphFatPercent = ({ isBmiFat }: Props) => {
    let maxValue = 0;
    let minValue = 500;
    for (let i = 0; i < isBmiFat?.length; i++) {
        const obFat = Number(isBmiFat?.[i]?.obFat);
        const obstFath = Number(isBmiFat?.[i]?.obstFatH);
        const obstFatl = Number(isBmiFat?.[i]?.obstFatL);

        maxValue = Math.max(maxValue, obFat, obstFath);
        minValue = Math.min(minValue, obFat, obstFatl);
    }
    return (
        <div className="flex flex-col w-full h-[400px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] pt-[30px]">
            <p className="text-white text-[24px] font-bold leading-6 pl-[35px]">
                체지방률
            </p>
            <div className="relative w-full h-[346px] pt-[46px]">
                <div className="absolute flex w-full h-[300px]">
                    {isBmiFat?.map((data, i) => {
                        const standardHigh = data?.obstFatH ?? 0;
                        const standardLow = data?.obstFatL ?? 0;
                        const targetBmi = data?.obFat ?? 0;

                        const top =
                            100 -
                            ((standardHigh - minValue) /
                                (maxValue - minValue)) *
                                100;
                        const bmiPercent =
                            ((targetBmi - minValue) / (maxValue - minValue)) *
                            100;
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
                                    className="absolute bottom-[54px] max-h-[250px] w-5 bg-[rgba(255,255,255,0.2)] rounded-[5px]"
                                    style={{
                                        transform: `translateY(-${top}%)`,
                                        height: `${
                                            ((standardHigh - standardLow) /
                                                (maxValue - minValue)) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                                <div
                                    className="absolute bottom-[54px] z-10 w-[20px] h-[20px] bg-[#3A3E59] rounded-full border-[4px] border-white"
                                    style={{
                                        transform: `translateY(-${
                                            (bmiPercent / 100) * 250
                                        }px)`,
                                        // top: `${100 - bmiPercent}%)`,
                                    }}
                                ></div>
                                <div
                                    className="absolute max-h-[250px] bottom-[54px] w-1 bg-gradient-to-t from-transparent to-white"
                                    style={{
                                        height: `${bmiPercent}%`,
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
                <div className="absolute bottom-[50px] w-full border-[1px] border-[rgba(255,255,255,0.25)] border-dashed"></div>
            </div>
        </div>
    );
};

export default GraphFatPercent;
