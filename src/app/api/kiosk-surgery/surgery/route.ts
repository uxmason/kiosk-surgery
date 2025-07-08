/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";
import { getCurrentTimeHHMM, getFormattedDate } from "@/function";
import { OpeClientType } from "@/type";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { doctorId, psEntry, deviceId } = Object.fromEntries(
            url.searchParams.entries()
        );
        const today = getFormattedDate();
        const nowTime = getCurrentTimeHHMM();
        const addDeviceIdWhere =
            typeof deviceId === "string"
                ? `AND (D.DEVICE_HASH IS NULL OR D.DEVICE_HASH = '${deviceId}')`
                : "";
        const addWhere =
            typeof psEntry === "string" ? `AND A.PSENTRY='${psEntry}'` : ``;
        const sql = `SELECT top 1
                    A.STARTBRAN AS 지점,
                    A.PROMDATE  AS 수술일,
                    A.PROMTIME AS 시작시간, 
                    A.OPETIME AS 종료시간,  
                    A.OPYTIME AS 예상시간,
                    A.CONCNT AS 기수,
                    A.PSENTRY AS 고객번호, 
                    A.PACKAGE AS 수술코드,
                    A.DONG AS 병실,
                    A.PROMDOCTOR AS 담당의ID,
                    (SELECT TOP 1 USER_NAME
                    FROM tsfmc_mailsystem.dbo.MAIL_ADMIN 
                    WHERE USER_ID = A.PROMDOCTOR ) AS 담당의명, 
                    (SELECT TOP 1 BAS_IDEN 
                    FROM tsfmc_data.dbo.BAS010T 
                    WHERE BAS_CODE = '600' AND BAS_SETCODE = A.BUWI) AS 수술부위,
                    (SELECT TOP 1 MA_KNAME 
                    FROM tsfmc_data.dbo.BAS020T 
                    WHERE MA_CODE = A.PACKAGE) AS 수술명,
                    B.PSNAME AS 고객명,
                    B.LICENCE AS 주민번호, 
                    (SELECT TOP 1 OPTIME 
                    FROM tsfmc_data.dbo.BAS091T 
                    WHERE STARTBRAN = A.STARTBRAN 
                    AND OPDOCTOR = A.PROMDOCTOR 
                    AND PACKAGE = A.PACKAGE) AS 추가시간,
                    K.STATUS AS state,
                    A.Trans AS 통역여부, 
                    (SELECT TOP 1 BAS_SUBIDEN 
                    FROM tsfmc_data.dbo.BAS010T 
                    WHERE BAS_CODE='282' 
                    AND BAS_SETCODE = A.GUBUNCODE) AS 참관구분,
                    A.FATTRAN AS 이식용지방,
                    A.FASTREMAND AS 우선순위여부,
                    P.HEIGHT AS HEIGHT
                FROM tsfmc_data.dbo.ADM090T A 
                LEFT OUTER JOIN tsfmc_data.dbo.PEO010T P 
                    ON P.PSENTRY = A.PSENTRY 
                AND P.CONCNT = A.CONCNT
                LEFT OUTER JOIN tsfmc_data.dbo.ADM010T B 
                    ON B.PSENTRY = A.PSENTRY
                LEFT OUTER JOIN tsfmc_mailsystem.dbo.KIOSK_SURGERY K
                    ON K.PSENTRY  = A.PSENTRY 
                    AND K.OPDATE  = A.PROMDATE
                    AND A.PACKAGE = K.OPCODE 
                LEFT OUTER JOIN tsfmc_mailsystem.dbo.KIOSK_DEVICES D
                    ON K.DEVICE_ID = D.[_id]
                WHERE A.PROMDOCTOR = '${doctorId}'
                    AND A.PROMSTATE = '001'
                    AND ((A.PROMDATE = '${today}' AND A.PROMTIME <= '${nowTime}' AND A.OPETIME >= '${nowTime}') OR A.PROMDATE > '${today}')
                    ${addWhere} ${addDeviceIdWhere}
                ORDER BY A.PROMDATE, A.PROMTIME`;
        const results: OpeClientType[] = await queryDB(sql);
        if (results?.length !== 0) {
            return NextResponse.json({
                success: true,
                list: results,
            });
        } else {
            if (addWhere) {
                return NextResponse.json({
                    success: false,
                    message: "해당 고객의 수술 일정을 가져오지 못했습니다.",
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "의사 선생님의 수술 일정을 가져오지 못했습니다.",
                });
            }
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "의사 선생님의 수술 일정을 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
