interface Props {
    setIsModalImgsOpen: (v: boolean) => void;
    imgs: never[];
    isError: boolean;
}
const Photo = ({ setIsModalImgsOpen, imgs, isError }: Props) => {
    return (
        <button
            className="flex flex-col  text-start bg-[#169B7C] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]"
            onClick={() => setIsModalImgsOpen(true)}
        >
            <p className="text-white text-[24px] font-[250] leading-[24px]">
                사진
            </p>
            {!isError ? (
                <>
                    <div className="w-full h-[99px] max-h-[99px] grid grid-cols-5 mt-9">
                        {Array.from({ length: 15 }, (_, i) => {
                            console.log(imgs);
                            return (
                                <div
                                    key={i}
                                    className="w-full h-[33px] bg-white"
                                    style={{
                                        backgroundColor: imgs?.[i]?.[0]?.[
                                            "filename"
                                        ]
                                            ? "#fff"
                                            : "#ccc", // imgs[i] 값이 없으면 연한 회색
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="flex w-full justify-between items-center pt-[26px]">
                        <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                            <svg className="w-5 h-5 text-[#169B7C]">
                                <use href="/assets/sprite.svg#icon-search"></use>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-bold leading-[14px] text-[10px]">
                                최종촬영:{" "}
                                <span className="text-[14px] pl-[1px]">
                                    24.07.08
                                </span>
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-start pt-[21px]">
                    <p className="text-white text-[24px] font-bold leading-8">
                        (없음)
                    </p>
                </div>
            )}
        </button>
    );
};
export default Photo;
