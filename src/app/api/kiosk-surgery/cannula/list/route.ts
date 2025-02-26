/* eslint-disable @typescript-eslint/no-explicit-any */
import queryDB from "../../../../../../lib/db";
export async function GET() {
    try {
        const sql = `SELECT 갯수, C._id CANNULA_ID, MODEL_NAME, HOLE_COUNT, TIP, SHAPE, LENGTH, THICKNESS
                    FROM tsfmc_mailsystem.dbo.CNL_CANNULA C
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
                    ORDER BY 갯수 DESC
                    `;
        const results: any[] = await queryDB(sql);
        return new Response(JSON.stringify({ success: true, list: results }));
    } catch {
        return new Response(
            JSON.stringify({
                success: false,
                message: "캐뉼라 리스트를 가져오지 못했습니다.",
            }),
            { status: 500 }
        );
    }
}
