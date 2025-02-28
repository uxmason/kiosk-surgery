/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { psEntry } = Object.fromEntries(url.searchParams.entries());
        const sql = `SELECT * FROM tsfmc_data.dbo.ADM700T 
                    WHERE PSENTRY = '${psEntry}' 
                    ORDER BY PRODATE DESC
                    `;
        const results: any[] = await queryDB(sql);
        return NextResponse.json({ success: true, inbody: results });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "인바디 정보를 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
