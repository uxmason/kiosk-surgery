"use client";

import { useRouter } from "next/navigation";
interface Props {
    text: string;
    bg: string;
    isShow: boolean;
    isShowBtnText?: string;
    path?: string | undefined;
    setIsModalComplete?: (v: boolean) => void;
    isUnpaired?: boolean;
}
const CustomBtn = ({
    text,
    bg,
    isShow,
    isShowBtnText,
    path,
    setIsModalComplete,
    isUnpaired,
}: Props) => {
    const router = useRouter();
    const buttonStyle = {
        backgroundColor: bg,
    };

    const handleClick = () => {
        if (isUnpaired) return;
        if (path) {
            router.push(path);
        } else {
            setIsModalComplete?.(true);
        }
    };

    return (
        <div className="flex w-full px-5">
            {isShow && (
                <button
                    className="flex items-center justify-between w-full max-w-[340px] rounded-[15px] bg-[rgba(255,255,255,0.25)] px-[35px] mr-5"
                    onClick={() => router.back()}
                >
                    <div className="flex items-center justify-center bg-[rgba(255,255,255,0.75)] w-12 h-12 rounded-full">
                        <img
                            src="/assets/left-arrow.svg"
                            width={22}
                            height={24}
                        />
                    </div>
                    <p className="text-white text-[32px] font-bold leading-8">
                        {isShowBtnText}
                    </p>
                </button>
            )}
            <button
                style={buttonStyle}
                className={`w-full min-w-[680px] h-[120px] rounded-[15px]`}
                onClick={() => handleClick()}
            >
                <p className="text-white text-[32px] font-bold leading-[32px]">
                    {text}
                </p>
            </button>
        </div>
    );
};
export default CustomBtn;
