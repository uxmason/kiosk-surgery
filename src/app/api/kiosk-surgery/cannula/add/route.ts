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
        } = await req.json();

        // 디바이스 확인
        const deviceSql = `SELECT * FROM KIOSK_DEVICES WHERE DEVICE_HASH = ${deviceId} AND AVAILABLE = 1`;
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

        // 🔹 CANNULA 존재 여부 확인
        const cannulaSql = `
                SELECT TOP 1 * FROM CNL_CANNULA 
                WHERE MODEL_NAME_ID = ${modelNameID} 
                AND HOLE_COUNT_ID = ${holeCountID}
                AND TIP_ID = ${tipID}
                AND SHAPE_ID = ${shapeID}
                AND LENGTH_ID = ${lengthID}
                AND THICKNESS_ID = ${thicknessID}
            `;
        const checkCannula = await queryDB(cannulaSql);

        if (checkCannula?.length === 0) {
            // 🔹 새로운 CANNULA 추가
            const insertQuery = branchName
                ? `INSERT INTO CNL_CANNULA (MODEL_NAME_ID, HOLE_COUNT_ID, TIP_ID, SHAPE_ID, LENGTH_ID, THICKNESS_ID, ${branchName}, createdAt)
                   VALUES (modelNameID, ${holeCountID}, ${tipID}, ${shapeID}, ${lengthID}, ${thicknessID}, 1, SYSDATETIME()); 
                   SELECT SCOPE_IDENTITY() AS id;`
                : `INSERT INTO CNL_CANNULA (MODEL_NAME_ID, HOLE_COUNT_ID, TIP_ID, SHAPE_ID, LENGTH_ID, THICKNESS_ID, createdAt)
                   VALUES (${modelNameID}, ${holeCountID}, ${tipID}, ${shapeID}, ${lengthID}, ${thicknessID}, SYSDATETIME());
                   SELECT SCOPE_IDENTITY() AS id;`;

            const insertResult = await queryDB(insertQuery);

            cannulaID = insertResult?.[0].id;
        } else {
            cannulaID = checkCannula?.[0]._id;
        }

        // 🔹 CNL_SURGERY에 데이터 추가
        const insertCannulSql = `
                INSERT INTO CNL_SURGERY (CANNULA_ID, PSENTRY, OPDATE, createdAt) 
                VALUES (${cannulaID}, ${psEntry}, ${opDate}, SYSDATETIME())
            `;
        await queryDB(insertCannulSql);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, message: "서버 오류 발생" },
            { status: 500 }
        );
    }
}
