import { useClientStore } from "@/store";
import { AnesthesiaType } from "@/type";

interface Props {
    setModalAIOpen: (v: boolean) => void;
    isPaired: boolean;
    isAnesthesia: AnesthesiaType[];
    isLimitFatPart: number;
}
const Ai = ({
    setModalAIOpen,
    isPaired,
    isAnesthesia,
    isLimitFatPart,
}: Props) => {
    const { client } = useClientStore();
    return (
        <div className="flex flex-col gap-y-[21px]">
            <button
                className="flex flex-col bg-[#169B7C] pt-[25px] pb-[27px] px-[30px] rounded-[15px] w-[228px] h-[132px]"
                onClick={() => setModalAIOpen(true)}
            >
                <p className="text-white text-[24px] font-[250] leading-[24px] text-left">
                    지방추출 예측
                </p>
                {isLimitFatPart > 0 && isPaired ? (
                    <div className="flex justify-between items-end pt-[35px]">
                        <div className="flex items-baseline">
                            <p className="text-white text-[10px] font-bold leading-[16px] m-0 pt-[1px] pr-[2px]">
                                부위:
                            </p>
                            <p className="text-white text-[14px] font-bold leading-[16px]">
                                {client?.part}
                            </p>
                        </div>
                        <div className="flex items-baseline">
                            <p className="text-white text-[28px] font-[100] leading-[16px] italic">
                                {Math.trunc(isLimitFatPart)?.toLocaleString()}
                            </p>
                            <p className="text-white font-normal text-[14px] leading-[16px] italic pl-1">
                                cc
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-white text-[24px] font-bold leading-8 text-left pt-[21px]">
                            (없음)
                        </p>
                    </div>
                )}
            </button>
            <button
                className="flex flex-col justify-between bg-[#3A3E59] pt-[25px] pb-5 px-[30px] rounded-[15px] w-[228px] h-[132px]"
                onClick={() => setModalAIOpen(true)}
            >
                <p className="text-white text-[24px] font-[250] leading-[24px] text-left">
                    마취안전 예측
                </p>

                {isAnesthesia?.length > 0 && isPaired ? (
                    <div className="flex gap-x-2 items-center">
                        <div className="flex justify-center items-center px-3 py-4 gap-x-[9px] bg-[rgba(255,255,255,0.05)] rounded-[20px]">
                            <div
                                className={`w-4 h-4 rounded-full ${
                                    isAnesthesia?.[0]?.warningLevel === "DANGER"
                                        ? "bg-[#ED6B5B]"
                                        : "bg-[rgba(255,255,255,0.10)] "
                                }`}
                            ></div>
                            <div
                                className={`w-4 h-4 rounded-full  ${
                                    isAnesthesia?.[0]?.warningLevel ===
                                    "WARNING"
                                        ? "bg-[#F9AC68]"
                                        : "bg-[rgba(255,255,255,0.10)]"
                                }`}
                            ></div>
                            <div
                                className={`w-4 h-4 rounded-full  ${
                                    isAnesthesia?.[0]?.warningLevel === "NORMAL"
                                        ? "bg-[#15CF8F]"
                                        : "bg-[rgba(255,255,255,0.10)]"
                                }`}
                            ></div>
                        </div>
                        <div className="flex w-full items-baseline gap-x-1">
                            <p className="text-white text-[28px] italic font-[100] leading-4">
                                {Math.trunc(
                                    isAnesthesia?.[0]?.riskLevel * 1000
                                ) / 10}
                            </p>
                            <p className="text-white text-[14px] italic font-normal leading-4">
                                %
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-white text-[24px] font-bold leading-8 text-left pt-[21px]">
                            (없음)
                        </p>
                    </div>
                )}
            </button>
        </div>
    );
};
export default Ai;
