interface Props {
    isProcess: number;
    isOther?: boolean;
}

const baseClass =
    "w-full max-w-[228px] h-[285px] rounded-[15px] py-[30px] px-[30px]";

const Process = ({ isProcess, isOther }: Props) => {
    const getBgClass = (step: number) =>
        isProcess === step
            ? "bg-[rgba(58,62,89,0.75)]"
            : "bg-[rgba(58,62,89,0.15)]";

    return (
        <div
            className={`absolute flex w-full justify-center gap-x-5
        ${isOther ? "mt-[90px]" : "mt-[1510px] top-0"}
        `}
        >
            {[1, 2, 3].map((step) => (
                <div key={step} className={`${getBgClass(step)} ${baseClass}`}>
                    <p className="text-white/50 text-[18px] font-bold leading-[24px]">
                        {step}단계
                    </p>
                    <p className="text-white text-[24px] font-bold leading-[24px] pt-4 pb-[41px]">
                        {step === 1 ? "준비" : step === 2 ? "수행" : "기록"}
                    </p>
                    <p className="text-white/75 text-[20px] font-light leading-[30px]">
                        {step === 1
                            ? "담당의와 고객의 정보를 확인하고 의료 서비스를 제공할 준비를 합니다."
                            : step === 2
                            ? "담당의에게 고객의 신체 사진과 마취안전 AI 예측 자료를 제공합니다."
                            : "의료 서비스에 활용한 케뉼라, 인시전 정보와 부위 정보를 기록합니다."}
                    </p>
                </div>
            ))}
        </div>
    );
};
export default Process;
