import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";
import { getFormattedDate } from "@/function";

export async function POST(req: NextRequest) {
    try {
        const { deviceID, userID, opCode, psEntry } = await req.json();
        const today = getFormattedDate();
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH='${deviceID}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        const device_ID = deviceResult.length > 0 ? deviceResult[0]._id : null;
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        } else {
            const deviceSql = `SELECT * FROM KIOSK_SURGERY WHERE DEVICE_ID != '${device_ID}' AND PSENTRY='${psEntry}' AND OPDATE='${today}' AND OPCODE='${opCode}'`;
            const deviceResult = await queryDB(deviceSql);
            if (deviceResult?.length > 0) {
                return NextResponse.json({
                    success: false,
                    message: "다른 다비이스에서 이미 시작한 수술입니다.",
                });
            } else {
                const deviceSql = `SELECT TOP 1 * FROM tsfmc_data.dbo.ADM010T WHERE PSENTRY='${psEntry}'`;
                const deviceResult = await queryDB(deviceSql);
                const client = deviceResult.length > 0 ? deviceResult[0] : null;
                if (deviceResult?.length == 0) {
                    return NextResponse.json({
                        success: false,
                        message: "존재하지 않는 회원입니다.",
                    });
                } else {
                    const updateSql = `UPDATE tsfmc_mailsystem.dbo.KIOSK_DEVICES SET USER_ID='${userID}', updatedAt=SYSDATETIME() WHERE DEVICE_HASH='${deviceID}'`;
                    await queryDB(updateSql);
                    return NextResponse.json({
                        success: true,
                        client: client,
                    });
                }
            }
        }
    } catch {
        return NextResponse.json(
            { success: false, message: "서버 오류 발생" },
            { status: 500 }
        );
    }
}
