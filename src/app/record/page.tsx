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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// TODO 타이머 수정
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
    const [count, setCount] = useState(24 * 60 * 60);
    const [isReversCount, setReversCount] = useState(false);

    const hours = Math.floor((isReversCount ? -count : count) / 60 / 60);
    const minutes = Math.floor(((isReversCount ? -count : count) / 60) % 60);
    const seconds = (isReversCount ? -count : count) % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // 수술 고객 정보
    const onHandleSelectOpe = async (doctorId: string, psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery/client?doctorId=${doctorId}&psEntry=${psEntry}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const now = new Date();

            const currentTime =
                now.getHours() * 60 * 60 +
                now.getMinutes() * 60 +
                now.getSeconds();

            const result = await response.json();
            setCount(
                Number(result.list[0].시작시간.substring(0, 2)) * 60 * 60 +
                    Number(result.list[0].시작시간.substring(2, 4)) * 60 -
                    currentTime
            );

            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 고객 사진 정보 불러오기
    const handleSelectImgLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/photos?psEntry=${psEntry}`,
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

    // 수술의 상태 체크
    const handleOpeStatus = async (doctorID: string) => {
        try {
            const { doctor } = useDoctorStore.getState();
            if (doctor.id == null) return;
            const response = await fetch(
                `/api/kiosk-surgery/surgery/status?userID=${doctorID}`,
                { method: "GET" }
            );
            if (!response.ok) throw new Error("Network response was not ok");
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 해당 기기의 고유번호의 유효성 체크
    useEffect(() => {
        if (!deviceId) return;

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
    }, [deviceId]);

    // 해당 수술의 상태 체크
    useEffect(() => {
        if (!deviceId && doctor.id === "") return;

        const interval = setInterval(() => {
            handleOpeStatus(doctor.id).then((res) => {
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
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [deviceId, doctor]);

    // 수술 고객 정보 담기
    useEffect(() => {
        if (unpaired || !client || !doctor) return;
        onHandleSelectOpe(doctor?.id, client?.psEntry).then((res) => {
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
    }, [unpaired, client, doctor]);

    // 고객 이미지 담기
    useEffect(() => {
        if (unpaired || !client) return;
        handleSelectImgLst(client?.psEntry).then((res) => {
            if (res.success) {
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

    useEffect(() => {
        if (count <= 0) setReversCount(true);

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

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
