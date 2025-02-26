"use client";

import { formatDate } from "@/function";
import {
    ButtonDataType,
    IncisionListType,
    UpdatedButtonDataType,
} from "@/type";
import { useState } from "react";
interface Props {
    incisionList: IncisionListType[];
}
const Parts = ({ incisionList }: Props) => {
    const mergeData = (
        buttonData: ButtonDataType[],
        incisionList: IncisionListType[]
    ) => {
        return buttonData?.map((button) => {
            const match = incisionList?.find(
                (data) => data.AJAX_ID === String(button.id)
            );
            return { ...button, ...match, selected: false };
        });
    };

    const updatedFrontButtonData: UpdatedButtonDataType[] = mergeData(
        frontButtonData,
        incisionList
    );
    const updatedBackButtonData: UpdatedButtonDataType[] = mergeData(
        backButtonData,
        incisionList
    );
    const updatedButtonData = [
        ...updatedFrontButtonData,
        ...updatedBackButtonData,
    ];
    const [selectedButtons, setSelectedButtons] = useState(
        updatedButtonData?.map((button) => ({
            id: button?.AJAX_ID,
            POINT_NAME: button?.POINT_NAME,
            selected: false,
        }))
    );
    const isSelectedButtons = selectedButtons?.filter(
        (s) => s?.selected === true
    );

    const handleButtonClick = (id: string | undefined) => {
        if (!id) return;
        setSelectedButtons(
            selectedButtons?.map((button) =>
                button?.id === id
                    ? { ...button, selected: !button.selected }
                    : button
            )
        );
    };

    return (
        <div className="flex flex-col pt-[50px] w-full px-5">
            <p className="text-white text-[32px] font-bold leading-8">
                {`“수술 `}
                <span className="text-[#15CF8F]">절개부</span>
                {` 위치를 기록해주세요.”`}
            </p>
            <div className="flex w-full h-[440px] bg-[rgba(58,62,89,0.15)] gap-x-5 rounded-[15px] mt-7 mb-[5px] px-5 py-5">
                <div className="relative">
                    {updatedFrontButtonData?.map((button) => {
                        const selectedButton = selectedButtons?.find(
                            (item) => item?.id === button?.AJAX_ID
                        );
                        const isSelected = selectedButton?.selected || false;

                        return (
                            <button
                                key={button.id}
                                onClick={() =>
                                    handleButtonClick(button?.AJAX_ID)
                                }
                                className={`absolute rounded-full border-solid transition-all duration-300 ease-in-out ${
                                    isSelected
                                        ? "w-15 h-15 border-[12px] border-[#15CF8F] bg-white"
                                        : "w-10 h-10 border-[8px] border-white"
                                }`}
                                style={button.style}
                            ></button>
                        );
                    })}
                    <img
                        src="/images/body-front.png"
                        width={320}
                        height={400}
                    />
                </div>
                <div className="relative">
                    {updatedBackButtonData?.map((button) => {
                        const selectedButton = selectedButtons?.find(
                            (item) => item?.id === button?.AJAX_ID
                        );
                        const isSelected = selectedButton?.selected || false;

                        return (
                            <button
                                key={button.id}
                                onClick={() =>
                                    handleButtonClick(button?.AJAX_ID)
                                }
                                className={`absolute rounded-full border-solid transition-all duration-300 ease-in-out ${
                                    isSelected
                                        ? "w-15 h-15 border-[12px] border-[#15CF8F] bg-white"
                                        : "w-10 h-10 border-[8px] border-white"
                                }`}
                                style={button.style}
                            ></button>
                        );
                    })}
                    <img src="/images/body-back.png" width={320} height={400} />
                </div>
                <div className="flex flex-col w-full max-w-[320px] overflow-y-scroll gap-y-[11px]">
                    {isSelectedButtons?.map((sb) => {
                        return (
                            <button
                                key={`${sb.id}_${sb.selected}`}
                                className="flex items-center justify-between w-full bg-[rgba(58,62,89,0.50)] rounded-[10px] px-[25px] py-5"
                                onClick={() => handleButtonClick(sb?.id)}
                            >
                                <div className="flex flex-col items-start w-full gap-y-3">
                                    <p className="text-white text-[22px] font-bold leading-[22px]">
                                        {sb?.POINT_NAME}
                                    </p>
                                    <p className="text-white text-[16px] font-light leading-[16px]">
                                        기록일: {formatDate()}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center w-[50px] h-10 bg-[#F05579] rounded-[10px]">
                                    <p className="text-white text-[14px] font-bold leading-[14px]">
                                        해제
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default Parts;

const frontButtonData: ButtonDataType[] = [
    { style: { top: "14%", right: "8%" }, id: 2 },
    { style: { top: "14%", left: "8%" }, id: 1 },
    { style: { top: "48%", left: "44%" }, id: 3 },
    { style: { top: "62%", left: "44%" }, id: 4 },
    { style: { top: "70%", right: "26%" }, id: 5 },
    { style: { top: "70%", left: "26%" }, id: 6 },
];

const backButtonData: ButtonDataType[] = [
    { style: { top: "14%", right: "8%" }, id: 7 },
    { style: { top: "14%", left: "8%" }, id: 8 },
    { style: { top: "48%", left: "55%" }, id: 9 },
    { style: { top: "48%", left: "33%" }, id: 10 },
    { style: { top: "62%", left: "44%" }, id: 11 },
    { style: { top: "85%", right: "32%" }, id: 12 },
    { style: { top: "85%", left: "32%" }, id: 13 },
];
