import { NextRequest, NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        let cannulaID;
        const {
            deviceId,
            modelNameID,
            holeCountID,
            tipID,
            shapeID,
            lengthID,
            thicknessID,
            psEntry,
            opDate,
            doctorId,
        } = await req.json();

        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = '${deviceId}' AND AVAILABLE = 1`;
        const deviceResult = await queryDB(deviceSql);
        if (deviceResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용할 수 없는 디바이스 정보입니다.",
            });
        }

        const branchCode = psEntry.substring(0, 2);
        const branchMapping: Record<string, string> = {
            "36": "서울",
            "34": "인천",
            "18": "대전",
            "35": "대구",
            "21": "부산",
        };
        const branchName = branchMapping[branchCode] || "";

        const cannulaSql = `SELECT TOP 1 * FROM CNL_CANNULA 
                            WHERE MODEL_NAME_ID = ${Number(modelNameID)} 
                                AND HOLE_COUNT_ID = ${Number(holeCountID)}
                                AND TIP_ID = ${Number(tipID)}
                                AND SHAPE_ID = ${Number(shapeID)}
                                AND LENGTH_ID = ${Number(lengthID)}
                                AND THICKNESS_ID = ${Number(thicknessID)}
        `;
        const checkCannula = await queryDB(cannulaSql);

        if (checkCannula?.length === 0) {
            const insertQuery = branchName
                ? `INSERT INTO CNL_CANNULA (MODEL_NAME_ID, HOLE_COUNT_ID, TIP_ID, SHAPE_ID, LENGTH_ID, THICKNESS_ID, ${branchName}, createdAt)
                    VALUES (${modelNameID}, ${holeCountID}, ${tipID}, ${shapeID}, ${lengthID}, ${thicknessID}, 1, SYSDATETIME());
                    SELECT SCOPE_IDENTITY() AS id`
                : `INSERT INTO CNL_CANNULA (MODEL_NAME_ID, HOLE_COUNT_ID, TIP_ID, SHAPE_ID, LENGTH_ID, THICKNESS_ID, createdAt)
                    VALUES (${modelNameID}, ${holeCountID}, ${tipID}, ${shapeID}, ${lengthID}, ${thicknessID}, SYSDATETIME());
                    SELECT SCOPE_IDENTITY() AS id`;

            const insertResult = await queryDB(insertQuery);
            cannulaID = insertResult?.[0]?.id;
        } else {
            cannulaID = checkCannula?.[0]?._id;
        }

        const checkCannulaSurgerySql = `SELECT TOP 1 * FROM CNL_SURGERY 
                                        WHERE CANNULA_ID = ${cannulaID} AND PSENTRY = '${psEntry}' AND OPDATE = '${opDate}'`;
        const checkCannulaSurgeryResult = await queryDB(checkCannulaSurgerySql);

        const checkCdmtSql = `SELECT TOP 1 * FROM CNL_DOCTOR_TOOL_MAP 
                            WHERE CANNULA_ID = ${cannulaID} AND DOCTOR_ID = '${doctorId}'`;
        const checkCdmtResult = await queryDB(checkCdmtSql);

        if (checkCannulaSurgeryResult?.length > 0) {
            const updateSurgerySql = `UPDATE CNL_SURGERY SET createdAt = SYSDATETIME() 
                                    WHERE CANNULA_ID = ${cannulaID} AND PSENTRY = '${psEntry}' AND OPDATE = '${opDate}'`;
            await queryDB(updateSurgerySql);

            if (checkCdmtResult?.length > 0) {
                const updateCdmtSql = `UPDATE CNL_DOCTOR_TOOL_MAP SET createdAt = SYSDATETIME() 
                                    WHERE CANNULA_ID = ${cannulaID} AND DOCTOR_ID = '${doctorId}'`;
                await queryDB(updateCdmtSql);
            } else {
                const insertCdtmSql = `INSERT INTO CNL_DOCTOR_TOOL_MAP (CANNULA_ID, DOCTOR_ID, createdAt) 
                                    VALUES (${cannulaID}, '${doctorId}', SYSDATETIME())`;
                await queryDB(insertCdtmSql);
            }
        } else {
            const insertSurgerySql = `INSERT INTO CNL_SURGERY (CANNULA_ID, PSENTRY, OPDATE, createdAt) 
                                    VALUES (${cannulaID}, '${psEntry}', '${opDate}', SYSDATETIME())`;
            await queryDB(insertSurgerySql);

            const insertCdtmSql = `INSERT INTO CNL_DOCTOR_TOOL_MAP (CANNULA_ID, DOCTOR_ID, createdAt) 
                                VALUES (${cannulaID}, '${doctorId}', SYSDATETIME())`;
            await queryDB(insertCdtmSql);
        }

        return NextResponse.json({ success: true, cannulaID });
    } catch (err) {
        console.error("ERROR:", err);
        return NextResponse.json(
            { success: false, message: "새로운 캐뉼라를 등록하지 못했습니다." },
            { status: 500 }
        );
    }
}
