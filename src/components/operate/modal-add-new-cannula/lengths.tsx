import { AddNewCunnulaType, LengthType } from "@/type";
import { Controller, useFormContext } from "react-hook-form";
interface Props {
    lengths: LengthType[];
}
const Lengths = ({ lengths }: Props) => {
    const { control, watch } = useFormContext<AddNewCunnulaType>();
    const length = watch()?.length;
    return (
        <div className="flex flex-col w-[280px] h-[400px] px-5 py-5 bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px]">
            <div className="flex justify-between items-center h-[40px]">
                <p className="text-white text-[24px] font-bold leading-6">
                    길이
                </p>
                <div
                    className={`flex items-center justify-center w-[60px] h-10 transition-all ease-in duration-200 bg-[rgba(21,207,143,0.15)] rounded-[10px] border-[2px] border-solid border-[#15CF8F]
                    ${length ? "opacity-100" : "opacity-0"}
                    `}
                >
                    <p className="text-[#15CF8F] text-[14px] font-bold leading-[14px]">
                        선택됨
                    </p>
                </div>
            </div>
            <div className="flex flex-col pt-5 gap-[10px]">
                <Controller
                    control={control}
                    name="length"
                    render={({ field: { value, onChange } }) => {
                        return (
                            <>
                                {lengths?.map((m) => {
                                    return (
                                        <button
                                            key={m?._id}
                                            className={`w-full text-start py-[15px] px-[15px] rounded-[15px] ${
                                                value === m?._id
                                                    ? "bg-[#3A3E59] outline-[3px] outline-[#15CF8F]"
                                                    : "bg-[rgba(255,255,255,0.05)]"
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (length === m?._id) {
                                                    onChange(null);
                                                } else {
                                                    onChange(m?._id);
                                                }
                                            }}
                                        >
                                            <p className="text-white text-[18px] font-bold leading-5">
                                                {Number(m?.LENGTH) / 10}
                                                <span className="pl-1">cm</span>
                                            </p>
                                        </button>
                                    );
                                })}
                            </>
                        );
                    }}
                />
            </div>
        </div>
    );
};
export default Lengths;
