/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFormattedDate } from "@/function";
import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";
export async function GET(req: Request) {
    const url = new URL(req.url);
    const { doctorId, psEntry } = Object.fromEntries(
        url.searchParams.entries()
    );
    const opDate = getFormattedDate();

    try {
        const query1 = `SELECT 갯수, C._id CANNULA_ID, MODEL_NAME, HOLE_COUNT, TIP, SHAPE, LENGTH, THICKNESS, 서울, 인천, 대전, 대구, 부산,
                            CASE WHEN EXISTS (
                            SELECT 1 FROM tsfmc_mailsystem.dbo.CNL_SURGERY CS
                            WHERE CS.CANNULA_ID = C._id AND CS.PSENTRY = '${psEntry}' AND CS.OPDATE = '${opDate}' 
                            ) THEN 1
                            ELSE 0 END 
                            AS SELECTED,
                            CDMT._id AS cdmt_id
                        FROM tsfmc_mailsystem.dbo.CNL_CANNULA C
                        JOIN tsfmc_mailsystem.dbo.CNL_DOCTOR_TOOL_MAP CDMT  ON CDMT.DOCTOR_ID = '${doctorId}' AND CDMT.CANNULA_id  = C._id
                        LEFT JOIN (
                                SELECT DISTINCT COUNT(*) 갯수, 0 as SELECTED, CANNULA_ID
                                FROM tsfmc_mailsystem.dbo.CNL_SURGERY
                                GROUP BY CANNULA_ID
                        ) CS ON C._id = CS.CANNULA_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_MODEL_NAME SMN ON SMN._id = C.MODEL_NAME_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_HOLE_COUNT SHC ON SHC._id = C.HOLE_COUNT_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_TIP ST ON ST._id = C.TIP_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_SHAPE SS ON SS._id = C.SHAPE_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_LENGTH SL ON SL._id = C.LENGTH_ID
                        LEFT JOIN tsfmc_mailsystem.dbo.CNL_SPEC_THICKNESS STN ON STN._id = C.THICKNESS_ID
                        ORDER BY 갯수 DESC;
                        `;

        const res1 = await queryDB(query1);
        return NextResponse.json({
            success: true,
            list: res1,
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "캐뉼라 정보를 불러오지 못했습니다.",
        });
    }
}
