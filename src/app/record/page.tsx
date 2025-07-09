"use client";

import {
    ClientInfo,
    CustomBtn,
    Footer,
    ModalOpeInfo,
    Process,
    UpcomingTime,
} from "@/components/common";
import { FirstImgs, SecondImgs } from "@/components/record";
import { handleSelectDoctor, updateErrorMessage } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { OpeClientType, PhotsArrType } from "@/type";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Info() {
    const router = useRouter();
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isOpenOpeModal, setIsOpenOpeModal] = useState(false);
    const [imgs, setImgs] = useState<PhotsArrType[]>([]);
    const [unpaired, setUnpaired] = useState(false);
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);
    const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 수술 고객 정보 불러오기
    const onHandleSelectOpe = async (
        doctorId: string,
        psEntry: string,
        opeCode: string
    ) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery/client?doctorId=${doctorId}&psEntry=${psEntry}&opeCode=${opeCode}`,
                { method: "GET" }
            );

            if (!response.ok) throw new Error("Network response was not ok");

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

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

    // 타이머 설정
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setElapsedTimeMs((prev) => prev + 10);
        }, 10);

        return () => clearInterval(intervalRef.current!);
    }, []);

    // 시간 포맷 처리
    const absMs = Math.max(elapsedTimeMs, 0);
    const totalMs = absMs % 1000;
    const totalSeconds = Math.floor(absMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
        Math.floor(totalMs / 10)
    ).padStart(2, "0")}`;

    // 기기 유효성 체크
    useEffect(() => {
        if (!deviceId) return;

        const interval = setInterval(() => {
            handleSelectDoctor(deviceId).then((res) => {
                if (res.success) {
                    setUnpaired(false);
                } else {
                    setUnpaired(true);
                    toast.error(res.message);
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [deviceId]);

    // 수술 상태 체크
    useEffect(() => {
        if (
            !deviceId ||
            doctor?.id === "" ||
            client?.psEntry === "" ||
            client?.opeCode === ""
        ) {
            return;
        }

        const interval = setInterval(() => {
            handleOpeStatus(doctor.id, client?.psEntry, client?.opeCode).then(
                (res) => {
                    if (res.success) {
                        if (res.status === 0) router.push("/");
                        if (res.status === 1) router.push("/record");
                        if (res.status === 2) router.push("/operate");
                    } else {
                        clearInterval(interval);
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

    // 고객 사진 정보 불러오기
    const handleSelectImgLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/photos?psEntry=${psEntry}`,
                { method: "GET" }
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

    // 수술 고객 정보 담기
    useEffect(() => {
        if (unpaired || client?.psEntry === "" || doctor?.id === "") return;

        onHandleSelectOpe(doctor?.id, client?.psEntry, client?.opeCode).then(
            (res) => {
                if (res?.success) {
                    setIsOpeInfo(res.list);
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            }
        );
    }, [unpaired, client, doctor]);

    // 고객 사진 정보 불러오기
    useEffect(() => {
        if (unpaired || !client) return;

        handleSelectImgLst(client?.psEntry).then((res) => {
            if (res?.success) {
                setImgs(res.list);
            } else {
                toast.error(res.message);
                updateErrorMessage({
                    deviceID: deviceId,
                    userID: doctor.id,
                    message: res.message,
                });
            }
        });
    }, [unpaired, client]);
    return (
        <>
            <main className="relative w-full h-full min-h-[1920px]">
                <ClientInfo setIsOpenOpeModal={setIsOpenOpeModal} />
                <FirstImgs
                    isFirstOpen={isFirstOpen}
                    isSecondOpen={isSecondOpen}
                    setIsFirstOpen={setIsFirstOpen}
                    imgs={imgs}
                />
                <SecondImgs
                    isSecondOpen={isSecondOpen}
                    setIsSecondOpen={setIsSecondOpen}
                    imgs={imgs}
                />
                <div className="flex w-full justify-center pt-5 px-5">
                    <CustomBtn
                        text="수술 완료"
                        bg="#ED6B5B"
                        isShow={true}
                        isPaired={!unpaired}
                        isShowBtnText="준비 단계로"
                        path="/operate"
                        dataOpeInfo={isOpeInfo}
                        status={2}
                    />
                </div>
                <UpcomingTime
                    isOther
                    text="수술 경과 시간"
                    time={formattedTime}
                    color="#ED6B5B"
                />
                <Process isProcess={2} isOther />
                <Footer isOther />
            </main>
            <ModalOpeInfo
                isOpeInfo={isOpeInfo}
                isOpenOpeModal={isOpenOpeModal}
                setIsOpenOpeModal={setIsOpenOpeModal}
            />
        </>
    );
}
