/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CustomBtn, Footer, Process, UpcomingTime } from "@/components/common";
import {
    Ai,
    Client,
    Inbody,
    Info,
    ModalImgs,
    Photo,
    Texts,
} from "@/components/main";
import { ModalAI } from "@/components/main/modal-ai";
import { ModalInbody } from "@/components/main/modal-inbody";
import ModalSelectOpe from "@/components/main/modal-ope/modal-select-ope";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import useStore from "@/store";
import { serverUrl } from "@/variables";

export default function Home() {
    const [isDoctorId, setIsDoctorId] = useState("");
    const [isError, setIsError] = useState(false);
    const [isOpeOpen, setIsOpeOpen] = useState(false);
    const [isInbodyOpen, setIsInbodyOpen] = useState(false);
    const [isModalImgsOpen, setIsModalImgsOpen] = useState(false);
    const [isModalAIOpen, setIsModalAIOpen] = useState(false);
    const [imgs, setImgs] = useState([]);
    const [isOpeInfo, setIsOpeInfo] = useState([]);
    const { deviceId, setDeviceId } = useStore();
    const [fingerprint, setFingerprint] = useState("");

    // 키오스크에 등록된 의사 찾기
    const handleSelectDoctor = async () => {
        try {
            const response = await fetch(
                `${serverUrl}/checkDevice/?deviceId=${deviceId}`,
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

    useEffect(() => {
        if (!deviceId) return;
        handleSelectDoctor().then((res) => {
            if (res.success) {
                setIsDoctorId(res.doctorId);
            } else {
                setIsError(true);
            }
        });
    }, [deviceId]);

    // 가까운 미래의 수술 고객 정보
    const onHandleSelectOpe = async () => {
        try {
            const response = await fetch(
                `${serverUrl}/surgery/?doctorId=${isDoctorId}`,
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
    useEffect(() => {
        if (!isDoctorId) return;
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setIsOpeInfo(res.list);
            } else {
                console.log("FAIL");
            }
        });
    }, [isDoctorId]);

    // 숫자 카운트
    const [count, setCount] = useState(180);
    useEffect(() => {
        if (count <= 0) return;

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    const minutes = Math.floor(count / 60);
    const seconds = count % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    // 고객 인바디 정보 불러오기
    const handleSelectInbodyLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `${serverUrl}/inbody/?psEntry=${psEntry}`,
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

    // 고객 인바디 정보 담기
    useEffect(() => {
        if (isOpeInfo?.length === 0) return;
        const psEntry = isOpeInfo?.[0]?.["고객번호"];
        handleSelectInbodyLst(psEntry).then(
            (res: { success: boolean; doctorId: string }) => {
                if (res.success) {
                    console.log("INBODY_SUCCESS");
                } else {
                    console.log("INBODY_FAIL");
                }
            }
        );
    }, [isOpeInfo]);

    // 고객 사진 정보 불러오기
    const handleSelectImgLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `${serverUrl}/photos/?psEntry=${psEntry}`,
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
        if (isOpeInfo?.length === 0) return;
        const psEntry = isOpeInfo?.[0]?.["고객번호"];
        handleSelectImgLst(psEntry).then((res) => {
            if (res.success) {
                setImgs(res.album);
            } else {
                console.log("FAIL");
            }
        });
    }, [isOpeInfo]);

    // 키오스크 고유 번호
    useEffect(() => {
        const getFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(result.visitorId);
        };

        getFingerprint();
    }, []);

    useEffect(() => {
        setDeviceId(fingerprint);
    }, [fingerprint]);

    return (
        <>
            <main className="px-[178px] w-full">
                <Texts />
                <div className="flex flex-col w-full pt-[120px]">
                    <div className="flex w-full gap-x-5">
                        <Client
                            isError={isError}
                            setIsOpeOpen={setIsOpeOpen}
                            isOpeInfo={isOpeInfo}
                        />
                        <Info isOpeInfo={isOpeInfo} />
                    </div>
                    <div className="flex w-full gap-x-5 py-5">
                        <Inbody setIsInbodyOpen={setIsInbodyOpen} />
                        <Photo
                            setIsModalImgsOpen={setIsModalImgsOpen}
                            imgs={imgs}
                        />
                        <Ai setIsModalAIOpen={setIsModalAIOpen} />
                    </div>
                    <CustomBtn
                        text="시작하기"
                        bg="#15CF8F"
                        isShow={false}
                        path="/record"
                    />
                </div>
                <UpcomingTime
                    text="시작까지 남은 시간"
                    time={formattedTime}
                    color="#15CF8F"
                />
                <Process isProcess={1} />
            </main>
            <Footer />
            <ModalSelectOpe isOpen={isOpeOpen} setIsOpeOpen={setIsOpeOpen} />
            <ModalInbody
                isInbodyOpen={isInbodyOpen}
                setIsInbodyOpen={setIsInbodyOpen}
            />
            <ModalImgs
                imgs={imgs}
                isModalImgsOpen={isModalImgsOpen}
                setIsModalImgsOpen={setIsModalImgsOpen}
            />
            <ModalAI
                isModalAIOpen={isModalAIOpen}
                setIsModalAIOpen={setIsModalAIOpen}
            />
        </>
    );
}
