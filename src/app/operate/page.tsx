"use client";

import {
    ClientInfo,
    CustomBtn,
    Footer,
    ModalOpeInfo,
    Process,
    UpcomingTime,
} from "@/components/common";
import { Cannulas, ModalComplete, Parts } from "@/components/operate";
import { MoodalAddNewCannula } from "@/components/operate/modal-add-new-cannula";
import { handleSelectDoctor, updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { CannulaListType, IncisionListType, OpeClientType } from "@/type";
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
    const [isModalComplete, setIsModalComplete] = useState(false);
    const [cannulaInSurgeryList, setCannulaInSurgeryList] = useState<
        CannulaListType[]
    >([]);
    const [incisionList, setIncisionList] = useState<IncisionListType[]>([]);
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);
    const [selectedCannulaIds, setSelectedCannulaIds] = useState<string[]>([]);
    const [count, setCount] = useState(0); // 경과 시간 초 (0부터 시작)

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
            if (result?.success) {
                const endTime = result?.list?.[0]?.["수술완료시간"];
                if (endTime) {
                    const surgeryDate = new Date(endTime);
                    const now = new Date();
                    const diffSeconds = Math.floor(
                        (now.getTime() - surgeryDate.getTime()) / 1000
                    );
                    // 과거 시간은 0으로 초기화, 미래 시간(음수)일 경우에도 0으로 처리
                    setCount(diffSeconds > 0 ? diffSeconds : 0);
                } else {
                    // 수술 완료 시간이 없으면 초기화
                    setCount(0);
                }
            }
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
    const handleSelectCannulaList = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/cannula/list?psEntry=${psEntry}`,
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
        if (client?.psEntry === "") {
            return;
        } else {
            handleSelectCannulaList(client?.psEntry).then((res) => {
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

    // 인시젼 리스트 불러오기
    const handleSelectIncisionList = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/incision/list?psEntry=${psEntry}`,
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

    // 인시젼 리스트 담기
    useEffect(() => {
        if (unpaired || client?.psEntry === "") {
            return;
        } else {
            handleSelectIncisionList(client?.psEntry).then((res) => {
                if (res.success) {
                    setIncisionList(
                        res.list?.map((v: IncisionListType) => ({
                            _id: v?._id,
                            SURGERY_ID: v?.SURGERY_ID,
                            POINT_NAME: v?.POINT_NAME,
                            AJAX_ID: v?.AJAX_ID,
                            SELECTED: v?.SELECTED,
                        }))
                    );
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
    }, [unpaired, client]);

    // 캐뉼라 리스트 담기
    useEffect(() => {
        if (unpaired || client?.psEntry === "") {
            return;
        } else {
            handleSelectCannulaList(client?.psEntry).then((res) => {
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
    }, [unpaired, client]);

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
                        if (res.status == 0) router.replace("/");
                        if (res.status == 1) router.push("/record");
                        if (res.status == 2) router.push("/operate");
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
                />
                <Parts incisionList={incisionList} />
                <div className="flex w-full justify-center pt-5 px-5">
                    <CustomBtn
                        text="기록 완료"
                        bg="#5B87ED"
                        isShow={true}
                        isShowBtnText="수행 단계로"
                        isPaired={!unpaired}
                        path="/"
                        setIsModalComplete={setIsModalComplete}
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
            <ModalComplete
                isPaired={!unpaired}
                dataOpeInfo={isOpeInfo}
                isModalComplete={isModalComplete}
                setIsModalComplete={setIsModalComplete}
            />
        </>
    );
}
