import { handleBirthToAge } from "@/function";
import { parseSexType } from "@/parse";
import { OpeClientType } from "@/type";

interface Props {
    setIsOpenOpeModal: (v: boolean) => void;
    isOpeInfo: OpeClientType[];
}
const ClientInfo = ({ setIsOpenOpeModal, isOpeInfo }: Props) => {
    const info = isOpeInfo?.[0];
    const sex =
        info?.주민번호?.slice(6, 7) === "2" ||
        info?.주민번호?.slice(6, 7) === "4"
            ? "F"
            : "M";
    return (
        <div className="flex w-full gap-x-5 px-5 pt-5">
            <div className="flex w-[885px] h-[135px] pt-[30px] pb-[41px] px-10 rounded-[15px] bg-[rgba(58,62,89,0.15)]">
                <div className="flex flex-col gap-y-4 w-[190px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객번호
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        {info?.고객번호}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객명
                    </p>
                    <p className="text-white text-[32px] font-light leading-6">
                        {info?.고객명}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[100px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        성별
                    </p>
                    <p
                        style={{
                            color: parseSexType(sex).color,
                        }}
                        className="text-[24px] font-bold leading-6"
                    >
                        {parseSexType(sex).text}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        나이
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        {handleBirthToAge(info?.주민번호)}세
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        부위
                    </p>
                    <p className="text-[#38ABBE] text-[32px] font-light leading-6">
                        {info?.수술부위}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        수술코드
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        {info?.수술코드}
                    </p>
                </div>
            </div>
            <button
                className="flex w-[135px] h-[135px] rounded-[15px] bg-[rgba(58,62,89,0.50)] items-center justify-center"
                onClick={() => setIsOpenOpeModal(true)}
            >
                <div className="bg-[url('/assets/menu-tab.svg')] w-18 h-18" />
            </button>
        </div>
    );
};
export default ClientInfo;
