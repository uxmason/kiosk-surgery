/* eslint-disable @typescript-eslint/no-explicit-any */
import queryDB from "../../../../../../lib/db";
export async function GET() {
    try {
        const sql = `SELECT _id, POINT_NAME, AJAX_ID
                    FROM tsfmc_mailsystem.dbo.ICS_INCISION 
                    ORDER BY AJAX_ID
                    `;
        const results: any[] = await queryDB(sql);
        return new Response(JSON.stringify({ success: true, list: results }));
    } catch {
        return new Response(
            JSON.stringify({
                success: false,
                message: "인시젼 정보를 가져오지 못했습니다.",
            }),
            { status: 500 }
        );
    }
}
