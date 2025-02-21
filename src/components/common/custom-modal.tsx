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
            className={`fixed flex w-full max-w-[1080px] h-full inset-0 backdrop-blur-[20px] bg-[rgba(29,31,45,0.50)] transition-all duration-400 ease-in ${
                isOpen
                    ? "opacity-100 pointer-events-auto z-10"
                    : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
        >
            <div className={`flex w-full max-w-[1080px] mx-[90px]`}>
                {children}
            </div>
        </div>
    );
};

export default CustomModal;
