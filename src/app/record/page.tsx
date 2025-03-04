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
import { handleSelectDoctor } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { OpeClientType, PhotsArrType } from "@/type";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Info() {
    const { deviceId } = useStore();
    const { client } = useClientStore();
    const { doctor } = useDoctorStore();
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isOpenOpeModal, setIsOpenOpeModal] = useState(false);
    const [imgs, setImgs] = useState<PhotsArrType[]>([]);
    const [unpaired, setUnpaired] = useState(false);
    const [isOpeInfo, setIsOpeInfo] = useState<OpeClientType[]>([]);
    const [seconds, setSeconds] = useState(0);

    // 초를 HH:mm:ss 형식으로 변환하는 함수
    const formatTime = (totalSeconds: number) => {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
            2,
            "0"
        );
        const secs = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${secs}`;
    };

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

            const result = await response.json();
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

    // 키오스크에 등록된 의사 찾기
    useEffect(() => {
        if (!deviceId) return;
        handleSelectDoctor(deviceId).then((res) => {
            if (res.success) {
                setUnpaired(false);
            } else {
                setUnpaired(true);
                toast.error(res.message);
            }
        });
    }, [deviceId]);

    // 수술 고객 정보 담기
    useEffect(() => {
        if (unpaired || !client || !doctor) return;
        onHandleSelectOpe(doctor?.id, client?.psEntry).then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                toast.error(res.message);
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
            }
        });
    }, [unpaired, client]);

    // 카운트 업
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <main className="relative w-full h-full min-h-[1920px]">
                <ClientInfo
                    setIsOpenOpeModal={setIsOpenOpeModal}
                    isOpeInfo={isOpeInfo}
                />
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
                    />
                </div>
                <UpcomingTime
                    isOther
                    text="수술 경과 시간"
                    time={formatTime(seconds)}
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
