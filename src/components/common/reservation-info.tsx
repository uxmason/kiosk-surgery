const ReservationInfo = () => {
    return (
        <div className="flex flex-col w-full h-[310px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] my-5 py-[30px] px-[35px]">
            <p className="text-white text-[24px] font-bold leading-6">
                수술 예약 정보
            </p>
            <p className="text-[#15CF8F] text-[20px] font-bold leading-5 pt-[31px] pb-[35px]">{`팔+뒷( 기본)+앞( 스몰 - 27cm 이하)`}</p>
            <div className="grid grid-cols-5 row-end-2 w-full gap-y-[30px]">
                {contents?.map((c) => {
                    return (
                        <div
                            key={c?.name}
                            className="flex flex-col gap-y-[14px]"
                        >
                            <p className="text-[rgba(255,255,255,0.50)] text-[16px] font-normal leading-4">
                                {c?.name}
                            </p>
                            <p className="text-white text-[20px] font-bold leading-5">
                                {c?.content}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default ReservationInfo;

const contents: ContentType[] = [
    { name: "시작시간", content: "09:00" },
    { name: "종료시간", content: "12:00" },
    { name: "예상시간", content: "3시간" },
    { name: "추가시간", content: "0시간" },
    { name: "수술기수", content: "01" },
    { name: "병실", content: "13WI" },
    { name: "참관여부", content: "." },
    { name: "우선순위", content: "N" },
    { name: "이식용지방", content: "N" },
    { name: "통역여부", content: "N" },
];

type ContentType = {
    name: string;
    content: string;
};
