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
import { useState } from "react";

export default function Info() {
    const [isOpenOpeModal, setIsOpenOpeModal] = useState(false);
    const [isOpenAddCannualModal, setIsOpenAddCannualModal] = useState(false);
    const [isModalComplete, setIsModalComplete] = useState(false);

    return (
        <>
            <main className="pt-5 w-full">
                <div className="px-5">
                    <ClientInfo setIsOpenOpeModal={setIsOpenOpeModal} />
                </div>
                <Cannulas setIsOpenAddCannualModal={setIsOpenAddCannualModal} />
                <Parts />
                <div className="flex w-full justify-center pt-5 px-5">
                    <CustomBtn
                        text="기록 완료"
                        bg="#5B87ED"
                        isShow={true}
                        isShowBtnText="수행 단계로"
                        setIsModalComplete={setIsModalComplete}
                    />
                </div>
                <UpcomingTime text="수술 경과 시간" time="02:23" color="#FFF" />
                <Process isProcess={3} />
            </main>
            <Footer />
            <ModalOpeInfo
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
