const ClientInfo = () => {
    const sex = "F";
    return (
        <div className="flex w-full gap-x-5">
            <div className="flex w-[885px] h-[135px] pt-[30px] pb-[41px] px-10 rounded-[15px] bg-[rgba(58,62,89,0.15)]">
                <div className="flex flex-col gap-y-4 w-[190px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객번호
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        210040378
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객명
                    </p>
                    <p className="text-white text-[32px] font-light leading-6">
                        김서현
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[100px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        성별
                    </p>
                    <p
                        className={`${
                            sex === "F" ? "text-[#F05579]" : "text-[#38ABBE]"
                        } text-[24px] font-bold leading-6`}
                    >
                        여성
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        나이
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        36.1세
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        부위
                    </p>
                    <p className="text-[#38ABBE] text-[32px] font-light leading-6">
                        허벅지
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        수술코드
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        OPE0385
                    </p>
                </div>
            </div>
            <div className="flex w-[135px] h-[135px] rounded-[15px] bg-[rgba(58,62,89,0.50)] items-center justify-center">
                <div className="bg-[url('/assets/menu-tab.svg')] w-18 h-18" />
            </div>
        </div>
    );
};
export default ClientInfo;
