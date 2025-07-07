/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { userID } = Object.fromEntries(url.searchParams.entries());
        const sql = `SELECT top 1 * FROM tsfmc_mailsystem.dbo.KIOSK_SURGERY S, tsfmc_mailsystem.dbo.KIOSK_DEVICES D
        WHERE S.DEVICE_ID = D._id AND USER_ID = '${userID}' ORDER BY S.createdAt DESC;`;
        const results = await queryDB(sql);
        if (results.length > 0) {
            return NextResponse.json({
                success: true,
                status: results[0].STATUS,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "해당 수술이 존재하지 않습니다.",
            });
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "해당 수술의 상태값을 받아오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
