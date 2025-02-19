import {
    Ai,
    Client,
    Inbody,
    Info,
    Photo,
    StartBtn,
    Texts,
} from "@/components/main";

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
                    <StartBtn />
                </div>
            </main>
            <footer></footer>
        </>
    );
}
