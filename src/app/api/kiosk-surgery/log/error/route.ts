import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function POST(req: Request) {
    try {
        const { deviceID, userID, message } = await req.json();
        const insertSql = `INSERT INTO LOG_KIOSK_ERROR (DEVICE_HASH, USER_ID, MESSAGE, createdAt) 
                            VALUES (${deviceID}, '${userID}', '${message}', SYSDATETIME())
                            SELECT SCOPE_IDENTITY() AS _id;`;
        const result = await queryDB(insertSql);

        // _id 값을 받아옵니다
        const insertedId = result[0]._id;

        return NextResponse.json({ success: true, ERROR_ID: insertedId });
    } catch {
        return NextResponse.json(
            { success: false, message: "에러메세지를 등록할 수 없습니다." },
            { status: 500 }
        );
    }
}
