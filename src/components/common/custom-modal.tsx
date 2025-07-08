import { ReactNode, useEffect } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    top?: number;
    isComplete?: boolean;
    btnClass?: boolean;
}

const CustomModal = ({
    isOpen,
    onClose,
    children,
    top,
    isComplete,
    btnClass,
}: Props) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    return (
        <div
            data-current={isOpen}
            className={`fixed flex w-full h-full inset-0 backdrop-blur-[20px] bg-[rgba(29,31,45,.6)] transition-all duration-300 ${
                isOpen
                    ? "opacity-100 pointer-events-auto z-10"
                    : "opacity-0 pointer-events-none hidden"
            }`}
        >
            <div className={`absolute w-full h-full`} onClick={onClose}></div>
            <div className={`flex w-full mx-[90px]`}>{children}</div>
            {!isComplete && top && (
                <div
                    className="absolute flex w-full justify-center"
                    style={{
                        top: `${top}px`,
                    }}
                >
                    <button
                        onClick={onClose}
                        className={`${
                            btnClass
                                ? "bg-[#F05579] w-60"
                                : "bg-[#15CF8F] w-120 "
                        } h-30 rounded-[15px] text-white text-[32px] font-bold leading-8`}
                    >
                        닫기
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomModal;
