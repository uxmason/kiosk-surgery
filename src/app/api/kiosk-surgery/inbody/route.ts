import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const psEntry = url.searchParams.get("psEntry") ?? "";
        const part = url.searchParams.get("part");

        if (!psEntry) {
            return NextResponse.json(
                { success: false, message: "psEntry가 필요합니다." },
                { status: 400 }
            );
        }

        const queryInbody = `
            SELECT * 
            FROM tsfmc_data.dbo.ADM700T 
            WHERE PSENTRY = '${psEntry}'
            ORDER BY PRODATE;
        `;
        const inbodyResults = await queryDB(queryInbody);

        const queryPatient = `
            SELECT * 
            FROM tsfmc_mailsystem.dbo.MAIL_OPE_LIST AS L
            JOIN tsfmc_mailsystem.dbo.MAIL_OPE_SIZE AS S 
                ON L.고객번호 = S.고객번호 AND L.수술일자 = S.수술일자
            JOIN tsfmc_data.dbo.ADM010T AS A 
                ON L.고객번호 = A.PSENTRY
            WHERE L.고객번호 = '${psEntry}'
            ${part ? `AND L.메인부위명 = N'${part}'` : ""}
            ORDER BY L.수술일자 DESC
        `;
        const patientResults = await queryDB(queryPatient);
        return NextResponse.json({
            success: true,
            inbody: inbodyResults,
            patientData: patientResults,
        });
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: "인바디 및 수술 정보를 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
