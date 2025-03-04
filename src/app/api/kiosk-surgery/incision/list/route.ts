/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFormattedDate } from "@/function";
import queryDB from "../../../../../../lib/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { psEntry } = Object.fromEntries(url.searchParams.entries());
        const opDate = getFormattedDate();
        const sql = `SELECT I._id, S._id AS SURGERY_ID, POINT_NAME, AJAX_ID, 
                        CASE WHEN EXISTS (
                        SELECT 1 FROM tsfmc_mailsystem.dbo.ICS_SURGERY S 
                        WHERE S.INCISION_ID = I._id AND S.PSENTRY = '${psEntry}' AND S.OPDATE = '${opDate}'
                        ) THEN 1 ELSE 0 END AS SELECTED
                    FROM tsfmc_mailsystem.dbo.ICS_INCISION I
                    LEFT JOIN tsfmc_mailsystem.dbo.ICS_SURGERY S
                    ON S.INCISION_ID = I._id AND S.PSENTRY = '${psEntry}' AND S.OPDATE = '${opDate}'
                    ORDER BY AJAX_ID
                    `;
        const results: any[] = await queryDB(sql);
        return NextResponse.json({ success: true, list: results });
    } catch {
        return new Response(
            JSON.stringify({
                success: false,
                message: "인시젼 정보를 가져오지 못했습니다.",
            }),
            { status: 500 }
        );
    }
}
