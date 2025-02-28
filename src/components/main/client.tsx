"use client";

import { maskIdNumber } from "@/function";

interface Props {
    isPaired: boolean;
    setOpeOpen: (v: boolean) => void;
    dataOpeInfo: never[];
}
const Client = ({ isPaired, setOpeOpen, dataOpeInfo }: Props) => {
    const info = dataOpeInfo?.[0];
    return (
        <button
            className="flex flex-col text-start bg-[rgba(58,62,89,0.50)] p-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setOpeOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                고객정보
            </p>
            {info && isPaired ? (
                <>
                    <p className="text-[rgba(21,207,143)] text-[36px] font-bold leading-[32px] pt-[31px] pb-[41px]">
                        {info?.["고객명"]}
                    </p>
                    <p className="text-white text-[16px] font-[250] leading-[16px] pb-[14px]">
                        {maskIdNumber(String(info?.["주민번호"]))}
                    </p>
                    <p className="text-white text-[16px] font-bold leaing-[16px]">
                        {info?.["고객번호"]}
                    </p>
                    <div className="absolute top-[200px] bg-[url('/assets/setting.svg')] w-[22px] h-[22px] mt-9 bg-no-repeat" />
                </>
            ) : (
                <div className="absolute flex justify-center top-[120px] left-[64px] items-center w-[100px] h-[50px] bg-[#15CF8F] rounded-[10px]" style={{filter: 'drop-shadow(0px 4px 40px rgba(21, 207, 143, .75))'}}>
                    <p className="text-white text-[16px] font-bold leading-[16px]">
                        선택하기
                    </p>
                </div>
            )
        }
        </button>
    );
};
export default Client;
