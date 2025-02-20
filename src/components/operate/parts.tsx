"use client";

import { useState } from "react";

const Parts = () => {
    const buttonData = [...frontButtonData, ...backButtonData];
    const [selectedButtons, setSelectedButtons] = useState(
        buttonData.map((button) => ({
            id: button.id,
            selected: false,
        }))
    );
    const isSelectedButtons = selectedButtons?.filter(
        (s) => s.selected === true
    );

    const handleButtonClick = (id: number) => {
        setSelectedButtons((prevState) =>
            prevState.map((button) =>
                button.id === id
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
                    {frontButtonData.map((button) => {
                        const selectedButton = selectedButtons.find(
                            (item) => item.id === button.id
                        );
                        const isSelected = selectedButton?.selected || false;

                        return (
                            <button
                                key={button.id}
                                onClick={() => handleButtonClick(button.id)}
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
                    {backButtonData.map((button) => {
                        const selectedButton = selectedButtons.find(
                            (item) => item.id === button.id
                        );
                        const isSelected = selectedButton?.selected || false;

                        return (
                            <button
                                key={button.id}
                                onClick={() => handleButtonClick(button.id)}
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
                                        왼쪽 다리 사타구니
                                    </p>
                                    <p className="text-white text-[16px] font-light leading-[16px]">
                                        기록일: 24.08.08 12:12
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

const frontButtonData = [
    { style: { top: "14%", left: "8%" }, id: 2 },
    { style: { top: "14%", right: "8%" }, id: 1 },
    { style: { top: "48%", left: "44%" }, id: 3 },
    { style: { top: "62%", left: "44%" }, id: 4 },
    { style: { top: "70%", left: "26%" }, id: 5 },
    { style: { top: "70%", right: "26%" }, id: 6 },
];

const backButtonData = [
    { style: { top: "14%", left: "8%" }, id: 7 },
    { style: { top: "14%", right: "8%" }, id: 8 },
    { style: { top: "48%", left: "44%" }, id: 9 },
    { style: { top: "62%", left: "44%" }, id: 10 },
    { style: { top: "85%", left: "32%" }, id: 11 },
    { style: { top: "85%", right: "32%" }, id: 12 },
];
