const AnesthesiaSafety = () => {
    return (
        <div className="flex justify-between w-full h-[135px] my-5 bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] pt-[26px] pb-[25px] px-[35px] rounded-[15px]">
            <div className="w-50">
                <p className="text-white text-[24px] font-bold leading-[42px]">
                    마취 안전
                </p>
                <p className="text-[rgba(255,255,255,0.50)] text-[24px] font-bold leading-[42px]">
                    응급 / 긴급 확률
                </p>
            </div>
            <div className="flex items-center justify-around w-[calc(100%-340px)]">
                <div className="flex flex-col gap-y-[6px]">
                    <p className="text-[rgba(255,255,255,0.30)] text-[16px] text-center font-medium leading-normal">
                        위험
                    </p>
                    <div className="relative w-[130px] h-5 bg-[rgba(255,255,255,0.20)] rounded-[10px] backdrop-blur-[20px]"></div>
                </div>
                <div className="flex flex-col gap-y-[6px]">
                    <p className="text-[rgba(255,255,255,0.30)] text-[16px] text-center font-medium leading-normal">
                        경고
                    </p>
                    <div className="relative w-[130px] h-5 bg-[rgba(255,255,255,0.20)] rounded-[10px] backdrop-blur-[20px]"></div>
                </div>
                <div className="flex flex-col gap-y-[6px]">
                    <p className="text-[#15CF8F] text-[16px] text-center font-medium leading-normal">
                        안전
                    </p>
                    <div className="relative w-[130px] h-5 bg-[#15CF8F] rounded-[10px] backdrop-blur-[20px]">
                        <div className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-[#15CF8F] border-[4px] border-white rounded-full"></div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-baseline pt-[14px] w-[140px]">
                <p className="text-[#15CF8F] italic text-[40px] font-light leading-[44px]">
                    75.7
                </p>
                <p className="text-[#15CF8F] font-[20px] italic leading-[44px]">
                    %
                </p>
            </div>
        </div>
    );
};
export default AnesthesiaSafety;
