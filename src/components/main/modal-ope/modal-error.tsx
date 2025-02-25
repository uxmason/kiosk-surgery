import { CustomModal } from "@/components/common";
interface Props {
    isErrorOpen: boolean;
    setIsErrorOpen: (v: boolean) => void;
}
const ModalError = ({ isErrorOpen, setIsErrorOpen }: Props) => {
    return (
        <CustomModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)}>
            <div className="flex flex-col items-center w-full pt-[370px]">
                <p className="text-white text-[54px] font-bold leading-[54px]">{`"이미 등록된 기기가 있습니다."`}</p>
                <p className="text-white text-[32px] w-[800px] text-center font-bold leading-[54px] pt-[61px] pb-[87px]">
                    원장님은 이미 다른 기기에서 수술을 진행한 이력이 있습니다.
                    이전 기기의 페어링을 해제하고 이 기기로 등록할까요?
                </p>
                <button
                    className="w-[480px] h-[120px] text-center bg-[#15CF8F] rounded-[15px]"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <p className="text-white text-[32px] font-bold leading-[32px]">
                        이 기기를 등록하겠습니다.
                    </p>
                </button>
            </div>
        </CustomModal>
    );
};
export default ModalError;
