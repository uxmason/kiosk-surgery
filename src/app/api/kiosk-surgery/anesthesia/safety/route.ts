import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";
import { getFormattedDate } from "@/function";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const { psEntry, opeCode } = Object.fromEntries(
            url.searchParams.entries()
        );
        const today = getFormattedDate();

        const sql = `SELECT PROBA_1, WARNING_LEVEL  FROM  tsfmc_mailsystem.dbo.SURGICA_ANESTHESIA_SAFETY
            WHERE PSENTRY = '${psEntry}' AND PACKAGE = '${opeCode}' AND PROMDATE = '${today}';`;
        const results = await queryDB(sql);
        return NextResponse.json({
            success: true,
            anesthesia: results,
        });
    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: "고객의 마취 안전 정보를 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
