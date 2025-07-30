import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const { deviceId, cdtmId, doctorId } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        // 🔹 CANNULA 존재 여부 확인
        const checkResult = await queryDB(
            `SELECT TOP 1 * FROM CNL_DOCTOR_TOOL_MAP
            WHERE _id = ${cdtmId}`
        );
        if (checkResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "이 _id로 등록된 캐뉼라 정보는 없습니다.",
            });
        }

        await queryDB(
            `DELETE FROM CNL_DOCTOR_TOOL_MAP
            WHERE _id = ${cdtmId} 
            AND DOCTOR_ID = '${doctorId}'`
        );

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: "캐뉼라 삭제를 실패했습니다." },
            { status: 500 }
        );
    }
}
