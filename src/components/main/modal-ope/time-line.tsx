import { parseOpePart, parseOpeState } from "@/parse";
import { OpeType } from "@/type";

const events: OpeType[] = [
    {
        clientName: "강보연",
        part: "THIGH",
        psEntry: "210046223",
        opeCode: "OPE0521",
        opeDate: "20250221",
        startTime: "0900",
        endTime: "1230",
        state: "DONE",
    },
    {
        clientName: "강보연",
        part: "ABDOMEN",
        psEntry: "210046223",
        opeCode: "OPE0521",
        opeDate: "20250221",
        startTime: "1230",
        endTime: "1330",
        state: "ING",
    },
    {
        clientName: "강보연",
        part: "ARM",
        psEntry: "210046223",
        opeCode: "OPE0521",
        opeDate: "20250221",
        startTime: "1400",
        endTime: "1730",
        state: "BEFORE",
    },
];

const TimeLine = () => {
    const scalingFactor = 100 / 60;

    return (
        <div className="relative flex flex-col w-full h-full max-h-[1200px] gap-y-[43px]">
            {events?.map((t) => {
                const startTime = t?.startTime;
                const endTime = t?.endTime;

                const startHour = Number(startTime.slice(0, 2));
                const startMinute = Number(startTime.slice(2));
                const endHour = Number(endTime.slice(0, 2));
                const endMinute = Number(endTime.slice(2));

                const startTimeInMinutes = (startHour - 9) * 60 + startMinute;
                const endTimeInMinutes = (endHour - 9) * 60 + endMinute;

                const eventHeight =
                    (endTimeInMinutes - startTimeInMinutes) * scalingFactor -
                    20;

                const eventTop = startTimeInMinutes * scalingFactor + 16;

                return (
                    <div
                        key={`${t?.opeDate}_${startTime}_${endTime}`}
                        className="absolute flex w-full left-[45px] pt-[15px] px-[15px] rounded-[15px]"
                        style={{
                            top: `${eventTop}px`,
                            height: `${eventHeight}px`,
                            minHeight: 80,
                            width: 490,
                            backgroundColor: `${
                                parseOpePart(t?.part)?.color
                            }33`,
                        }}
                    >
                        <div
                            style={{
                                borderColor: parseOpePart(t?.part)?.color,
                            }}
                            className={`flex items-center justify-center bg-white w-[50px] h-[50px] rounded-[15px] border-[5px]`}
                        >
                            <img
                                src={`/assets/${t?.part.toLocaleLowerCase()}.svg`}
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="flex flex-col w-[90px] gap-y-2 ml-[14px] mr-5">
                            <p
                                style={{
                                    color: parseOpePart(t?.part)?.color,
                                }}
                                className="text-[24px] font-light leading-[24px]"
                            >
                                {parseOpePart(t?.part).text}
                            </p>
                            <p className="text-white text-[16px] font-bold leading-[16px]">
                                {t?.opeCode}
                            </p>
                        </div>
                        <div className="flex flex-col text-white gap-y-2 w-[120px]">
                            <p className="text-[24px] font-bold leading-[24px]">
                                {t?.clientName}
                            </p>
                            <p className="text-[14px] font-light leading-[16px]">
                                {t?.psEntry}
                            </p>
                        </div>
                        <button
                            className="flex items-center justify-center w-[100px] h-[50px] rounded-[10px] ml-16"
                            style={{
                                backgroundColor: parseOpeState(t?.state).color,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-white text-[16px] font-bold leading-[16px]">
                                {parseOpeState(t?.state).text}
                            </p>
                        </button>
                    </div>
                );
            })}
            {Array.from({ length: 12 }, (_, i) => {
                const time = i + 9;
                const formatTime = i === 0 ? `0${time}:00` : `${time}:00`;
                return (
                    <div key={time} className="relative flex w-full h-full">
                        <p className="text-white/50 text-[13px] font-bold leading-[13px] w-10">
                            {formatTime}
                        </p>
                        <div className="w-full mt-2 border-t-[1px] border-[white]/20 border-dashed" />
                    </div>
                );
            })}
        </div>
    );
};
export default TimeLine;
