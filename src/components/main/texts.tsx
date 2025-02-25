interface Props {
    isError: boolean;
}
const Texts = ({ isError }: Props) => {
    return (
        <div className="flex flex-col pt-[120px] w-full gap-y-[15px]">
            <p
                className={`text-[26px] text-center font-bold leading-9 
                ${!isError ? "text-[#15CF8F]" : "text-[#1d1f2d]"}
                `}
            >
                부산365mc병원
            </p>
            <p className="text-white text-[78px] font-bold leading-normal pt-11">
                지방 하나만! 365mc
            </p>
            <p className="text-white text-[30px] font-[250] leading-[50px] whitespace-pre-line">
                <span>“안녕하세요.</span>
                <span className="font-bold">허설</span>
                <span>
                    님. 전문 의료진이 철저히 준비했으니 안 심하시고 편안하게
                    기다려 주세요. 궁금한 점이 있으면 간호 사에게 언제든 말씀해
                    주세요.”
                </span>
            </p>
        </div>
    );
};
export default Texts;
