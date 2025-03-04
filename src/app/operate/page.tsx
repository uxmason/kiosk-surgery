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
import toast from "react-hot-toast";

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
    const [selectedCannulaIds, setSelectedCannulaIds] = useState<string[]>([]);

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
                toast.error(res.message);
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
                toast.error(res.message);
            }
        });
    }, [deviceId]);

    // 캐뉼라 리스트 불러오기
    const handleSelectCannulaList = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/cannula/list?psEntry=${client?.psEntry}`,
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
        handleSelectCannulaList().then((res) => {
            if (res.success) {
                setCannulaInSurgeryList(res.list);
            } else {
                toast.error(res.message);
            }
        });
    };

    // 캐뉼라 리스트 담기
    useEffect(() => {
        if (unpaired) return;
        handleSelectCannulaList().then((res) => {
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
            }
        });
    }, [unpaired]);

    // 인시젼 리스트 불러오기
    const handleSelectIncisionList = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/incision/list?psEntry=${client?.psEntry}`,
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

    // 인시젼 리스트 담기
    useEffect(() => {
        if (unpaired) return;
        handleSelectIncisionList().then((res) => {
            if (res.success) {
                setIncisionList(
                    res.list?.map((v: IncisionListType) => ({
                        _id: v?._id,
                        SURGERY_ID: v?.SURGERY_ID,
                        POINT_NAME: v?.POINT_NAME,
                        AJAX_ID: v?.AJAX_ID,
                        SELECTED: v?.SELECTED === 1,
                    }))
                );
            } else {
                toast.error(res.message);
            }
        });
    }, [unpaired]);

    return (
        <>
            <main className="relative w-full h-full min-h-[1920px]">
                <ClientInfo
                    setIsOpenOpeModal={setIsOpenOpeModal}
                    isOpeInfo={isOpeInfo}
                />
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
                reloadCannulaList={reloadCannulaList}
                selectedCannulaIds={selectedCannulaIds}
                setSelectedCannulaIds={setSelectedCannulaIds}
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
