import InbodyGraph from "./inbody-graph";

interface Props {
    setInbodyOpen: (v: boolean) => void;
    isPaired: boolean;
    dataInbody: never[];
}
const Inbody = ({ dataInbody, setInbodyOpen, isPaired }: Props) => {
    return (
        <button
            className="flex flex-col text-start bg-[rgba(56,171,190)] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setInbodyOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                인바디
            </p>
            {dataInbody.length > 0 && isPaired ? (
                <>
                    <InbodyGraph />
                    <div className="flex w-full justify-between items-center">
                        <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                            <svg className="w-5 h-5 text-[rgba(56,171,190)]">
                                <use href="/assets/sprite.svg#icon-search"></use>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold leading-[16px] text-[10px]">
                                키:{" "}
                                <span className="text-[16px] pl-[1px]">
                                    178
                                </span>{" "}
                                cm
                            </p>
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
export default Inbody;
