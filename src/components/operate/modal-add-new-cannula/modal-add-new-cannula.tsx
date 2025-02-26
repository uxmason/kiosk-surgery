import { FormProvider, useForm } from "react-hook-form";
import { BtnAdd, Holes, Lengths, Models, Shapes, Thickness, Tips } from ".";
import { CustomModal } from "../../common";
import {
    AddNewCunnulaType,
    HolelCountType,
    ModelNameType,
    ShapesType,
    TipsType,
    LengthType,
    ThicknessType,
} from "@/type";
import { useEffect, useState } from "react";
import { cannulaUrl } from "@/variables";
interface Props {
    isOpenAddCannualModal: boolean;
    setIsOpenAddCannualModal: (v: boolean) => void;
}
const MoodalAddNewCannula = ({
    isOpenAddCannualModal,
    setIsOpenAddCannualModal,
}: Props) => {
    const [modelNames, setModelNames] = useState<ModelNameType[]>([]);
    const [holeCounts, setHoleCounts] = useState<HolelCountType[]>([]);
    const [tips, setTips] = useState<TipsType[]>([]);
    const [shapes, setShapes] = useState<ShapesType[]>([]);
    const [lengths, setLengths] = useState<LengthType[]>([]);
    const [thickness, setThickness] = useState<ThicknessType[]>([]);
    // 캐뉼라 정보 불러오기
    const handleSelectCannulaSpec = async () => {
        try {
            const response = await fetch(`${cannulaUrl}/spec/`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (!isOpenAddCannualModal) return;
        handleSelectCannulaSpec().then((res) => {
            if (res.success) {
                setModelNames(res.modelNames);
                setHoleCounts(res.holeCounts);
                setTips(res.tips);
                setShapes(res.shapes);
                setLengths(res.length);
                setThickness(res.thickness);
            } else {
                console.log("SPEC_ERROR");
            }
        });
    }, [isOpenAddCannualModal]);
    const method = useForm<AddNewCunnulaType>();
    const { reset } = method;

    useEffect(() => {
        reset({
            model: undefined,
            hole: undefined,
            tip: undefined,
            shape: undefined,
            length: undefined,
            thick: undefined,
        });
    }, [isOpenAddCannualModal]);

    return (
        <FormProvider {...method}>
            <CustomModal
                isOpen={isOpenAddCannualModal}
                onClose={() => setIsOpenAddCannualModal(false)}
            >
                <div className="flex flex-col w-full h-full items-center pt-20">
                    <p className="text-white text-[54px] font-bold leading-[54px]">
                        신규 캐뉼라 등록
                    </p>
                    <div className="w-full grid grid-cols-3 gap-5 pt-[46px]">
                        <Models modelNames={modelNames} />
                        <Holes holeCounts={holeCounts} />
                        <Tips tips={tips} />
                        <Shapes shapes={shapes} />
                        <Lengths lengths={lengths} />
                        <Thickness thickness={thickness} />
                    </div>
                    <BtnAdd />
                </div>
            </CustomModal>
        </FormProvider>
    );
};
export default MoodalAddNewCannula;
