"use client";

import {
    ClientInfo,
    CustomBtn,
    Footer,
    Process,
    UpcomingTime,
} from "@/components/common";
import { Cannulas, Parts } from "@/components/operate";

export default function Info() {
    return (
        <>
            <main className="pt-5 w-full">
                <div className="px-5">
                    <ClientInfo />
                </div>
                <Cannulas />
                <Parts />
                <div className="flex w-full justify-center pt-5 px-5">
                    <CustomBtn
                        text="기록 완료"
                        bg="#5B87ED"
                        isShow={true}
                        isShowBtnText="수행 단계로"
                    />
                </div>
                <UpcomingTime text="수술 경과 시간" time="02:23" color="#FFF" />
                <Process isProcess={3} />
            </main>
            <Footer />
        </>
    );
}
