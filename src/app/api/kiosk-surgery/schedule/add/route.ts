import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const {
            deviceID,
            userID,
        } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH='${deviceID}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        } else {
            const updateSql = `UPDATE tsfmc_mailsystem.dbo.KIOSK_DEVICES SET USER_ID='${userID}', updatedAt=SYSDATETIME() WHERE DEVICE_HASH='${deviceID}'`;
            await queryDB(updateSql);
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: "서버 오류 발생" },
            { status: 500 }
        );
    }
}
