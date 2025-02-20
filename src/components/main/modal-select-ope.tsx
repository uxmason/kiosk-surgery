interface Props {
    isOpen: boolean;
}

const ModalSelectOpe = ({ isOpen }: Props) => {
    return (
        <div
            data-current={isOpen}
            className={`fixed inset-0 backdrop-blur-md bg-[rgba(29,31,45,0.50)] transition-opacity duration-300 ease-in-out ${
                isOpen
                    ? "flex w-full max-w-[1080px] opacity-100 pointer-events-auto "
                    : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className={`flex w-full max-w-[1080px] mx-[90px] transition-all duration-500 ease-in-out ${
                    isOpen
                        ? "opacity-100 transform scale-100"
                        : "opacity-0 transform scale-95"
                }`}
            >
                <div className="flex w-full pt-20 pb-[66px] justify-center">
                    <p className="text-white text-[54px] font-bold leading-[54px]">
                        수술 고객 선택
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModalSelectOpe;
