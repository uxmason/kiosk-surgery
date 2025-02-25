import { parseOpePart, parseOpeState } from "@/parse";
interface Props {
    timelineList: never[];
}

const TimeLine = ({ timelineList }: Props) => {
    const scalingFactor = 100 / 60;

    return (
        <div className="relative flex flex-col w-full h-full max-h-[1200px] gap-y-[43px]">
            {timelineList?.map((t) => {
                const startTime: string = t?.["시작시간"];
                const endTime: string = t?.["종료시간"];
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

                const part = t?.["수술부위"];
                const engPart =
                    part === "허벅지"
                        ? "THIGH"
                        : part === "팔"
                        ? "ARM"
                        : part === "복부"
                        ? "ABDOMEN"
                        : part === "등"
                        ? "BACK"
                        : part === "러브핸들"
                        ? "LOVEHANDLE"
                        : part === "엉덩이"
                        ? "HIP"
                        : part === "얼굴"
                        ? "FACE"
                        : "CALVES";

                return (
                    <div
                        key={`${t?.["고객번호"]}_${startTime}_${endTime}`}
                        className="absolute flex w-full left-[45px] pt-[15px] px-[15px] rounded-[15px]"
                        style={{
                            top: `${eventTop}px`,
                            height: `${eventHeight}px`,
                            minHeight: 80,
                            width: 490,
                            backgroundColor: `${parseOpePart(engPart).color}33`,
                        }}
                    >
                        <div
                            style={{
                                borderColor: parseOpePart(engPart).color,
                            }}
                            className={`flex items-center justify-center bg-white w-[50px] h-[50px] rounded-[15px] border-[5px]`}
                        >
                            <img
                                src={`/assets/${engPart.toLocaleLowerCase()}.svg`}
                                width={35}
                                height={35}
                            />
                        </div>
                        <div className="flex flex-col w-[90px] gap-y-2 ml-[14px] mr-5">
                            <p
                                style={{
                                    color: parseOpePart(engPart).color,
                                }}
                                className="text-[24px] font-light leading-[24px]"
                            >
                                {t?.["수술부위"]}
                            </p>
                            <p className="text-white text-[16px] font-bold leading-[16px]">
                                {t?.["수술코드"]}
                            </p>
                        </div>
                        <div className="flex flex-col text-white gap-y-2 w-[120px]">
                            <p className="text-[24px] font-bold leading-[24px]">
                                {t?.["고객명"]}
                            </p>
                            <p className="text-[14px] font-light leading-[16px]">
                                {t?.["고객번호"]}
                            </p>
                        </div>
                        <button
                            className="flex items-center justify-center w-[100px] h-[50px] rounded-[10px] ml-16"
                            style={{
                                backgroundColor: parseOpeState(
                                    t?.["state"] || "0"
                                ).color,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-white text-[16px] font-bold leading-[16px]">
                                {parseOpeState(t?.["state"] || "0").text}
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
