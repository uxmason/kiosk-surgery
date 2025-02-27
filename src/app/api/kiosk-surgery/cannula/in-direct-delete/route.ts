import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const { deviceId, cannulaID, psEntry, opDate } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = '1'`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        // 🔹 CANNULA 존재 여부 확인
        const checkResult = await queryDB(
            `SELECT TOP 1 * FROM CNL_CANNULA 
            WHERE _id = ${cannulaID}`
        );
        if (checkResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "이 _id로 등록된 캐뉼라 정보는 없습니다.",
            });
        }

        await queryDB(
            `DELETE FROM CNL_SURGERY 
            WHERE CANNULA_ID = ${cannulaID} 
            AND PSENTRY = ${psEntry} 
            AND OPDATE = ${opDate}`
        );

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: "서버 오류 발생" },
            { status: 500 }
        );
    }
}
