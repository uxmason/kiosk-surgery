import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: Request) {
    try {
        const { deviceId, cannulaID, psEntry, opDate, doctorId } =
            await req.json();

        const deviceSql = `
            SELECT * FROM tsfmc_mailsystem.dbo.KIOSK_DEVICES 
            WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (!deviceResult || deviceResult.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        const cannulaSql = `
            SELECT TOP 1 * FROM CNL_CANNULA 
            WHERE _id = ${Number(cannulaID)}`;
        const cannulaResult = await queryDB(cannulaSql);
        if (!cannulaResult || cannulaResult.length === 0) {
            return NextResponse.json({
                success: false,
                message: "이 _id로 등록된 캐뉼라 정보는 없습니다.",
            });
        }

        const checkCannulaSurgerySql = `
            SELECT TOP 1 * FROM CNL_SURGERY 
            WHERE CANNULA_ID = ${Number(cannulaID)} 
                AND PSENTRY = '${psEntry}' 
                AND OPDATE = '${opDate}'`;
        const checkCannulaSurgeryResult = await queryDB(checkCannulaSurgerySql);

        const checkCdmtSql = `
            SELECT TOP 1 * FROM CNL_DOCTOR_TOOL_MAP 
            WHERE CANNULA_ID = ${Number(cannulaID)} 
                AND DOCTOR_ID = '${doctorId}'`;
        const checkCdmtResult = await queryDB(checkCdmtSql);

        if (checkCannulaSurgeryResult?.length > 0) {
            // 🔹 이미 존재하면 UPDATE
            const updateCannulSql = `
                UPDATE CNL_SURGERY SET createdAt = SYSDATETIME() 
                WHERE CANNULA_ID = ${Number(cannulaID)} 
                    AND PSENTRY = '${psEntry}' 
                    AND OPDATE = '${opDate}'`;
            await queryDB(updateCannulSql);

            if (checkCdmtResult?.length > 0) {
                const updateCdmtSql = `
                    UPDATE CNL_DOCTOR_TOOL_MAP SET createdAt = SYSDATETIME() 
                    WHERE CANNULA_ID = ${Number(cannulaID)} 
                        AND DOCTOR_ID = '${doctorId}'`;
                await queryDB(updateCdmtSql);
            } else {
                const insertCdtmSql = `
                    INSERT INTO CNL_DOCTOR_TOOL_MAP (CANNULA_ID, DOCTOR_ID, createdAt) 
                    VALUES (${Number(
                        cannulaID
                    )}, '${doctorId}', SYSDATETIME())`;
                await queryDB(insertCdtmSql);
            }
        } else {
            // 🔹 존재하지 않으면 INSERT
            const insertCannulSql = `
                INSERT INTO CNL_SURGERY (CANNULA_ID, PSENTRY, OPDATE, createdAt) 
                VALUES (${Number(
                    cannulaID
                )}, '${psEntry}', '${opDate}', SYSDATETIME())`;
            await queryDB(insertCannulSql);

            const insertCdtmSql = `
                INSERT INTO CNL_DOCTOR_TOOL_MAP (CANNULA_ID, DOCTOR_ID, createdAt) 
                VALUES (${Number(cannulaID)}, '${doctorId}', SYSDATETIME())`;
            await queryDB(insertCdtmSql);
        }
        return NextResponse.json({ success: true, cannulaID });
    } catch (err) {
        console.error("Server Error:", err);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
