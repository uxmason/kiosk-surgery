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
import { useStore } from "@/store";
import { PhotsArrType } from "@/type";
import { useEffect, useState } from "react";

export default function Info() {
    const { deviceId } = useStore();
    const psEntry = "210040378";
    // const { psEntry } = usePsentryStore();
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isOpenOpeModal, setIsOpenOpeModal] = useState(false);
    const [imgs, setImgs] = useState<PhotsArrType[]>([]);
    const [unpaired, setUnpaired] = useState(false);

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

    // 고객 이미지 담기
    useEffect(() => {
        // if (!psEntry) return;
        if (unpaired) return;
        handleSelectImgLst(psEntry).then((res) => {
            if (res.success) {
                setImgs(res.list);
            } else {
                console.log("FAIL");
            }
        });
    }, [unpaired, psEntry]);

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
                        isShowBtnText="준비 단계로"
                        path="/operate"
                    />
                </div>
                <UpcomingTime
                    isOther
                    text="수술 경과 시간"
                    time="00:03:23"
                    color="#ED6B5B"
                />
                <Process isProcess={2} isOther />
                <Footer isOther />
            </main>
            <ModalOpeInfo
                isOpenOpeModal={isOpenOpeModal}
                setIsOpenOpeModal={setIsOpenOpeModal}
            />
        </>
    );
}
