const Inbody = () => {
    return (
        <div className="flex flex-col bg-[rgba(56,171,190)] pt-[30px] pb-[24.3px] px-[30px] rounded-[15px] w-[228px] h-[285px]">
            <p className="text-white text-[24px] font-[250px] leading-[24px]">
                인바디
            </p>
            <div className="h-full">그래프</div>
            <div className="flex w-full justify-between items-center">
                <div className="bg-white flex justify-center items-center rounded-full w-10 h-10">
                    <svg className="w-5 h-5 text-[rgba(56,171,190)]">
                        <use href="/assets/sprite.svg#icon-search"></use>
                    </svg>
                </div>
                <div>
                    <p className="text-white font-bold leading-[16px] text-[10px]">
                        키:
                        <span className="text-[16px]">178</span>
                        cm
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Inbody;
