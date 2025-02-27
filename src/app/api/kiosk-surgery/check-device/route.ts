import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";

// GET 요청 처리
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const { deviceId } = Object.fromEntries(url.searchParams.entries());
        const sql = `SELECT * FROM tsfmc_mailsystem.dbo.KIOSK_DEVICES 
                    WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1
                    `;
        const deviceResult = await queryDB(sql);
        if (deviceResult?.length > 0) {
            const userId = deviceResult?.[0]?.USER_ID;

            if (userId) {
                const doctorSql = `
                                    SELECT STARTBRAN, USER_ID 
                                    FROM tsfmc_mailsystem.dbo.MAIL_ADMIN 
                                    WHERE USER_ID = '${userId}'
                                `;
                const doctorResult = await queryDB(doctorSql);

                return NextResponse.json({
                    success: true,
                    doctorInfo: doctorResult,
                });
            } else {
                return NextResponse.json({
                    success: true,
                    doctorInfo: null,
                });
            }
        } else {
            const insertSql = `INSERT INTO tsfmc_mailsystem.dbo.KIOSK_DEVICES (DEVICE_HASH, createdAt)
                                VALUES ('${deviceId}', SYSDATETIME())
                            `;
            await queryDB(insertSql);

            return NextResponse.json({
                success: false,
                doctorId:
                    "키오스크 등록했습니다. 관리자 등록이 있을 때까지 기다려 주세요.",
            });
        }
    } catch {
        return NextResponse.json(
            { success: false, message: "서버 오류 발생" },
            { status: 500 }
        );
    }
}
