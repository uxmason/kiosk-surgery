/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { userID, psEntry, deviceID, opCode } = Object.fromEntries(
            url.searchParams.entries()
        );
        const checkSql = `SELECT * FROM tsfmc_mailsystem.dbo.KIOSK_SURGERY S, tsfmc_mailsystem.dbo.KIOSK_DEVICES D
                        WHERE S.DEVICE_ID = D._id AND USER_ID = '${userID}' 
                            AND S.PSENTRY = '${psEntry}' AND S.OPCODE = '${opCode}';`;
        const checkResult = await queryDB(checkSql);
        if (checkResult?.length === 0) {
            return NextResponse.json({
                success: true,
            });
        } else {
            const sql = `SELECT S._id, S.STATUS, S.createdAt, S.updatedAt, D.DEVICE_HASH FROM tsfmc_mailsystem.dbo.KIOSK_SURGERY S, tsfmc_mailsystem.dbo.KIOSK_DEVICES D
                        WHERE S.DEVICE_ID = D._id
                            AND USER_ID = '${userID}' AND S.PSENTRY = '${psEntry}' 
                            AND S.OPCODE = '${opCode}';`;
            const results = await queryDB(sql);
            if (results.length > 0) {
                if (results?.[0]?.DEVICE_HASH === deviceID) {
                    return NextResponse.json({
                        success: true,
                        status: results[0].STATUS,
                        createdAt: results[0].createdAt,
                        updatedAt: results[0].updatedAt,
                    });
                } else {
                    if (results?.[0]?.STATUS === 0) {
                        return NextResponse.json({
                            success: true,
                            message:
                                "이미 다른 기기에서 등록되었던 수술입니다.",
                            status: results[0].STATUS,
                            createdAt: results[0].createdAt,
                            updatedAt: results[0].updatedAt,
                        });
                    } else {
                        return NextResponse.json({
                            success: false,
                            message: "다른 기기에서 수술을 등록했습니다.",
                        });
                    }
                }
            } else {
                return NextResponse.json({
                    success: false,
                    message: "다른 기기에서 수술을 등록했습니다.",
                });
            }
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "해당 수술의 상태값을 받아오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
