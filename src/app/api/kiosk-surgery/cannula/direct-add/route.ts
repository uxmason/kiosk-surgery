import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: Request) {
    try {
        const { deviceId, cannulaID, psEntry, opDate } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM tsfmc_mailsystem.dbo.KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        // 캐뉼라 정보 확인
        const cannulaSql = `SELECT TOP 1 * FROM CNL_CANNULA WHERE _id = ${cannulaID}`;
        const cannulaResult = await queryDB(cannulaSql);
        if (cannulaResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "이 _id로 등록된 캐뉼라 정보는 없습니다.",
            });
        }

        // 수술 정보 등록
        const insertSql = `INSERT INTO CNL_SURGERY (CANNULA_ID, PSENTRY, OPDATE, createdAt) 
                        VALUES (${cannulaID}, ${psEntry}, ${opDate}, SYSDATETIME())
                        `;
        await queryDB(insertSql);

        return NextResponse.json({ success: true, cannulaID: cannulaID });
    } catch {
        return NextResponse.json(
            { success: false, message: "사용할 수 없는 디바이스 정보입니다." },
            { status: 500 }
        );
    }
}
