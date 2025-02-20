"use client";

import {
    ClientInfo,
    CustomBtn,
    Footer,
    Process,
    UpcomingTime,
} from "@/components/common";
import { FirstImgs, SecondImgs } from "@/components/record";
import { useState } from "react";

export default function Info() {
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const [isSecondOpen, setIsSecondOpen] = useState(false);

    return (
        <>
            <main className="pt-5 px-5  w-full">
                <ClientInfo />
                <FirstImgs
                    isFirstOpen={isFirstOpen}
                    isSecondOpen={isSecondOpen}
                    setIsFirstOpen={setIsFirstOpen}
                />
                <SecondImgs
                    isSecondOpen={isSecondOpen}
                    setIsSecondOpen={setIsSecondOpen}
                />
                <div className="flex w-full justify-center pt-5">
                    <CustomBtn
                        text="수술 완료"
                        bg="#ED6B5B"
                        isShow={true}
                        isShowBtnText="준비 단계로"
                    />
                </div>
                <UpcomingTime
                    text="수술 경과 시간"
                    time="00:03:23"
                    color="#ED6B5B"
                />
                <Process isProcess={2} />
            </main>
            <Footer />
        </>
    );
}
