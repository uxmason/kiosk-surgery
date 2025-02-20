import { CustomBtn, Footer, Process, UpcomingTime } from "@/components/common";
import { Ai, Client, Inbody, Info, Photo, Texts } from "@/components/main";

export default function Home() {
    return (
        <>
            <main className="px-[178px] w-full">
                <Texts />
                <div className="flex flex-col w-full pt-[120px]">
                    <div className="flex w-full gap-x-5">
                        <Client />
                        <Info />
                    </div>
                    <div className="flex w-full gap-x-5 py-5">
                        <Inbody />
                        <Photo />
                        <Ai />
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
                    time="01:03"
                    color="#15CF8F"
                />
                <Process isProcess={1} />
            </main>
            <Footer />
        </>
    );
}
