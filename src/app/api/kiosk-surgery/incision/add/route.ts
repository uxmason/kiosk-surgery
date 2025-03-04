import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: Request) {
    try {
        const { incisionID, psEntry, opDate } = await req.json();
        const insertSql = `INSERT INTO ICS_SURGERY (INCISION_ID, PSENTRY, OPDATE, createdAt) 
                            VALUES (${incisionID}, '${psEntry}', '${opDate}', SYSDATETIME())
                            SELECT SCOPE_IDENTITY() AS _id;`;
        const result = await queryDB(insertSql);

        // _id 값을 받아옵니다
        const insertedId = result[0]._id;

        return NextResponse.json({ success: true, SURGERY_ID: insertedId });
    } catch {
        return NextResponse.json(
            { success: false, message: "인시젼 정보를 등록할 수 없습니다." },
            { status: 500 }
        );
    }
}
