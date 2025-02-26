interface Props {
    isOpeInfo: never[];
    isUnpaired: boolean;
    setOpeOpen: (v: boolean) => void;
}
const Info = ({ isOpeInfo, setOpeOpen, isUnpaired }: Props) => {
    const info = isOpeInfo?.[0];
    return (
        <button
            className="relative flex flex-col text-start w-[476px] h-[285px] bg-[#3A3E59] rounded-[15px] pt-[30px] pl-[30px] pb-[24px]"
            onClick={() => setOpeOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px] pb-[31px]">
                담당의
            </p>
            {!isUnpaired ? (
                <>
                    <div
                        className={`isPortrait I${info?.["담당의ID"]} absolute w-[150px] h-[220px] bg-no-repeat bottom-0 right-10`}
                    />
                    <p className="text-white text-[32px] font-bold leading-[32px] text-justify">
                        {info?.["담당의명"]}
                        <span className="text-[24px] font-[250] pl-4">
                            원장
                        </span>
                    </p>
                    <div className="flex text-white pt-[43px] gap-x-[35px]">
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">
                                {info?.["수술부위"]}
                            </p>
                            <p className="text-[12px] font-normal leading-[16px]">
                                수술부위
                            </p>
                        </div>
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">
                                {info?.["시작시간"]}
                            </p>
                            <p className="text-[12px] font-normal leading-[16px]">
                                시작시간
                            </p>
                        </div>
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">
                                {info?.["수술코드"]}
                            </p>
                            <p className="text-[12px] font-normal leading-[16px]">
                                수술코드
                            </p>
                        </div>
                    </div>
                    <div className="bg-[url('/assets/setting.svg')] w-[22px] h-[22px] mt-[34px] bg-no-repeat" />
                </>
            ) : (
                <div className="flex justify-center mt-[34px] ml-[158px] items-center w-[100px] h-[50px] bg-[#15CF8F] rounded-[10px]">
                    <p className="text-white text-[16px] font-bold leading-[16px]">
                        선택하기
                    </p>
                </div>
            )}
        </button>
    );
};
export default Info;
