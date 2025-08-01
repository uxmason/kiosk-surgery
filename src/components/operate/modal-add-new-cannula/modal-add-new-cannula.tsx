import { useDoctorStore } from "@/store";
import {
    AddNewCunnulaType,
    HolelCountType,
    LengthType,
    ModelNameType,
    ShapesType,
    ThicknessType,
    TipsType,
} from "@/type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BtnAdd, Holes, Lengths, Models, Shapes, Thickness, Tips } from ".";
import { CustomModal } from "../../common";
interface Props {
    isOpenAddCannualModal: boolean;
    selectedCannulaIds: string[];
    setIsOpenAddCannualModal: (v: boolean) => void;
    setSelectedCannulaIds: Dispatch<SetStateAction<string[]>>;
    reloadCannulaList: () => void;
}
const MoodalAddNewCannula = ({
    isOpenAddCannualModal,
    selectedCannulaIds,
    setIsOpenAddCannualModal,
    setSelectedCannulaIds,
    reloadCannulaList,
}: Props) => {
    const { doctor } = useDoctorStore();
    const [isExistCannula, setExistCannula] = useState(false);
    const [modelNames, setModelNames] = useState<ModelNameType[]>([]);
    const [holeCounts, setHoleCounts] = useState<HolelCountType[]>([]);
    const [tips, setTips] = useState<TipsType[]>([]);
    const [shapes, setShapes] = useState<ShapesType[]>([]);
    const [lengths, setLengths] = useState<LengthType[]>([]);
    const [thickness, setThickness] = useState<ThicknessType[]>([]);
    const [isExistCannulaId, setIsExistCannulaId] = useState("");

    // 캐뉼라 정보 불러오기
    const handleSelectCannulaSpec = async () => {
        try {
            const response = await fetch(`/api/kiosk-surgery/cannula/spec`, {
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
                toast.error(res.message);
            }
        });
    }, [isOpenAddCannualModal]);

    const method = useForm<AddNewCunnulaType>();
    const { reset, watch } = method;
    const model = watch()?.model;
    const hole = watch()?.hole;
    const tip = watch()?.tip;
    const shape = watch()?.shape;
    const length = watch()?.length;
    const thick = watch()?.thick;
    const isComplete =
        typeof model === "number" &&
        typeof hole === "number" &&
        typeof tip === "number" &&
        typeof shape === "number" &&
        typeof length === "number" &&
        typeof thick === "number";

    // 캐뉼라 존재 여부 확인
    const handleExistCannula = async () => {
        const url = `/api/kiosk-surgery/cannula/exist`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    modelNameID: model,
                    holeCountID: hole,
                    tipID: tip,
                    shapeID: shape,
                    lengthID: length,
                    thicknessID: thick,
                    doctorId: doctor?.id,
                }),
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

    useEffect(() => {
        if (isComplete) {
            handleExistCannula().then((res) => {
                if (res.success) {
                    setExistCannula(true);
                    setIsExistCannulaId(res.cannulaID);
                } else {
                    setExistCannula(false);
                    setIsExistCannulaId("");
                }
            });
        }
    }, [model, shape, tip, length, , hole, thick]);

    useEffect(() => {
        reset({
            model: undefined,
            hole: undefined,
            tip: undefined,
            shape: undefined,
            length: undefined,
            thick: undefined,
        });
        setExistCannula(false);
        setIsExistCannulaId("");
    }, [isOpenAddCannualModal]);

    return (
        <FormProvider {...method}>
            <CustomModal
                top={1300}
                isComplete={isComplete}
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
                    <BtnAdd
                        reloadCannulaList={reloadCannulaList}
                        selectedCannulaIds={selectedCannulaIds}
                        isExistCannulaId={isExistCannulaId}
                        setSelectedCannulaIds={setSelectedCannulaIds}
                        isExistCannula={isExistCannula}
                        setIsOpenAddCannualModal={setIsOpenAddCannualModal}
                    />
                </div>
            </CustomModal>
        </FormProvider>
    );
};
export default MoodalAddNewCannula;
