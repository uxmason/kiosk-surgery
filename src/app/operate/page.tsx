"use client";

import {
    ClientInfo,
    CustomBtn,
    Footer,
    ModalOpeInfo,
    Process,
    UpcomingTime,
} from "@/components/common";
import { Cannulas, ModalError } from "@/components/operate";
import { MoodalAddNewCannula } from "@/components/operate/modal-add-new-cannula";
import { handleSelectDoctor, updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { CannulaListType, OpeClientType } from "@/type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Info() {
    const router = useRouter();
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [unpaired, setUnpaired] = useState(false);
    const [isOpenOpeModal, setIsOpenOpeModal] = useState(false);
    const [isOpenAddCannualModal, setIsOpenAddCannualModal] = useState(false);
    const [cannulaInSurgeryList, setCannulaInSurgeryList] = useState<
        CannulaListType[]
    >([]);
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);
    const [selectedCannulaIds, setSelectedCannulaIds] = useState<string[]>([]);
    const [count, setCount] = useState(0); // 경과 시간 초 (0부터 시작)
    const [isIdForEdit, setIsIdForEdit] = useState<number | null>(null);
    const [isDeletCdmtId, setIsDeleteCdmtId] = useState(false);

    // 수술의 상태 체크
    const handleOpeStatus = async (
        doctorID: string,
        psEntry: string,
        opCode: string
    ) => {
        try {
            const { doctor } = useDoctorStore.getState();
            if (doctor.id == null) return;
            const response = await fetch(
                `/api/kiosk-surgery/surgery/status?userID=${doctorID}&deviceID=${deviceId}&psEntry=${psEntry}&opCode=${opCode}`,
                { method: "GET" }
            );
            if (!response.ok) throw new Error("Network response was not ok");
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 수술 고객 정보
    const onHandleSelectOpe = async (
        doctorId: string,
        psEntry: string,
        opeCode: string
    ) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery/client?doctorId=${doctorId}&psEntry=${psEntry}&opeCode=${opeCode}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 시간 포맷팅
    const minutes = Math.floor((count % 3600) / 60);
    const seconds = count % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    // 캐뉼라 리스트 불러오기
    const handleSelectCannulaList = async (
        doctorId: string,
        psEntry: string
    ) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/cannula/list?doctorId=${doctorId}&psEntry=${psEntry}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // API 재요청하는 함수 (특정 버튼 클릭 시 호출)
    const reloadCannulaList = () => {
        if (client?.psEntry === "" || doctor?.id === "") {
            return;
        } else {
            handleSelectCannulaList(doctor?.id, client?.psEntry).then((res) => {
                if (res.success) {
                    setCannulaInSurgeryList(res.list);
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            });
        }
    };

    // 카운트업 타이머 (1초마다 경과시간 증가)
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => prevCount + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 해당 기기의 고유번호의 유효성 체크
    useEffect(() => {
        if (!deviceId) {
            return;
        } else {
            const interval = setInterval(() => {
                handleSelectDoctor(deviceId).then((res) => {
                    if (res.success) {
                        setUnpaired(false);
                    } else {
                        setUnpaired(true);
                        toast.error(res.message);
                        updateErrorMessage({
                            deviceID: deviceId,
                            userID: doctor.id,
                            message: res.message,
                        });
                    }
                });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [deviceId]);

    // 수술 고객 정보 담기
    useEffect(() => {
        if (unpaired || client?.psEntry === "" || doctor?.id === "") {
            return;
        } else {
            onHandleSelectOpe(
                doctor?.id,
                client?.psEntry,
                client?.opeCode
            ).then((res) => {
                if (res.success) {
                    setIsOpeInfo(res.list);
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            });
        }
    }, [unpaired, client, doctor]);

    // 캐뉼라 리스트 담기
    useEffect(() => {
        if (unpaired || client?.psEntry === "" || doctor?.id === "") {
            return;
        } else {
            handleSelectCannulaList(doctor?.id, client?.psEntry).then((res) => {
                if (res.success) {
                    const list: CannulaListType[] = res.list;
                    setCannulaInSurgeryList(list);
                    if (list?.map((v) => v.SELECTED === 1)) {
                        setSelectedCannulaIds(
                            list
                                ?.filter((v) => v.SELECTED === 1)
                                ?.map((s) => s.CANNULA_ID)
                        );
                    }
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            });
        }
    }, [unpaired, client, doctor, isIdForEdit]);

    // 해당 수술의 상태 체크
    useEffect(() => {
        if (
            !deviceId ||
            doctor.id === "" ||
            client?.psEntry === "" ||
            client?.opeCode === ""
        )
            return;

        const interval = setInterval(() => {
            handleOpeStatus(doctor?.id, client?.psEntry, client?.opeCode).then(
                (res) => {
                    if (res.success) {
                        if (res.status === 0) router.replace("/");
                        if (res.status === 1) router.push("/record");
                        if (res.status === 2) router.push("/operate");
                        if (res.status === 3) router.push("/incision");
                    } else {
                        updateErrorMessage({
                            deviceID: deviceId,
                            userID: doctor?.id,
                            message: res.message,
                        });
                    }
                }
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [deviceId, doctor, client]);

    return (
        <>
            <main className="relative w-full h-full min-h-[1920px]">
                <ClientInfo setIsOpenOpeModal={setIsOpenOpeModal} />
                <Cannulas
                    selectedCannulaIds={selectedCannulaIds}
                    setSelectedCannulaIds={setSelectedCannulaIds}
                    setIsOpenAddCannualModal={setIsOpenAddCannualModal}
                    cannulaInSurgeryList={cannulaInSurgeryList}
                    isIdForEdit={isIdForEdit}
                    setIsIdForEdit={setIsIdForEdit}
                    setIsDeleteCdmtId={setIsDeleteCdmtId}
                />
                <div className="flex w-full justify-center pt-[270px] px-5">
                    <CustomBtn
                        text="인시전 기록 단계로"
                        bg="#15CF8F"
                        isShow={true}
                        isShowBtnText="수행 단계로"
                        isPaired={!unpaired}
                        path="/incision"
                        dataOpeInfo={isOpeInfo}
                        status={3}
                    />
                </div>
                <UpcomingTime
                    isOther
                    text="수술 경과 시간"
                    time={formattedTime}
                    color="#FFF"
                />
                <Process isProcess={3} isOther />
                <Footer isOther />
            </main>
            <ModalOpeInfo
                isOpeInfo={isOpeInfo}
                isOpenOpeModal={isOpenOpeModal}
                setIsOpenOpeModal={setIsOpenOpeModal}
            />
            <MoodalAddNewCannula
                reloadCannulaList={reloadCannulaList}
                selectedCannulaIds={selectedCannulaIds}
                setSelectedCannulaIds={setSelectedCannulaIds}
                isOpenAddCannualModal={isOpenAddCannualModal}
                setIsOpenAddCannualModal={setIsOpenAddCannualModal}
            />
            <ModalError
                isErrorOpen={isDeletCdmtId}
                setIsErrorOpen={setIsDeleteCdmtId}
                isIdForEdit={isIdForEdit}
                setIsIdForEdit={setIsIdForEdit}
            />
        </>
    );
}
