import { handleBirthToAge } from "@/function";
import { parseOpePart, parseSexType } from "@/parse";
import { useClientStore } from "@/store";

interface Props {
    setIsOpenOpeModal: (v: boolean) => void;
}
const ClientInfo = ({ setIsOpenOpeModal }: Props) => {
    const { client } = useClientStore();
    const sex = Number(client?.licence?.slice(6, 7)) % 2 === 0 ? "F" : "M";
    const isPart = client?.part;
    const engPart =
        isPart === "허벅지"
            ? "THIGH"
            : isPart === "팔"
            ? "ARM"
            : isPart === "복부"
            ? "ABDOMEN"
            : isPart === "등"
            ? "BACK"
            : isPart === "러브핸들"
            ? "LOVEHANDLE"
            : isPart === "엉덩이" || isPart === "힙"
            ? "HIP"
            : isPart === "얼굴"
            ? "FACE"
            : "CALVES";
    return (
        <div className="flex w-full gap-x-5 px-5 pt-5">
            <div className="flex w-[885px] h-[135px] pt-[30px] pb-[41px] px-10 rounded-[15px] bg-[rgba(58,62,89,0.15)]">
                <div className="flex flex-col gap-y-4 w-[190px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객번호
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        {client?.psEntry}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        고객명
                    </p>
                    <p className="text-white text-[32px] font-light leading-6">
                        {client?.name}
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
                        {handleBirthToAge(client?.licence)}세
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        부위
                    </p>
                    <p
                        style={{
                            color: parseOpePart(engPart).color,
                        }}
                        className="text-[32px] font-light leading-6"
                    >
                        {client?.part}
                    </p>
                </div>
                <div className="flex flex-col gap-y-4 w-[150px]">
                    <p className="text-white/50 text-[18px] font-bold leading-6">
                        수술코드
                    </p>
                    <p className="text-white text-[24px] font-bold leading-6">
                        {client?.opeCode}
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
