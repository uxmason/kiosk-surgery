import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    aiType: "DOCTOR" | "AVERAGE";
}
const GraphAi = ({ children, aiType }: Props) => {
    return (
        <div className="flex flex-col w-full h-[400px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] py-[30px] px-[35px]">
            {children}
            <div className="flex flex-col w-full h-full pt-[51px] gap-y-[46px]">
                <div className="flex w-full">
                    <div className="flex gap-x-[15px] w-[205px]">
                        <div className="flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[15px] border-[5px] border-solid border-[#15CF8F]">
                            <img src="/assets/arm.svg" width={33} height={25} />
                        </div>
                        <p className="text-[#15CF8F] text-[44px] font-light leading-11">
                            팔
                        </p>
                    </div>
                    <div className="flex flex-col w-full max-w-[440px] gap-y-[10px]">
                        <p className="text-white text-[20px] font-bold leading-5 w-fit">
                            추출 예측량
                            <span className="text-[16px] font-light pl-4">
                                최소:
                            </span>
                            10
                            <span className="text-[16px] font-light pl-4">
                                최대:
                            </span>
                            2,150
                        </p>
                        <div className="w-[440px] h-5 rounded-[10px] bg-[rgba(255,255,255,0.20)] backdrop-blur-[20px]">
                            <div
                                className={`relative w-[196px] h-full bg-[#15CF8F] backdrop-blur-[20px] rounded-[10px]
                                ${
                                    aiType === "DOCTOR"
                                        ? "bg-[#15CF8F]"
                                        : "bg-[rgba(255,255,255,0.50)] backdrop-blur-[20px]"
                                }`}
                            >
                                <div
                                    className={`absolute top-[-4] left-[42%] w-7 h-7 rounded-full border-[4px] border-solid border-white
                                    ${aiType === "AVERAGE" && "bg-[#3A3E59]"}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-[165px] text-end">
                        <p
                            className={`text-[44px] font-light italic leading-11
                            ${
                                aiType === "DOCTOR"
                                    ? "text-[#15CF8F]"
                                    : "text-white"
                            }
                            `}
                        >
                            993<span className="text-[20px]">cc</span>
                        </p>
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="flex gap-x-[15px] w-[205px]">
                        <div className="flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[15px] border-[5px] border-solid border-[#ED6B5B]">
                            <img
                                src="/assets/abdomen.svg"
                                width={35.5}
                                height={29}
                            />
                        </div>
                        <p className="text-[#ED6B5B] text-[44px] font-light leading-11">
                            복부
                        </p>
                    </div>
                    <div className="flex flex-col w-[440px] gap-y-[10px]">
                        <p className="text-white text-[20px] font-bold leading-5 w-fit">
                            추출 예측량
                            <span className="text-[16px] font-light pl-4">
                                최소:
                            </span>
                            200
                            <span className="text-[16px] font-light pl-4">
                                최대:
                            </span>
                            4,200
                        </p>
                        <div className="w-[440px] h-5 rounded-[10px] bg-[rgba(255,255,255,0.20)] backdrop-blur-[20px]">
                            <div
                                className={`relative left-[7%] w-[220px] h-full bg-[#15CF8F] backdrop-blur-[20px] rounded-[10px]
                                ${
                                    aiType === "DOCTOR"
                                        ? "bg-[#15CF8F]"
                                        : "bg-[rgba(255,255,255,0.50)] backdrop-blur-[20px]"
                                }`}
                            >
                                <div
                                    className={`absolute top-[-4] left-[42%] w-7 h-7 rounded-full border-[4px] border-solid border-white
                                    ${aiType === "AVERAGE" && "bg-[#3A3E59]"}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-[165px] text-end">
                        <p
                            className={`text-[44px] font-light italic leading-11
                            ${
                                aiType === "DOCTOR"
                                    ? "text-[#15CF8F]"
                                    : "text-white"
                            }
                            `}
                        >
                            2,011<span className="text-[20px]">cc</span>
                        </p>
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="flex gap-x-[15px] w-[205px]">
                        <div className="flex items-center justify-center w-[50px] h-[50px] bg-white rounded-[15px] border-[5px] border-solid border-[#38ABBE]">
                            <img
                                src="/assets/thigh.svg"
                                width={33}
                                height={25}
                            />
                        </div>
                        <p className="text-[#38ABBE] text-[44px] font-light leading-11">
                            허벅지
                        </p>
                    </div>
                    <div className="flex flex-col w-full max-w-[440px] gap-y-[10px]">
                        <p className="text-white text-[20px] font-bold leading-5 w-fit">
                            추출 예측량
                            <span className="text-[16px] font-light pl-4">
                                최소:
                            </span>
                            50
                            <span className="text-[16px] font-light pl-4">
                                최대:
                            </span>
                            5,500
                        </p>
                        <div className="w-[440px] h-5 rounded-[10px] bg-[rgba(255,255,255,0.20)] backdrop-blur-[20px]">
                            <div
                                className={`relative w-[305px] h-full bg-[#15CF8F] backdrop-blur-[20px] rounded-[10px]
                                ${
                                    aiType === "DOCTOR"
                                        ? "bg-[#15CF8F]"
                                        : "bg-[rgba(255,255,255,0.50)] backdrop-blur-[20px]"
                                }`}
                            >
                                <div
                                    className={`absolute top-[-4] left-[42%] w-7 h-7 rounded-full border-[4px] border-solid border-white
                                    ${aiType === "AVERAGE" && "bg-[#3A3E59]"}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-[165px] text-end">
                        <p
                            className={`text-[44px] font-light italic leading-11
                            ${
                                aiType === "DOCTOR"
                                    ? "text-[#15CF8F]"
                                    : "text-white"
                            }
                            `}
                        >
                            2,357<span className="text-[20px]">cc</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GraphAi;
