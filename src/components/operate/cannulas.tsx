"use client";
import { getFormattedDate, removeSpace } from "@/function";
import { parseCannulShapeType, parseCannulTipType } from "@/parse";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { CannulaListType } from "@/type";
import { chunk } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
interface Props {
    selectedCannulaIds: string[];
    setSelectedCannulaIds: Dispatch<SetStateAction<string[]>>;
    setIsOpenAddCannualModal: (v: boolean) => void;
    cannulaInSurgeryList: CannulaListType[];
    isIdForEdit: number | null;
    setIsIdForEdit: (v: number | null) => void;
    setIsDeleteCdmtId: (v: boolean) => void;
}
const Cannulas = ({
    selectedCannulaIds,
    setSelectedCannulaIds,
    setIsOpenAddCannualModal,
    cannulaInSurgeryList,
    isIdForEdit,
    setIsIdForEdit,
    setIsDeleteCdmtId,
}: Props) => {
    const today = getFormattedDate();
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [isEdit, setIsEdit] = useState(false);
    const cannulaPages = chunk(cannulaInSurgeryList ?? [], 8);

    const handleSelectCannula = (id: string) => {
        const data: DataType = {
            deviceId: deviceId,
            cannulaID: id,
            psEntry: client?.psEntry,
            opDate: today,
            doctorId: doctor?.id,
        };
        if (selectedCannulaIds?.includes(id)) {
            handleInDirectDeleteCannula(data).then((res) => {
                if (!res.success) {
                    return toast.error(res.message);
                }
            });
        } else {
            handleDirectAddCannula(data).then((res) => {
                if (!res.success) {
                    return toast.error(res.message);
                }
            });
        }
        setSelectedCannulaIds((prev) =>
            prev?.includes(id)
                ? prev?.filter((cId) => cId !== id)
                : [...prev, id]
        );
    };

    const handleDirectAddCannula = async (data: DataType) => {
        const url = `/api/kiosk-surgery/cannula/direct-add`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.error("API 호출 실패", response.status);
            }
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const handleInDirectDeleteCannula = async (data: DataType) => {
        const url = `/api/kiosk-surgery/cannula/in-direct-delete`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                console.error("API 호출 실패", response.status);
            }
        } catch (error) {
            console.error("에러 발생", error);
        }
    };
    return (
        <div className="flex flex-col w-full">
            <div className="flex pl-[60px] items-end justify-between pt-10">
                {isEdit ? (
                    <p className="text-[#F05579] text-[32px] font-bold leading-8 pb-3">
                        {`“캐뉼라 툴을 삭제할 수 있습니다.”`}
                    </p>
                ) : (
                    <p className="text-white text-[32px] font-bold leading-8 pb-3">
                        {`"사용한 `}
                        <span className="text-[#15CF8F]">캐뉼라</span>
                        {` 툴을 선택해주세요."`}
                    </p>
                )}
                <button
                    onClick={() => {
                        setIsEdit((isEdit) => !isEdit);
                        if (!isEdit) {
                            setIsIdForEdit(null);
                        }
                    }}
                    className={`text-center rounded-[15px] w-[160px] h-[95px] mr-5
                        ${
                            isEdit
                                ? "bg-[#F05579]"
                                : "bg-[rgba(255,255,255,0.25)]"
                        }
                        `}
                >
                    <p className="text-white text-[28px] font-bold leading-[28px]">
                        {isEdit ? "편집 중" : "목록 편집"}
                    </p>
                </button>
            </div>
            <div className="relative pt-7 px-5 w-full rounded-[15px]">
                <div className="absolute swiper-button-prev left-[-1.8%] top-[52%] transform -translate-y-[52%] w-[85px] h-[85px] bg-[rgba(0,0,0,0.15)] rounded-full flex items-center justify-center cursor-pointer z-10">
                    <img src="/assets/swiper-prev.svg" width={24} height={24} />
                </div>
                <div className="absolute swiper-button-next right-[-1.8%] top-[52%] transform -translate-y-[52%] w-[85px] h-[85px] bg-[rgba(0,0,0,0.15)] rounded-full flex items-center justify-center cursor-pointer z-10">
                    <img src="/assets/swiper-next.svg" width={24} height={24} />
                </div>
                <div className="flex w-full h-[630px] bg-[rgba(58,62,89,0.15)] rounded-[15px]">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={0}
                        modules={[Navigation]}
                        className="w-full h-full"
                        navigation={{
                            prevEl: ".swiper-button-prev",
                            nextEl: ".swiper-button-next",
                        }}
                    >
                        {cannulaPages?.length > 0 ? (
                            cannulaPages.map((page, pageIndex) => {
                                const isLastPage =
                                    cannulaPages.length - 1 === pageIndex;
                                return (
                                    <SwiperSlide
                                        key={pageIndex}
                                        className="w-full h-full px-5 py-5"
                                    >
                                        <div className="grid grid-cols-4 grid-rows-2 gap-[20px]">
                                            {page.map((c, index) => {
                                                const tipColor =
                                                    parseCannulTipType(
                                                        removeSpace(c?.TIP) as
                                                            | "사선형"
                                                            | "블런트형"
                                                            | "샤프형"
                                                    )?.color;
                                                const shapeColor =
                                                    parseCannulShapeType(
                                                        c?.SHAPE as
                                                            | "직선형"
                                                            | "컨케이브"
                                                    )?.color;

                                                return (
                                                    <button
                                                        key={index}
                                                        className={`relative flex flex-col text-start w-[235px] h-[285px] px-[30px] py-[30px] rounded-[15px]
                                    ${
                                        !isEdit &&
                                        selectedCannulaIds.includes(
                                            c?.CANNULA_ID
                                        )
                                            ? "outline-[5px] outline-[#15CF8F] bg-[#3A3E59]"
                                            : "bg-[rgba(58,62,89,0.50)]"
                                    }`}
                                                        onClick={() => {
                                                            if (!isEdit) {
                                                                handleSelectCannula(
                                                                    c?.CANNULA_ID
                                                                );
                                                            } else {
                                                                setIsIdForEdit(
                                                                    c?.cdmt_id
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {isEdit &&
                                                            isIdForEdit ===
                                                                c?.cdmt_id && (
                                                                <button
                                                                    className="absolute bg-[rgba(248,171,189,0.25)] w-full h-full top-0 left-0 rounded-[10px] flex justify-center items-center"
                                                                    onClick={() =>
                                                                        setIsDeleteCdmtId(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="bg-[rgba(248,171,189,0.35)] w-[100px] h-[100px] rounded-[40px] flex justify-center items-center backdrop-blur-[5px]">
                                                                        <img
                                                                            src="/assets/trash.svg"
                                                                            width={
                                                                                50
                                                                            }
                                                                            height={
                                                                                50
                                                                            }
                                                                            className="object-cover bg-no-repeat w-[50px] h-[50px]"
                                                                        />
                                                                    </div>
                                                                </button>
                                                            )}
                                                        <p className="text-white text-[24px] font-bold leading-6">
                                                            {c?.MODEL_NAME}
                                                        </p>
                                                        <p className="text-white text-[20px] font-light leading-5 pt-[21px]">
                                                            {c?.HOLE_COUNT} /{" "}
                                                            {Number(c?.LENGTH) /
                                                                10}
                                                            cm / {c?.THICKNESS}
                                                            mm
                                                        </p>
                                                        <div className="flex flex-col pt-[50px] gap-y-[10px]">
                                                            <div
                                                                style={{
                                                                    backgroundColor: `${tipColor}33`,
                                                                }}
                                                                className="w-fit py-[15px] px-[15px] rounded-[10px]"
                                                            >
                                                                <p
                                                                    style={{
                                                                        color: tipColor,
                                                                    }}
                                                                    className="text-[20px] font-light leading-5"
                                                                >
                                                                    {c?.TIP}
                                                                </p>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    backgroundColor: `${shapeColor}33`,
                                                                }}
                                                                className="w-fit py-[15px] px-[15px] rounded-[10px]"
                                                            >
                                                                <p
                                                                    style={{
                                                                        color: shapeColor,
                                                                    }}
                                                                    className="text-[20px] font-light leading-5"
                                                                >
                                                                    {c?.SHAPE}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {isLastPage && (
                                                <button
                                                    onClick={() =>
                                                        setIsOpenAddCannualModal(
                                                            true
                                                        )
                                                    }
                                                    className="flex flex-col justify-center items-center w-[235px] h-[285px] px-[30px] py-[30px] rounded-[15px] bg-[rgba(58,62,89,0.50)]"
                                                >
                                                    <img
                                                        src="/assets/add.svg"
                                                        width={64}
                                                        height={64}
                                                    />
                                                    <p className="text-[rgba(255,255,255,0.50)] text-[30px] font-bold leading-6 pt-[26px]">
                                                        툴 추가
                                                    </p>
                                                </button>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })
                        ) : (
                            <SwiperSlide className="w-full h-full px-5 py-5">
                                <div className="grid grid-cols-4 grid-rows-2 gap-[20px]">
                                    <button
                                        onClick={() =>
                                            setIsOpenAddCannualModal(true)
                                        }
                                        className="flex flex-col justify-center items-center w-[235px] h-[285px] px-[30px] py-[30px] rounded-[15px] bg-[rgba(58,62,89,0.50)]"
                                    >
                                        <img
                                            src="/assets/add.svg"
                                            width={64}
                                            height={64}
                                        />
                                        <p className="text-[rgba(255,255,255,0.50)] text-[30px] font-bold leading-6 pt-[26px]">
                                            툴 추가
                                        </p>
                                    </button>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};
export default Cannulas;

type DataType = {
    deviceId: string;
    cannulaID: string;
    psEntry: string;
    opDate: string;
    doctorId: string;
};
