interface Props {
    setModalAIOpen: (v: boolean) => void;
    isUnpaired: boolean;
    dataFepa: never[];
}
const Ai = ({ setModalAIOpen, isUnpaired, dataFepa }: Props) => {
    return (
        <button
            className="flex flex-col text-start bg-[rgba(91,135,237,0.60)] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setModalAIOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                AI 예측
            </p>
            {dataFepa.length > 0 && !isUnpaired ? (
                <>
                    <div className="h-full">예측</div>
                    <div className="flex w-full justify-between items-center">
                        <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                            <svg className="w-5 h-5 text-[rgba(91,135,237)]">
                                <use href="/assets/sprite.svg#icon-search"></use>
                            </svg>
                        </div>
                        <div>
                            {/* <p className="text-white font-bold leading-[16px] text-[10px]">
                        최종촬영:
                        <span className="text-[16px]">24.07.08</span>
                        cm
                    </p> */}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-start pt-[21px]">
                    <p className="text-white text-[24px] font-bold leading-8">
                        (없음)
                    </p>
                </div>
            )}
        </button>
    );
};
export default Ai;
