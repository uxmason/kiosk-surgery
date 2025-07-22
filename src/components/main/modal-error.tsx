import { CustomModal } from "../common";
interface Props {
    isErrorOpen: string;
    setIsErrorOpen: (v: string) => void;
}
const ModalError = ({ isErrorOpen, setIsErrorOpen }: Props) => {
    return (
        <CustomModal
            isOpen={!!isErrorOpen}
            top={680}
            onClose={() => setIsErrorOpen("")}
            btnClass
        >
            <div className="w-full flex flex-col items-center pt-[370px]">
                <p className="text-white text-[54px] font-bold leading-[54px]">
                    {isErrorOpen}
                </p>
                <p className="text-white text-[32px] font-bold leading-[54px] whitespace-break-spaces pt-[61px]">
                    이 기기에 등록되어 있던 수술 정보는 자동 해제되었습니다.
                    {`\n`}
                    예상 못한 상황이라면 365mc HOBIT 팀에게 문의주세요.
                </p>
            </div>
        </CustomModal>
    );
};
export default ModalError;
