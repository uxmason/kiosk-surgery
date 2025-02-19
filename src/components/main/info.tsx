const Info = () => {
    return (
        <div className="relative flex flex-col w-[476px] bg-[#3A3E59] rounded-[15px] pt-[30px] pl-[30px] pb-[24px]">
            <div className="absolute bg-[url('/images/doctor.png')] w-[150px] h-[220px] bg-no-repeat bottom-0 right-10" />
            <p className="text-white text-[24px] font-[250] leading-[24px] pb-[31px]">
                담당의
            </p>
            <p className="text-white text-[32px] font-bold leading-[32px] text-justify">
                홍성훈
                <span className="text-[24px] font-[250] pl-4">원장</span>
            </p>
            <div className="flex text-white pt-[43px] gap-x-[35px]">
                <div className="flex flex-col gap-y-[14px]">
                    <p className="text-[16px] font-bold leading-[16px]">
                        허벅지
                    </p>
                    <p className="text-[12px] font-normal leading-[16px]">
                        수술부위
                    </p>
                </div>
                <div className="flex flex-col gap-y-[14px]">
                    <p className="text-[16px] font-bold leading-[16px]">
                        13:30
                    </p>
                    <p className="text-[12px] font-normal leading-[16px]">
                        시작시간
                    </p>
                </div>
                <div className="flex flex-col gap-y-[14px]">
                    <p className="text-[16px] font-bold leading-[16px]">
                        OPE0385
                    </p>
                    <p className="text-[12px] font-normal leading-[16px]">
                        수술코드
                    </p>
                </div>
            </div>
            <div className="bg-[url('/assets/setting.svg')] w-[22px] h-[22px] mt-[34px] bg-no-repeat" />
        </div>
    );
};
export default Info;
