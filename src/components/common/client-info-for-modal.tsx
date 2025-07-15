import { handleBirthToAge } from "@/function";
import { parseOpePart, parseSexType } from "@/parse";
import { useClientStore } from "@/store";
const ClientInfoForModal = () => {
    const { client } = useClientStore();
    const isSex = Number(client?.licence?.slice(6, 7)) % 2 === 0 ? "F" : "M";
    const isAge = handleBirthToAge(client?.licence);
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
        <div className="flex justify-between w-full h-[135px] mt-[66px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] pt-[30px] pb-[41px] px-[35px] rounded-[15px]">
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객번호
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {client?.psEntry}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    고객명
                </p>
                <p className="text-white text-[32px] font-light leading-6">
                    {client?.name}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    성별
                </p>
                <p
                    style={{
                        color: parseSexType(isSex).color,
                    }}
                    className="text-[24px] font-bold leading-6"
                >
                    {parseSexType(isSex)?.text}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    나이
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {isAge}세
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    부위
                </p>
                <p
                    style={{
                        color: parseOpePart(engPart).color,
                    }}
                    className="text-[32px] font-light leading-6"
                >
                    {parseOpePart(engPart).text}
                </p>
            </div>
            <div className="flex flex-col gap-y-4">
                <p className="text-[rgba(255,255,255,0.50)] text-[18px] font-bold leading-6">
                    수술코드
                </p>
                <p className="text-white text-[24px] font-bold leading-6">
                    {client?.opeCode}
                </p>
            </div>
        </div>
    );
};
export default ClientInfoForModal;
