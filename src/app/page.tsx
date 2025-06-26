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

export default function Home() {
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

    // 키오스크에 등록된 의사 찾기
    const handleSelectDoctor = async () => {
        setOnLoading(true);
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
            const response = await fetch(url, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            if (result?.success) {
                const now = new Date();

                const currentTime =
                    now.getHours() * 60 * 60 +
                    now.getMinutes() * 60 +
                    now.getSeconds();

                setCount(
                    Number(result?.list[0]?.시작시간?.substring(0, 2)) *
                        60 *
                        60 +
                        Number(result?.list[0]?.시작시간?.substring(2, 4)) *
                            60 -
                        currentTime
                );
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

    const hours = Math.floor((isReversCount ? -count : count) / 60 / 60);
    const minutes = Math.floor(((isReversCount ? -count : count) / 60) % 60);
    const seconds = (isReversCount ? -count : count) % 60;

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
        setOnLoading(true);
        try {
            const response = await fetch(
                `/api/kiosk-surgery/photos?psEntry=${psEntry}`,
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

    const handleSelectAllOpe = async () => {
        setOnLoading(true);
        try {
            const response = await fetch(`/api/kiosk-surgery/schedule/`, {
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
        if (deviceId && isBoostCheckStatus) {
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
                    console.log("error", res.message);
                    toast.error(res.message);
                    setPaired(false);
                }
                setBoostCheckStatus(false);
            });
        }
    }, [deviceId, isBoostCheckStatus]);

    useEffect(() => {
        if (!doctor.id) return;
        setOnLoading(true);
        onHandleSelectOpe().then((res) => {
            if (res.success) {
                setOpeInfo(res.list);
            } else {
                console.log("FAIL");
            }
            setOnLoading(false);
        });
    }, [doctor]);

    useEffect(() => {
        if (count <= 0) setReversCount(true);

        const timer = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    useEffect(() => {
        if (isOpeOpen) {
            handleSelectAllOpe().then((res) => {
                if (res.success) {
                    setAllOpe(res.list);
                    setOpeOpenNext(true);
                } else {
                    console.log("error", res.message);
                    toast.error(res.message);
                }
            });
        } else {
            setOpeOpenNext(false);
            setBoostCheckStatus(true);
        }
    }, [isOpeOpen]);

    useEffect(() => {
        if (!dataOpeInfo) return;
        setClient({
            psEntry: dataOpeInfo?.[0]?.["고객번호"],
            branch: dataOpeInfo?.[0]?.["지점"],
            name: dataOpeInfo?.[0]?.["고객명"],
            licence: dataOpeInfo?.[0]?.["주민번호"],
            part: dataOpeInfo?.[0]?.["수술부위"],
            opeCode: dataOpeInfo?.[0]?.["수술코드"],
            // psEntry: "210041652",
            // branch: "부산",
            // name: "허서회",
            // licence: "9808252120717",
            // part: "허벅지",
            // opeCode: "OPE0537",
        });
    }, [dataOpeInfo]);

    // 고객 이미지 담기
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
            }
        });
    }, [client]);

    // 고객 인바디 정보 담기
    useEffect(() => {
        if (client.psEntry === "" && client.part === "") return;
        handleSelectInbodyLst(client.psEntry, client.part).then((res) => {
            if (res.success) {
                const inbody = res?.inbody;
                setIsWeights({
                    BD_WEIGHT: inbody?.[0]?.["BD_WEIGHT"],
                    WC_WEIGHT: inbody?.[0]?.["WC_WEIGHT"],
                    MUST_WEIGHTL: inbody?.[0]?.["MUST_WEIGHTL"],
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

    useEffect(() => {
        setDeviceId(fingerprint);
    }, [fingerprint]);

    return (
        <>
            <main
                className="w-[724px] h=[1980px] absolute"
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
