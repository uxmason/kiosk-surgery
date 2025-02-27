import { ReactNode } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const CustomModal = ({ isOpen, onClose, children }: Props) => {
    return (
        <div
            data-current={isOpen}
            className={`fixed flex w-full h-full inset-0 backdrop-blur-[20px] bg-[rgba(29,31,45,.6)] transition-all duration-300 ${
                isOpen
                    ? "opacity-100 pointer-events-auto z-10"
                    : "opacity-0 pointer-events-none hidden"
            }`}>
            <div className={`absolute w-full h-full`} onClick={onClose}></div>
            <div className={`flex w-full mx-[90px]`}>{children}</div>
        </div>
    );
};

export default CustomModal;
