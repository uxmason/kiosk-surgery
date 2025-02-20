interface Props {
    text: string;
    time: string;
    color: string;
}

const UpcomingTime = ({ text, time, color }: Props) => {
    const timeStyle = {
        color: color,
    };

    return (
        <div className="flex w-full mx-auto justify-center pt-10 pb-[108px]">
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
