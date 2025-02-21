interface Props {
    setIsModalImgsOpen: (v: boolean) => void;
}
const Photo = ({ setIsModalImgsOpen }: Props) => {
    return (
        <button
            className="flex flex-col text-start bg-[#169B7C] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setIsModalImgsOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                사진
            </p>
            <div className="h-full">사진</div>
            <div className="flex w-full justify-between items-center">
                <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                    <svg className="w-5 h-5 text-[#169B7C]">
                        <use href="/assets/sprite.svg#icon-search"></use>
                    </svg>
                </div>
                <div>
                    <p className="text-white font-bold leading-[14px] text-[10px]">
                        최종촬영:{" "}
                        <span className="text-[14px] pl-[1px]">24.07.08</span>
                    </p>
                </div>
            </div>
        </button>
    );
};
export default Photo;
