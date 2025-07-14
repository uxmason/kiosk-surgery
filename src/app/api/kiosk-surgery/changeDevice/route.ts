import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";
import { getFormattedDate } from "@/function";

export async function POST(req: NextRequest) {
    try {
        const { deviceID, userID, psEntry, opCode, part, status } =
            await req.json();
        const today = getFormattedDate();
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceID}' AND USER_ID = '${userID}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        const device_ID = deviceResult.length > 0 ? deviceResult[0]._id : null;
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message:
                    "해당 수술의 상태를 조절하는 권한을 받은 디바이스가 아닙니다.",
            });
        } else {
            const deviceSql = `SELECT * FROM KIOSK_SURGERY WHERE PSENTRY='${psEntry}' AND OPDATE='${today}' AND OPCODE='${opCode}'`;
            const deviceResult = await queryDB(deviceSql);
            if (deviceResult?.length == 0) {
                const insertSql = `INSERT INTO tsfmc_mailsystem.dbo.KIOSK_SURGERY (DEVICE_ID, PSENTRY, PART, OPDATE, OPCODE, STATUS, createdAt) VALUES('${device_ID}', '${psEntry}', '${part}', '${today}', '${opCode}', ${status}, SYSDATETIME())`;
                await queryDB(insertSql);
                return NextResponse.json({
                    success: true,
                });
            } else {
                if (deviceResult?.[0]?._id === device_ID) {
                    const updateSql = `UPDATE KIOSK_SURGERY SET STATUS=${status}, updatedAt=SYSDATETIME() WHERE DEVICE_ID = '${device_ID}' AND PSENTRY = '${psEntry}' AND OPDATE = '${today}' AND OPCODE = '${opCode}'`;
                    await queryDB(updateSql);
                    return NextResponse.json({
                        success: true,
                    });
                } else {
                    const updateSql = `UPDATE KIOSK_SURGERY SET DEVICE_ID = ${device_ID}, STATUS = ${status}, updatedAt=SYSDATETIME() WHERE PSENTRY = '${psEntry}' AND OPDATE = '${today}' AND OPCODE = '${opCode}'`;
                    await queryDB(updateSql);
                    return NextResponse.json({
                        success: true,
                        message:
                            "다른 기기에 등록되었던 수술을 해제 후 이 기기로 업데이트합니다.",
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
