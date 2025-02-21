"use client";
interface Props {
    setIsOpeOpen: (v: boolean) => void;
}
const Client = ({ setIsOpeOpen }: Props) => {
    return (
        <button
            className="flex flex-col text-start bg-[rgba(58,62,89,0.50)] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px]"
            onClick={() => setIsOpeOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                고객정보
            </p>
            <p className="text-[rgba(21,207,143)] text-[36px] font-bold leading-[32px] pt-[31px] pb-[41px]">
                허설
            </p>
            <p className="text-white text-[16px] font-[250] leading-[16px] pb-[14px]">
                800423-1******
            </p>
            <p className="text-white text-[16px] font-bold leaing-[16px]">
                210040233
            </p>
            <div className="bg-[url('/assets/setting.svg')] w-[22px] h-[22px] mt-9 bg-no-repeat" />
        </button>
    );
};
export default Client;
