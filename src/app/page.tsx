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
import { useState } from "react";

export default function Home() {
    const [isOpeOpen, setIsOpeOpen] = useState(false);
    const [isInbodyOpen, setIsInbodyOpen] = useState(false);
    const [isModalImgsOpen, setIsModalImgsOpen] = useState(false);
    const [isModalAIOpen, setIsModalAIOpen] = useState(false);

    return (
        <>
            <main className="px-[178px] w-full">
                <Texts />
                <div className="flex flex-col w-full pt-[120px]">
                    <div className="flex w-full gap-x-5">
                        <Client setIsOpeOpen={setIsOpeOpen} />
                        <Info />
                    </div>
                    <div className="flex w-full gap-x-5 py-5">
                        <Inbody setIsInbodyOpen={setIsInbodyOpen} />
                        <Photo setIsModalImgsOpen={setIsModalImgsOpen} />
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
                    time="01:03"
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
