/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CustomBtn, Footer, Process, UpcomingTime } from "@/components/common";
import {
    Ai,
    Client,
    Inbody,
    Info,
    ModalError,
    ModalImgs,
    Photo,
} from "@/components/main";
import { ModalAI } from "@/components/main/modal-ai";
import { ModalInbody } from "@/components/main/modal-inbody";
import ModalSelectOpe from "@/components/main/modal-ope/modal-select-ope";
import { useEffect, useState } from "react";
import { useDoctorStore, useClientStore, useStore } from "@/store";
import toast from "react-hot-toast";
import {
    CaloriesType,
    ImgsType,
    BmiFatType,
    BmiType,
    OpeClientType,
    WeightChartType,
    WeightsType,
    MineralType,
    ProteinType,
    WaterType,
    AnesthesiaType,
} from "@/type";
import { handleBirthToAge, updateErrorMessage } from "@/function";
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
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isRemoveClient, setIsRemoveClient] = useState(false);
    const [imgs, setImgs] = useState<ImgsType[]>([]);
    const [dataOpeInfo, setOpeInfo] = useState<OpeClientType[]>([]);
    const [dataAllOpe, setAllOpe] = useState([]);
    const { deviceId, setDeviceId } = useStore();
    const { client, setClient } = useClientStore();
    const { doctor, setDoctor } = useDoctorStore();
    // const [fingerprint, setFingerprint] = useState("");
    const [lastRegDate, setLastRegDate] = useState("");
    const [isBoostCheckStatus, setBoostCheckStatus] = useState(false);
    const [count, setCount] = useState(24 * 60 * 60);
    const [isReversCount, setReversCount] = useState(false);
    const [targetOpeCode, setTargetOpeCode] = useState("");
    const [targetPsEntry, setTargetPsEntry] = useState("");
    const [targetDeviceId, setTargetDeviceId] = useState("");
    const [isLimitFatPart, setIsLimitFatPart] = useState(0);
    const [isWeights, setIsWeights] = useState<WeightsType>();
    const [weightArr, setWeightArr] = useState<WeightChartType[]>([]);
    const [isCalories, setIsCalories] = useState<CaloriesType[]>([]);
    const [isBmiFat, setIsBmiFat] = useState<BmiFatType[]>([]);
    const [isBmi, setIsBmi] = useState<BmiType[]>([]);
    const [isMineral, setIsMineral] = useState<MineralType[]>([]);
    const [isProtein, setIsProtein] = useState<ProteinType[]>([]);
    const [isWater, setIsWater] = useState<WaterType[]>([]);
    const [isAnesthesia, setIsAnesthesia] = useState<AnesthesiaType[]>([]);

    /* ── 기기 ID를 단 한 번만 설정 ─────────────────────── */
    useEffect(() => {
        let resolved = false; // 이미 세팅했는지를 표시

        const api = window.electronAPI;

        /* 1) Electron 프리로드가 있으면 즉시 호출 */
        if (api?.getCPUID) {
            (async () => {
                try {
                    const id = await api.getCPUID!();
                    if (id && !resolved) {
                        setDeviceId(id);
                        resolved = true;
                    }
                } catch (e) {
                    console.error("getCPUID 실패:", e);
                }
            })();
        }

        /* 2) postMessage(iframe ↔ Electron) 폴백 */
        const msgHandler = (e: MessageEvent) => {
            // 개발용 file:// 과 배포용 origin 두 가지만 허용
            if (
                e.origin !== "https://kiosk-surgery.vercel.app" &&
                e.origin !== "null" &&
                e.origin !== "file://"
            )
                return;

            if (e.data?.type === "ELECTRON_SYSTEM_INIT" && !resolved) {
                const id = e.data?.data?.deviceId ?? e.data?.data?.cpuId;
                if (id) {
                    setDeviceId(id);
                    resolved = true;
                }
            }
        };
        window.addEventListener("message", msgHandler);

        /* 3) 3초 안에 못 얻으면 경고 로그만 남기고 종료 */
        const timer = setTimeout(() => {
            if (!resolved) console.warn("deviceId를 아직 받지 못했습니다.");
        }, 3000);

        return () => {
            window.removeEventListener("message", msgHandler);
            clearTimeout(timer);
        };
    }, [setDeviceId]);

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
        setReversCount(false);

        let clientInfo = null;
        try {
            const raw = localStorage.getItem("client-storage");
            if (raw) {
                clientInfo = JSON.parse(raw);
                const opeDate = clientInfo?.state?.client?.opeDate;
                const now = new Date()
                    .toISOString()
                    .slice(0, 10)
                    .split("-")
                    .join("");
                if (opeDate !== now) {
                    localStorage.removeItem("client-storage");
                    setIsRemoveClient(true);
                }
            }
        } catch (e) {
            toast.error("고객 정보를 로컬 스토리지에서 가져오지 못했습니다.");
            console.error(
                "고객 정보를 로컬 스토리지에서 가져오지 못했습니다.",
                e
            );
        }

        try {
            let url = `/api/kiosk-surgery/surgery?doctorId=${doctor.id}`;

            const psEntry = clientInfo?.state?.client?.psEntry || targetPsEntry;
            const opeCode = clientInfo?.state?.client?.opeCode || targetOpeCode;

            if (psEntry && opeCode) {
                url += `&psEntry=${psEntry}&opeCode=${opeCode}`;
            }
            if (targetDeviceId !== "") {
                url += `&deviceId=${targetDeviceId}`;
            }

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
                    if (diffSeconds < 0) {
                        setReversCount(true);
                    }
                    setCount(diffSeconds);
                }

                setTargetPsEntry("");
            }

            setOnLoading(false);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            setTargetPsEntry("");
            setTargetOpeCode("");
            setOnLoading(false);
        }
    };

    const time = isReversCount ? -count : count;
    const hours = Math.abs(Math.floor(time / 3600));
    const minutes = Math.abs(Math.floor((time % 3600) / 60));
    const seconds = Math.abs(time % 60);

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

    // 고객 마취 안전 정보 불러오기
    const handleSelectAnesthesiaList = async (
        psEntry: string,
        opeCode: string,
        opeDate: string
    ) => {
        try {
            const response = await fetch(
                `/api/kiosk-surgery/anesthesia/safety?psEntry=${psEntry}&opeCode=${opeCode}&opeDate=${opeDate}`,
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
            setOnLoading(false);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            setOnLoading(false);
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
            if (doctor.id == "") {
                return;
            }
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

    // 지방 추출 예측
    const onHandleSelectFepa = async (
        psEntry: string,
        age: number,
        sex: string
    ) => {
        try {
            const url = `/api/kiosk-surgery/fepa?doctorId=${doctor?.id}&psEntry=${psEntry}&age=${age}&sex=${sex}`;
            const response = await fetch(url, {
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

    // 기기의 고유 번호
    // useEffect(() => {
    //     if (Cookies.get("FINGERPRINT_HASH_KIOSK")) {
    //         const cookieVal = Cookies.get("FINGERPRINT_HASH_KIOSK");
    //         setFingerprint(cookieVal ?? "");
    //     } else {
    //         const getFingerprint = async () => {
    //             const fp = await FingerprintJS.load();
    //             const result = await fp.get();
    //             setFingerprint(result.visitorId);
    //             document.cookie = `FINGERPRINT_HASH_KIOSK=${result.visitorId}; path=/`;
    //         };
    //         getFingerprint();
    //     }
    // }, []);

    // 해당 수술의 상태 체크
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
                        if (res.status == 1) router.push("/record");
                        if (res.status == 2) router.push("/operate");
                    } else {
                        clearInterval(interval);
                        setIsErrorOpen(true);
                        setTargetDeviceId(deviceId);
                        localStorage.removeItem("client-storage");
                        setIsRemoveClient(true);
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
    }, [deviceId, doctor, client, isRemoveClient]);

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
            setOnLoading(false);
        }
    }, [deviceId, isBoostCheckStatus, isPaired]);

    // 해당 기기의 고유번호의 유효성 체크
    useEffect(() => {
        if (!deviceId) {
            return;
        }

        const interval = setInterval(() => {
            handleSelectDoctor().then((res) => {
                if (res.success) {
                    setPaired(true);
                } else {
                    setOnLoading(false);
                    setPaired(false);
                    toast.error(res.message);
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [deviceId]);

    // 수술 정보
    useEffect(() => {
        if (typeof doctor.id === "undefined" || doctor.id === "") {
            return;
        }
        setOnLoading(true);
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setOpeInfo(res.list);
                setIsRemoveClient(false);
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
    }, [doctor, targetDeviceId, isRemoveClient]);

    // 타이머
    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => {
                const newCount = prevCount - 1;
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
        let clientInfo = null;
        try {
            const raw = localStorage.getItem("client-storage");
            if (raw) {
                clientInfo = JSON.parse(raw);
            }
        } catch (e) {
            toast.error(
                "고객 정보를 로컬 스토리지 파싱하는데 오류가 발생했습니다."
            );
            console.error("로컬 스토리지 파싱 오류", e);
        }

        setClient({
            psEntry:
                clientInfo?.state?.client?.psEntry ||
                dataOpeInfo?.[0]?.고객번호,
            branch: clientInfo?.state?.client?.branch || dataOpeInfo?.[0]?.지점,
            name: clientInfo?.state?.client?.name || dataOpeInfo?.[0]?.고객명,
            licence:
                clientInfo?.state?.client?.licence ||
                dataOpeInfo?.[0]?.주민번호,
            part: clientInfo?.state?.client?.part || dataOpeInfo?.[0]?.수술부위,
            opeCode:
                clientInfo?.state?.client?.opeCode ||
                dataOpeInfo?.[0]?.수술코드,
            opeDate:
                clientInfo?.state?.client?.opeDate || dataOpeInfo?.[0]?.수술일,
        });
    }, [dataOpeInfo]);

    // 고객의 이미지
    useEffect(() => {
        if (typeof client?.psEntry === "undefined" || client?.psEntry === "") {
            return;
        } else {
            handleSelectImgLst(client?.psEntry).then((res) => {
                setImgs([]);
                if (res && res.success) {
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
        }
    }, [client]);

    // 고객의 인바디
    useEffect(() => {
        if (
            typeof client?.psEntry === "undefined" ||
            client?.psEntry === "" ||
            client?.part === ""
        ) {
            return;
        } else {
            handleSelectInbodyLst(client.psEntry, client.part).then((res) => {
                if (res?.success) {
                    const inbody = res?.inbody;
                    const cutInbody = inbody?.slice(-4);
                    const inbodyLength = inbody?.length;
                    setIsWeights({
                        BD_WEIGHT: inbody?.[inbodyLength - 1]?.["BD_WEIGHT"],
                        WC_WEIGHT: inbody?.[inbodyLength - 1]?.["WC_WEIGHT"],
                        MUST_WEIGHTL:
                            inbody?.[inbodyLength - 1]?.["MUST_WEIGHTL"],
                    });
                    setWeightArr(
                        cutInbody?.map((v: never) => {
                            return {
                                date: v?.["PRODATE"],
                                weight: v?.["BD_WEIGHT"],
                            };
                        })
                    );
                    setIsCalories(
                        cutInbody?.map((c: never) => {
                            return {
                                date: c?.["PRODATE"],
                                blBaseCalory: c?.["BL_BASECALORY"],
                                wcBasic: c?.["WC_BASIC"],
                            };
                        })
                    );
                    setIsBmiFat(
                        cutInbody?.map((b: never) => {
                            return {
                                date: b?.["PRODATE"],
                                obstFatH: b?.["OBST_FATH"],
                                obstFatL: b?.["OBST_FATL"],
                                obFat: b?.["OB_FAT"],
                            };
                        })
                    );
                    setIsBmi(
                        cutInbody?.map((m: never) => {
                            return {
                                date: m?.["PRODATE"],
                                obstBmiH: m?.["OBST_BMIH"],
                                obstBmiL: m?.["OBST_BMIL"],
                                obBmi: m?.["OB_BMI"],
                            };
                        })
                    );
                    setIsMineral(
                        cutInbody?.map((r: never) => {
                            return {
                                date: r?.["PRODATE"],
                                bdstMineralH: r?.["BDST_MINERALH"],
                                bdstMineralL: r?.["BDST_MINERALL"],
                                bdMineral: r?.["BD_MINERAL"],
                            };
                        })
                    );
                    setIsProtein(
                        cutInbody?.map((p: never) => {
                            return {
                                date: p?.["PRODATE"],
                                bdstProteinH: p?.["BDST_PROTEINH"],
                                bdstProteinL: p?.["BDST_PROTEINL"],
                                bdProtein: p?.["BD_PROTEIN"],
                            };
                        })
                    );
                    setIsWater(
                        cutInbody?.map((w: never) => {
                            return {
                                date: w?.["PRODATE"],
                                bdstWaterH: w?.["BDST_WATERH"],
                                bdstWaterL: w?.["BDST_WATERL"],
                                bdWater: w?.["BD_WATER"],
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
        }
    }, [client]);

    // 고객의 마취 안전
    useEffect(() => {
        if (
            typeof client?.psEntry === "undefined" ||
            client?.psEntry === "" ||
            client?.opeCode === "" ||
            client?.opeDate === ""
        ) {
            return;
        } else {
            handleSelectAnesthesiaList(
                client?.psEntry,
                client?.opeCode,
                client?.opeDate
            )?.then((res) => {
                if (res && res.success) {
                    const data = res?.anesthesia;
                    setIsAnesthesia(
                        data?.map((a: never) => {
                            return {
                                riskLevel: a?.["PROBA_1"],
                                warningLevel: a?.["WARNING_LEVEL"],
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
        }
    }, [client]);

    // 지방 예측 추출
    useEffect(() => {
        if (
            typeof client?.psEntry === "undefined" ||
            client?.psEntry === "" ||
            client?.opeCode === ""
        ) {
            return;
        } else {
            const age = Number(handleBirthToAge(client?.licence));
            const sex =
                client?.licence?.slice(6, 7) === "2" ||
                client?.licence?.slice(6, 7) === "4"
                    ? "F"
                    : "M";
            onHandleSelectFepa(client?.psEntry, age, sex)?.then((res) => {
                if (res?.success) {
                    const limitFatParts = res?.fatList;
                    const limitFatPart = limitFatParts?.find(
                        (v: never) => v?.["메인부위명"] === client?.part
                    )?.["평균예측지방량"];
                    setIsLimitFatPart(limitFatPart);
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
    }, [client, deviceId, doctor]);

    //     기기 고유 번호
    //     useEffect(() => {
    //         setDeviceId(fingerprint);
    //     }, [fingerprint]);

    // CPUID
    // useEffect(() => {
    //     const handleMessage = (event: MessageEvent) => {
    //         // 개발 중엔 'null' 허용
    //         if (
    //             event.origin !== "null" &&
    //             event.origin !== "file://" &&
    //             event.origin !== "https://kiosk-surgery.vercel.app"
    //         ) {
    //             console.log("허용되지 않은 origin:", event.origin);
    //             return;
    //         }
    //         if (event.data?.type === "ELECTRON_SYSTEM_INIT") {
    //             setDeviceId(event.data?.data?.cpuId);
    //         }
    //     };

    //     window.addEventListener("message", handleMessage);
    //     return () => window.removeEventListener("message", handleMessage);
    // }, []);

    // useEffect(() => {
    //     const fetchCPU = async () => {
    //         const cpuId = await window.electronAPI?.getCPUID?.();
    //         setDeviceId(cpuId);
    //     };
    //     fetchCPU();
    // }, []);
    // console.log("device", deviceId);
    // 개발 시 사용
    // useEffect(() => {
    //     setDeviceId("Apple M1 Pro");
    // }, []);
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
                        <Photo
                            isPaired={isPaired}
                            setModalImgsOpen={setModalImgsOpen}
                            imgs={imgs}
                            lastRegDate={lastRegDate}
                        />
                        <Ai
                            isPaired={isPaired}
                            setModalAIOpen={setModalAIOpen}
                            isAnesthesia={isAnesthesia}
                            isLimitFatPart={isLimitFatPart}
                        />
                        <Inbody
                            isPaired={isPaired}
                            setInbodyOpen={setInbodyOpen}
                            weightArr={weightArr}
                            isWeights={isWeights}
                            height={dataOpeInfo?.[0]?.HEIGHT}
                        />
                    </div>
                    <CustomBtn
                        text={
                            !isPaired || dataOpeInfo?.length === 0
                                ? `수술 대상이 아직 선택되지 않았습니다.`
                                : `시작하기`
                        }
                        bg={
                            !isPaired || dataOpeInfo?.length === 0
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
                                : `시작까지 남은 시간`
                        }
                        time={formattedTime}
                        color={isReversCount ? `#F9AC68` : `#15CF8F`}
                    />
                )}
                <Process isProcess={1} />
            </main>
            <Footer />
            <ModalSelectOpe
                isOpen={isOpeOpen}
                isOpeOpenNext={isOpeOpenNext}
                setOpeOpen={setOpeOpen}
                setTargetPsEntry={setTargetPsEntry}
                setTargetOpeCode={setTargetOpeCode}
                dataAllOpe={dataAllOpe}
                deviceId={deviceId}
            />
            <ModalInbody
                isInbodyOpen={isInbodyOpen}
                setInbodyOpen={setInbodyOpen}
                weightArr={weightArr}
                isWeights={isWeights}
                isCalories={isCalories}
                isBmiFat={isBmiFat}
                isBmi={isBmi}
                isMineral={isMineral}
                isProtein={isProtein}
                isWater={isWater}
            />
            <ModalImgs
                imgs={imgs}
                isModalImgsOpen={isModalImgsOpen && isPaired}
                setModalImgsOpen={setModalImgsOpen}
            />
            <ModalAI
                isModalAIOpen={isModalAIOpen && isPaired}
                setModalAIOpen={setModalAIOpen}
                isAnesthesia={isAnesthesia}
            />
            <ModalError
                isErrorOpen={isErrorOpen}
                setIsErrorOpen={setIsErrorOpen}
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
