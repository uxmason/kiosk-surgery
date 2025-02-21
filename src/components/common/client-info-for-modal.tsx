const ClientInfoForModal = () => {
    const sex = "F";
    return (
        <div className="flex justify-between w-full h-[135px] mt-[66px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] pt-[30px] pb-[41px] px-[35px] rounded-[15px]">
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객번호
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    210040378
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객명
                </p>
                <p className="text-white text-[32px] font-light leading-6">
                    김서현
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
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
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    나이
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    36.1세
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    부위
                </p>
                <p className="text-[#38ABBE] text-[32px] font-light leading-6">
                    허벅지
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    수술코드
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    OPE0385
                </p>
            </div>
        </div>
    );
};
export default ClientInfoForModal;
