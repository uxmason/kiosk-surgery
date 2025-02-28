interface OpeInfoItem {
    "담당의ID": string;
    "담당의명": string;
    "수술부위": string;
    "시작시간": string;
    "수술코드": string;
}
interface Props {
    dataOpeInfo: OpeInfoItem[];
    isPaired: boolean;
    setOpeOpen: (v: boolean) => void;
}
const Info = ({ dataOpeInfo, setOpeOpen, isPaired }: Props) => {
    const info = dataOpeInfo[0];
    return (
        <button
            className="relative flex flex-col text-start w-[476px] h-[285px] bg-[#3A3E59] rounded-[15px] p-[30px]"
            onClick={() => setOpeOpen(true)}>
            <p className="text-white text-[24px] font-[250] leading-[24px]">담당의</p>
            {info && isPaired ? (
                <>
                    <div className={`isPortrait I${info.담당의ID} absolute w-[150px] h-[220px] bg-no-repeat bottom-0 right-10`} />
                    <p className="absolute top-[80px] text-white text-[32px] font-bold leading-[32px] text-justify">
                        {info.담당의명}
                        <span className="text-[24px] font-[250] pl-4">원장</span>
                    </p>
                    <div className="absolute top-[160px] flex text-white gap-x-[35px]">
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">{info.수술부위}</p>
                            <p className="text-[12px] font-normal leading-[16px]">수술부위</p>
                        </div>
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">{info.시작시간.substring(0,2)}:{info.시작시간.substring(2,4)}</p>
                            <p className="text-[12px] font-normal leading-[16px]">시작시간</p>
                        </div>
                        <div className="flex flex-col gap-y-[14px]">
                            <p className="text-[16px] font-bold leading-[16px]">{info.수술코드}</p>
                            <p className="text-[12px] font-normal leading-[16px]">수술코드</p>
                        </div>
                    </div>
                    <div className="absolute top-[200px] bg-[url('/assets/setting.svg')] w-[22px] h-[22px] mt-9 bg-no-repeat" />
                </>
            ) : (
                <div style={{filter: 'drop-shadow(0px 4px 40px rgba(21, 207, 143, .75))'}}className="absolute flex justify-center top-[120px] left-[188px] items-center w-[100px] h-[50px] bg-[#15CF8F] rounded-[10px]">
                    <p className="text-white text-[16px] font-bold leading-[16px]">선택하기</p>
                </div>
            )}
        </button>
    );
};
export default Info;
