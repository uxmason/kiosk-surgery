import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: Request) {
    const {
        modelNameID,
        holeCountID,
        tipID,
        shapeID,
        lengthID,
        thicknessID,
        doctorId,
    } = await req.json();

    try {
        const existSql = `
            SELECT TOP 1 * 
            FROM CNL_CANNULA
            WHERE MODEL_NAME_ID = ${modelNameID}
            AND HOLE_COUNT_ID = ${holeCountID}
            AND TIP_ID = ${tipID}
            AND SHAPE_ID = ${shapeID}
            AND LENGTH_ID = ${lengthID}
            AND THICKNESS_ID = ${thicknessID}
        `;
        const result0 = await queryDB(existSql);

        if (result0?.length > 0) {
            const cannulaID = result0?.[0]._id;
            const checkCdtmSql = `SELECT * FROM CNL_DOCTOR_TOOL_MAP WHERE CANNULA_id = ${cannulaID} AND DOCTOR_ID = '${doctorId}'`;

            const resultCheckCdtm = await queryDB(checkCdtmSql);
            if (resultCheckCdtm?.length > 0) {
                return NextResponse.json({
                    success: true,
                    cannulaID: cannulaID,
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message:
                        "캐뉼라는 존재하나 해당 원장님의 캐뉼라로 등록되어있지 않습니다.",
                });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "캐뉼라 존재 여부를 확인하지 못했습니다.",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "캐뉼라 존재 여부를 확인하지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
