interface Props {
    text: string;
    time: string;
    color: string;
    isOther?: boolean;
}

const UpcomingTime = ({ text, time, color, isOther }: Props) => {
    const timeStyle = {
        color: color,
    };

    return (
        <div
            className={`absoulte flex w-full mx-auto justify-center
        ${isOther ? "bottom-0 pt-10" : "mt-[1370px]"}
        `}
        >
            <p className="text-white text-center text-[20px] font-normal leading-[32px]">
                {text}:
                <span
                    style={timeStyle}
                    className="text-[48px] font-normal leading-[32px] pl-2"
                >
                    {time}
                </span>
            </p>
        </div>
    );
};
export default UpcomingTime;
