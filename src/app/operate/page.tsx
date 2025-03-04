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
import { handleSelectDoctor } from "@/function";
import { useClientStore, useDoctorStore, useStore } from "@/store";
import { CannulaListType, IncisionListType, OpeClientType } from "@/type";
import { useEffect, useState } from "react";

export default function Info() {
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
    // 수술 고객 정보 담기
    useEffect(() => {
        if (unpaired || !client || !doctor) return;
        onHandleSelectOpe(doctor?.id, client?.psEntry).then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                console.log("!#!@");
            }
        });
    }, [unpaired, client, doctor]);

    // 숫자 카운트
    const [count, setCount] = useState(180);
    useEffect(() => {
        if (count <= 0) return;

        const timer = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(count / 60);
    const seconds = count % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    // 키오스크에 등록된 의사 찾기
    useEffect(() => {
        if (!deviceId) return;
        handleSelectDoctor(deviceId).then((res) => {
            if (res.success) {
                setUnpaired(false);
            } else {
                setUnpaired(true);
            }
        });
    }, [deviceId]);

    // 캐뉼라 리스트 불러오기
    const handleSelectCannulaList = async () => {
        try {
            const response = await fetch(`/api/kiosk-surgery/cannula/list`, {
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
    // 캐뉼라 리스트 담기
    useEffect(() => {
        if (unpaired) return;
        handleSelectCannulaList().then((res) => {
            if (res.success) {
                setCannulaInSurgeryList(res.list);
            } else console.log("FAIL_CANNULA_LIST");
        });
    }, [unpaired]);

    // 인시젼 리스트 불러오기
    const handleSelectIncisionList = async () => {
        try {
            const response = await fetch(`/api/kiosk-surgery/incision/list`, {
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

    // 인시젼 리스트 담기
    useEffect(() => {
        if (unpaired) return;
        handleSelectIncisionList().then((res) => {
            if (res.success) {
                setIncisionList(res.list);
            } else {
                console.log("FAIL_INCISION_LIST");
            }
        });
    }, [unpaired]);

    return (
        <>
            <main className="relative w-full h-full min-h-[1920px]">
                <div className="">
                    <ClientInfo
                        setIsOpenOpeModal={setIsOpenOpeModal}
                        isOpeInfo={isOpeInfo}
                    />
                </div>
                <Cannulas
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
                        setIsModalComplete={setIsModalComplete}
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
                isOpenAddCannualModal={isOpenAddCannualModal}
                setIsOpenAddCannualModal={setIsOpenAddCannualModal}
            />
            <ModalComplete
                isModalComplete={isModalComplete}
                setIsModalComplete={setIsModalComplete}
            />
        </>
    );
}
