import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function GET() {
    try {
        const modelNamesSql = `SELECT _id, MODEL_NAME FROM CNL_SPEC_MODEL_NAME ORDER BY MODEL_NAME`;
        const holeCountsSql = `SELECT _id, HOLE_COUNT FROM CNL_SPEC_HOLE_COUNT ORDER BY HOLE_COUNT`;
        const tipsSql = `SELECT _id, TIP FROM CNL_SPEC_TIP ORDER BY TIP`;
        const shapesSql = `SELECT _id, SHAPE FROM CNL_SPEC_SHAPE ORDER BY SHAPE`;
        const lengthsSql = `SELECT _id, [LENGTH] FROM CNL_SPEC_LENGTH ORDER BY LENGTH`;
        const thicknesesSql = `SELECT _id, THICKNESS FROM CNL_SPEC_THICKNESS ORDER BY THICKNESS`;

        const modelNames = await queryDB(modelNamesSql);
        const holeCounts = await queryDB(holeCountsSql);
        const tips = await queryDB(tipsSql);
        const shapes = await queryDB(shapesSql);
        const lengths = await queryDB(lengthsSql);
        const thicknesses = await queryDB(thicknesesSql);

        return NextResponse.json({
            success: true,
            modelNames: modelNames,
            holeCounts: holeCounts,
            tips: tips,
            shapes: shapes,
            length: lengths,
            thickness: thicknesses,
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "캐뉼라 스펙 정보를 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
