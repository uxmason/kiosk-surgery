import WeightChart from "./weight-chart";

const GraphWeight = () => {
    const weightArr = [
        { weight: 59.9, date: "2024-11-22" },
        { weight: 60.7, date: "2025-01-06" },
        { weight: 65.1, date: "2025-01-13" },
    ];
    return (
        <div className="relative col-span-2 w-full min-w-[580px] h-[300px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] pt-[30px] px-[35px] pb-[9px">
            <p className="absolute text-white text-[24px] font-bold leading-6 w-fit">
                체중 변화
            </p>
            <WeightChart weightArr={weightArr} />
        </div>
    );
};
export default GraphWeight;
