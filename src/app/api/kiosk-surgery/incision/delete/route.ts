import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const { deviceId, incisionInSurgeryID } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        await queryDB(
            `DELETE FROM ICS_SURGERY WHERE _id = ${incisionInSurgeryID}`
        );

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: "인시젼 정보를 삭제할 수 없습니다." },
            { status: 500 }
        );
    }
}
