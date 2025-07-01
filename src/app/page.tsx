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
import { ImgsType, OpeClientType, WeightChartType, WeightsType } from "@/type";
import { updateErrorMessage } from "@/function";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [isOnLoading, setOnLoading] = useState(false);
    const [isPaired, setPaired] = useState(false);
    const [isOpeOpen, setOpeOpen] = useState(false);
    const [isOpeOpenNext, setOpeOpenNext] = useState(false);
    const [isInbodyOpen, setInbodyOpen] = useState(false);
    const [isModalImgsOpen, setModalImgsOpen] = useState(false);
    const [isModalAIOpen, setModalAIOpen] = useState(false);
    const [imgs, setImgs] = useState<ImgsType[]>([]);
    const [dataOpeInfo, setOpeInfo] = useState<OpeClientType[]>([]);
    const [dataInbody] = useState([]);
    const [dataFepa] = useState([]);
    const [dataAllOpe, setAllOpe] = useState([]);
    const { deviceId, setDeviceId } = useStore();
    const { client, setClient } = useClientStore();
    const { doctor, setDoctor } = useDoctorStore();
    const [fingerprint, setFingerprint] = useState("");
    const [lastRegDate, setLastRegDate] = useState("");
    const [isBoostCheckStatus, setBoostCheckStatus] = useState(false);
    const [count, setCount] = useState(24 * 60 * 60);
    const [isReversCount, setReversCount] = useState(false);
    const [targetPsEntry, setTargetPsEntry] = useState("");
    const [isWeights, setIsWeights] = useState<WeightsType>();
    const [weightArr, setWeightArr] = useState<WeightChartType[]>([]);
    const [isCpuId, setIsCpuId] = useState<string | null>(null);
    console.log("!#!@#@!# CPU ID ##!@#!@@", isCpuId);
    // 키오스크에 등록된 의사 찾기
    const handleSelectDoctor = async () => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/check-device?deviceId=${deviceId}`,
                { method: "GET" }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setOnLoading(false);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            setOnLoading(false);
        }
    };

    // 가까운 미래의 수술 고객 정보
    const onHandleSelectOpe = async () => {
        setOnLoading(true);
        try {
            let url = `/api/kiosk-surgery/surgery?doctorId=${doctor.id}`;
            if (targetPsEntry !== "") url += `&psEntry=${targetPsEntry}`;

            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();

            if (result?.success) {
                const opeDate = result?.list?.[0]?.["수술일"];
                const startTime = result?.list?.[0]?.["시작시간"];

                if (opeDate && startTime) {
                    const surgeryDate = new Date(
                        `${opeDate.slice(0, 4)}-${opeDate.slice(
                            4,
                            6
                        )}-${opeDate.slice(6, 8)}T${startTime.slice(
                            0,
                            2
                        )}:${startTime.slice(2, 4)}:00`
                    );

                    const now = new Date();
                    const diffSeconds = Math.floor(
                        (surgeryDate.getTime() - now.getTime()) / 1000
                    );

                    setCount(diffSeconds);
                }

                setTargetPsEntry("");
            }

            setOnLoading(false);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            setTargetPsEntry("");
            setOnLoading(false);
        }
    };

    const time = isReversCount ? -count : count;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // 고객 인바디 정보 불러오기
    const handleSelectInbodyLst = async (psEntry: string, part: string) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/inbody?psEntry=${psEntry}&part=${part}`,
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

    const handleSelectAllOpe = async () => {
        setOnLoading(true);
        try {
            const response = await fetch(`/api/kiosk-surgery/schedule`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            setOnLoading(false);
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

    // 기기의 고유 번호
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

    // 해당 수술의 상태 체크
    useEffect(() => {
        if (!deviceId || doctor.id === "") return;
        const interval = setInterval(() => {
            handleOpeStatus(doctor.id).then((res) => {
                if (res.success) {
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

    // 의사 정보
    useEffect(() => {
        if (deviceId && isBoostCheckStatus) {
            setOnLoading(true);
            handleSelectDoctor().then((res) => {
                if (res.success) {
                    const doctorInfo = res.doctorInfo?.[0];
                    setDoctor({
                        id: doctorInfo?.["USER_ID"],
                        name: doctorInfo?.["USER_NAME"],
                        branch: doctorInfo?.["STARTBRAN"],
                        branchName: doctorInfo?.["HOS_NAME"],
                    });
                    setPaired(true);
                    setOnLoading(false);
                } else {
                    toast.error(res.message);
                    setPaired(false);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
                setBoostCheckStatus(false);
            });
        }
    }, [deviceId, isBoostCheckStatus]);

    // 해당 기기의 고유번호의 유효성 체크
    useEffect(() => {
        if (!deviceId) return;

        const interval = setInterval(() => {
            handleSelectDoctor().then((res) => {
                if (res.success) {
                } else {
                    setOnLoading(true);
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

    // 수술 정보
    useEffect(() => {
        if (!doctor.id) return;
        setOnLoading(true);
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setOpeInfo(res.list);
            } else {
                toast.error(res.message);
                updateErrorMessage({
                    deviceID: deviceId,
                    userID: doctor.id,
                    message: res.message,
                });
            }
            setOnLoading(false);
        });
    }, [doctor]);

    // 타이머
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => {
                const newCount = prevCount - 1;
                if (newCount <= 0) setReversCount(true);
                return newCount;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isOpeOpen) {
            handleSelectAllOpe().then((res) => {
                if (res.success) {
                    setAllOpe(res.list);
                    setOpeOpenNext(true);
                } else {
                    toast.error(res.message);
                    updateErrorMessage({
                        deviceID: deviceId,
                        userID: doctor.id,
                        message: res.message,
                    });
                }
            });
        } else {
            setOpeOpenNext(false);
            setBoostCheckStatus(true);
        }
    }, [isOpeOpen]);

    // 고객 정보
    useEffect(() => {
        if (!dataOpeInfo) return;
        setClient({
            psEntry: dataOpeInfo?.[0]?.고객번호,
            branch: dataOpeInfo?.[0]?.지점,
            name: dataOpeInfo?.[0]?.고객명,
            licence: dataOpeInfo?.[0]?.주민번호,
            part: dataOpeInfo?.[0]?.수술부위,
            opeCode: dataOpeInfo?.[0]?.수술코드,
        });
    }, [dataOpeInfo]);

    // 고객의 이미지
    useEffect(() => {
        if (!client?.psEntry) return;
        handleSelectImgLst(client?.psEntry).then((res) => {
            setImgs([]);
            if (res.success) {
                setImgs(res.list);
                if (res.list.length > 0) {
                    setLastRegDate(res.list[res.list.length - 1].regdate);
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
    }, [client]);

    // 고객의 인바디
    useEffect(() => {
        if (client.psEntry === "" && client.part === "") return;
        handleSelectInbodyLst(client.psEntry, client.part).then((res) => {
            if (res.success) {
                const inbody = res?.inbody;
                const inbodyLength = inbody?.length;
                setIsWeights({
                    BD_WEIGHT: inbody?.[inbodyLength]?.["BD_WEIGHT"],
                    WC_WEIGHT: inbody?.[inbodyLength]?.["WC_WEIGHT"],
                    MUST_WEIGHTL: inbody?.[inbodyLength]?.["MUST_WEIGHTL"],
                });
                setWeightArr(
                    inbody?.map((v: never) => {
                        return {
                            date: v?.["PRODATE"],
                            weight: v?.["BD_WEIGHT"],
                        };
                    })
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
    }, [client]);

    // 기기 고유 번호
    useEffect(() => {
        setDeviceId(fingerprint);
    }, [fingerprint]);

    // CPUID
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            (window as any).electronAPI?.getCPUID
        ) {
            (window as any).electronAPI.getCPUID().then((id: string) => {
                setIsCpuId(id);
            });
        } else {
            console.log("CPU ID 에러");
        }
    }, []);

    return (
        <>
            <main
                className="w-[724px] h-[1980px] absolute"
                style={{ left: "calc(50% - 362px)" }}
            >
                <div className="absolute w-full gap-y-[15px]">
                    <p
                        className={`absolute w-full mt-[120px] text-[26px] text-center font-bold leading-9 
                                    ${
                                        isPaired
                                            ? "text-[#15CF8F]"
                                            : "text-[#1d1f2d]"
                                    }
                                    `}
                    >
                        {doctor.branchName}
                    </p>
                    <p className="absolute mt-[200px] w-full text-white text-[70px] font-bold leading-normal text-center">
                        지방 하나만! 365mc
                    </p>
                    <p className="absolute mt-[330px] w-full text-white text-[30px] font-[250] leading-[50px] whitespace-pre-line text-center">
                        <span>“안녕하세요.</span>{" "}
                        <span className="font-bold">{client.name}</span>
                        <span>
                            님. 전문 의료진이 철저히 준비했으니 안심하시고
                            편안하게 기다려 주세요. 궁금한 점이 있으면
                            간호사에게 언제든 말씀해 주세요.”
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
                            !isPaired || dataOpeInfo.length == 0
                                ? `수술 대상이 아직 선택되지 않았습니다.`
                                : `시작하기`
                        }
                        bg={
                            !isPaired || dataOpeInfo.length == 0
                                ? "rgba(58,62,89,0.50)"
                                : "#15CF8F"
                        }
                        isShow={false}
                        path="/record"
                        isPaired={isPaired}
                        dataOpeInfo={dataOpeInfo}
                        status={1}
                    />
                </div>
                {isPaired && (
                    <UpcomingTime
                        text={
                            isReversCount
                                ? `수술 예정 시각 이후 경과 시간`
                                : `수술 시작까지 남은 시간`
                        }
                        time={formattedTime}
                        color={isReversCount ? `#F9AC68` : `#15CF8F`}
                    />
                )}
                <Process isProcess={1} />
            </main>
            <Footer />
            <ModalSelectOpe
                isOpen={isOpeOpen && isPaired}
                isOpeOpenNext={isOpeOpenNext}
                setOpeOpen={setOpeOpen}
                setTargetPsEntry={setTargetPsEntry}
                dataAllOpe={dataAllOpe}
                fingerprint={fingerprint}
            />
            <ModalInbody
                isInbodyOpen={isInbodyOpen && isPaired}
                setInbodyOpen={setInbodyOpen}
                weightArr={weightArr}
                isWeights={isWeights}
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
            {isOnLoading ? (
                <div className="B-00">
                    <div className="L-00">
                        <p className="T-00">로딩중입니다.</p>
                    </div>
                </div>
            ) : null}
        </>
    );
}
