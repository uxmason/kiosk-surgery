import { FormProvider, useForm } from "react-hook-form";
import { BtnAdd, Holes, Lengths, Models, Shapes, Thickness, Tips } from ".";
import { CustomModal } from "../../common";
import { AddNewCunnulaType } from "@/type";
import { useEffect } from "react";
interface Props {
    isOpenAddCannualModal: boolean;
    setIsOpenAddCannualModal: (v: boolean) => void;
}
const MoodalAddNewCannula = ({
    isOpenAddCannualModal,
    setIsOpenAddCannualModal,
}: Props) => {
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
                        <Models />
                        <Holes />
                        <Tips />
                        <Shapes />
                        <Lengths />
                        <Thickness />
                    </div>
                    <BtnAdd />
                </div>
            </CustomModal>
        </FormProvider>
    );
};
export default MoodalAddNewCannula;
