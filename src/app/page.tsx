/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CustomBtn, Footer, Process, UpcomingTime } from "@/components/common";
import { Ai, Client, Inbody, Info, ModalImgs, Photo } from "@/components/main";
import { ModalAI } from "@/components/main/modal-ai";
import { ModalInbody } from "@/components/main/modal-inbody";
import ModalSelectOpe from "@/components/main/modal-ope/modal-select-ope";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useDoctorStore, useClientStore, useStore } from "@/store";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Home() {
    const [isPaired, setPaired] = useState(false);
    const [isOpeOpen, setOpeOpen] = useState(false);
    const [isOpeOpenNext, setOpeOpenNext] = useState(false);
    const [isInbodyOpen, setInbodyOpen] = useState(false);
    const [isModalImgsOpen, setModalImgsOpen] = useState(false);
    const [isModalAIOpen, setModalAIOpen] = useState(false);
    const [imgs, setImgs] = useState([]);
    const [dataOpeInfo, setOpeInfo] = useState([]);
    const [dataInbody, ] = useState([]);
    const [dataFepa, ] = useState([]);
    const [dataAllOpe, setAllOpe] = useState([]);
    const { deviceId, setDeviceId } = useStore();
    const { client, setClient } = useClientStore();
    const { doctor, setDoctor } = useDoctorStore();
    const [fingerprint, setFingerprint] = useState("");
    const [lastRegDate, setLastRegDate] = useState("");
    const [isBoostCheckStatus, setBoostCheckStatus] = useState(false);

    // 키오스크에 등록된 의사 찾기
    const handleSelectDoctor = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/check-device?deviceId=${deviceId}`,
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
        if (deviceId && isBoostCheckStatus) {
            handleSelectDoctor().then((res) => {
                setImgs([]);
                if (res.success) {
                    const doctorInfo = res.doctorInfo?.[0];
                    setDoctor({
                        id: doctorInfo?.["USER_ID"],
                        name: doctorInfo?.["USER_NAME"], 
                        branch: doctorInfo?.["STARTBRAN"],
                        branchName: doctorInfo?.["HOS_NAME"]
                    });
                    setPaired(true);
                } else {
                    console.log('error', res.message);
                    toast.error(res.message);
                    setPaired(false);
                }
                setBoostCheckStatus(false)
            });
        }
    }, [deviceId, isBoostCheckStatus]);

    // 가까운 미래의 수술 고객 정보
    const onHandleSelectOpe = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/surgery?doctorId=${doctor.id}`, {method: "GET"}
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
        if (!doctor.id) return;
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setOpeInfo(res.list);
            } else {
                console.log("FAIL");
            }
        });
    }, [doctor]);

    // 숫자 카운트
    const [count, setCount] = useState(180);
    useEffect(() => {
        if (count <= 0) return;

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return clearInterval(timer);
    }, [count]);

    const minutes = Math.floor(count / 60);
    const seconds = count % 60;

    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
    ).padStart(2, "0")}`;

    // 고객 인바디 정보 불러오기
    // const handleSelectInbodyLst = async (psEntry: string) => {
        // try {
        //     const response = await fetch(
        //         `/api/kiosk-surgery/inbody?psEntry=${psEntry}`,
        //         {
        //             method: "GET",
        //         }
        //     );

        //     if (!response.ok) {
        //         throw new Error("Network response was not ok");
        //     }

        //     const result = await response.json();
        //     return result;
        // } catch (error) {
        //     console.error("Error fetching data:", error);
        // }
    // };

    // 고객 인바디 정보 담기
    useEffect(() => {
        // if (!psEntry) return;
        // handleSelectInbodyLst(psEntry).then(
        //     (res: { success: boolean; doctorId: string }) => {
        //         if (res.success) {
        //             console.log("INBODY_SUCCESS");
        //         } else {
        //             console.log("INBODY_FAIL");
        //         }
        //     }
        // );
    }, [client]);

    // 고객 사진 정보 불러오기
    const handleSelectImgLst = async (psEntry: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/photos?psEntry=${psEntry}`,{method: "GET",}
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
        if (!client.psEntry) return;
        handleSelectImgLst(client.psEntry).then((res) => {
            if (res.success) {
                if(res.list.length > 0) {
                    setImgs(res.list);
                    setLastRegDate(res.list[0].regdate);
                }
            } else {
                console.log("FAIL");
            }
        });
    }, [client]);

    useEffect(() => {
        if (!dataOpeInfo) return;
        setClient({
            psEntry: dataOpeInfo?.[0]?.["고객번호"],
            branch: dataOpeInfo?.[0]?.["지점"],
            name: dataOpeInfo?.[0]?.["고객명"],
            licence: dataOpeInfo?.[0]?.["주민번호"],
        });
    }, [dataOpeInfo]);

    const handleSelectAllOpe = async () => {
        try {
            const response = await fetch(`/api/kiosk-surgery/schedule/`, {method: "GET",});
            if (!response.ok) throw new Error("Network response was not ok");
            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (isOpeOpen) {
            handleSelectAllOpe().then((res) => {
                if (res.success) {
                    setAllOpe(res.list);
                    setOpeOpenNext(true);
                } else {
                    console.log('error', res.message);
                    toast.error(res.message);
                }
            });
        }else {
            setOpeOpenNext(false);
            setBoostCheckStatus(true)
        }
    }, [isOpeOpen]);

    // 키오스크 고유 번호
    useEffect(() => {
        if (Cookies.get("FINGERPRINT_HASH_KIOSK")) {
            const cookieVal = Cookies.get("FINGERPRINT_HASH_KIOSK");
            setFingerprint(cookieVal ?? "");
        } else {
            const getFingerprint = async () => {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                setFingerprint(result.visitorId);
                document.cookie = `FINGERPRINT_HASH_KIOSK=${result.visitorId}; path=/`;
            };
            getFingerprint();
        }
    }, []);

    useEffect(() => {
        setDeviceId(fingerprint);
    }, [fingerprint]);

    return (
        <>
            <main
                className="w-[724px] h=[1980px] absolute"
                style={{ left: "calc(50% - 362px)" }}>
                <div className="absolute w-full gap-y-[15px]">
                    <p
                        className={`absolute w-full mt-[120px] text-[26px] text-center font-bold leading-9 
                  ${isPaired ? "text-[#15CF8F]" : "text-[#1d1f2d]"}
                  `}>{doctor.branchName}</p>
                    <p className="absolute mt-[200px] w-full text-white text-[70px] font-bold leading-normal text-center">지방 하나만! 365mc</p>
                    <p className="absolute mt-[330px] w-full text-white text-[30px] font-[250] leading-[50px] whitespace-pre-line text-center">
                        <span>“안녕하세요.</span>{" "}
                        <span className="font-bold">{client.name}</span>
                        <span>
                            님. 전문 의료진이 철저히 준비했으니 안 심하시고
                            편안하게 기다려 주세요. 궁금한 점이 있으면 간호
                            사에게 언제든 말씀해 주세요.”
                        </span>
                    </p>
                </div>
                <div className="absolute mt-[600px] w-full">
                    <div className="flex w-full gap-x-5">
                        <Client
                            isPaired={isPaired}
                            setOpeOpen={setOpeOpen}
                            dataOpeInfo={dataOpeInfo}
                        />
                        <Info
                            isPaired={isPaired}
                            setOpeOpen={setOpeOpen}
                            dataOpeInfo={dataOpeInfo}
                        />
                    </div>
                    <div className="flex w-full gap-x-5 py-5">
                        <Inbody
                            isPaired={isPaired}
                            setInbodyOpen={setInbodyOpen}
                            dataInbody={dataInbody}
                        />
                        <Photo
                            isPaired={isPaired}
                            setModalImgsOpen={setModalImgsOpen}
                            imgs={imgs}
                            lastRegDate={lastRegDate}
                        />
                        <Ai
                            isPaired={isPaired}
                            setModalAIOpen={setModalAIOpen}
                            dataFepa={dataFepa}
                        />
                    </div>
                    <CustomBtn
                        text={
                            !isPaired && !dataOpeInfo
                                ? "수술 대상이 아직 선택되지 않았습니다."
                                : "시작하기"
                        }
                        bg={isPaired ? "rgba(58,62,89,0.50)" : "#15CF8F"}
                        isShow={false}
                        path="/record"
                        isPaired={isPaired}
                    />
                </div>
                {isPaired && (
                    <UpcomingTime
                        text="시작까지 남은 시간"
                        time={formattedTime}
                        color="#15CF8F"
                    />
                )}
                <Process isProcess={1} />
            </main>
            <Footer />
            <ModalSelectOpe isOpen={isOpeOpenNext} setOpeOpen={setOpeOpen} dataAllOpe={dataAllOpe} fingerprint={fingerprint} />
            <ModalInbody
                isInbodyOpen={isInbodyOpen && isPaired}
                setInbodyOpen={setInbodyOpen}
            />
            <ModalImgs
                imgs={imgs}
                isModalImgsOpen={isModalImgsOpen && isPaired}
                setModalImgsOpen={setModalImgsOpen}
            />
            <ModalAI
                isModalAIOpen={isModalAIOpen && isPaired}
                setModalAIOpen={setModalAIOpen}
            />
        </>
    );
}
