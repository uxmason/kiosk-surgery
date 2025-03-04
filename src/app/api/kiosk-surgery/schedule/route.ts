/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";
import { getFormattedDate } from "@/function";
export async function GET() {
    try {
        const today = getFormattedDate();
        const sql = `SELECT
                    A.STARTBRAN AS 지점코드,
                    H.HOS_NAME AS 지점명,
                    A.PROMTIME AS 시작시간, 
                    A.OPETIME AS 종료시간, 
                    A.PSENTRY AS 고객번호, 
                    A.PACKAGE AS 수술코드,
                    A.PROMDOCTOR AS 담당의ID,
                    (SELECT TOP 1 USER_NAME
                    FROM tsfmc_mailsystem.dbo.MAIL_ADMIN 
                    WHERE USER_ID = A.PROMDOCTOR ) AS 담당의명, 
                    (SELECT TOP 1 BAS_IDEN 
                    FROM tsfmc_data.dbo.BAS010T 
                    WHERE BAS_CODE = '600' AND BAS_SETCODE = A.BUWI) AS 수술부위,
                    A.OPYTIME AS 예상시간,
                    B.PSNAME AS 고객명,
                    B.LICENCE AS 주민번호, 
                    (SELECT TOP 1 OPTIME 
                    FROM tsfmc_data.dbo.BAS091T 
                    WHERE STARTBRAN = A.STARTBRAN 
                    AND OPDOCTOR = A.PROMDOCTOR 
                    AND PACKAGE = A.PACKAGE) AS 추가시간,
                    K.STATUS AS STATUS
                FROM tsfmc_data.dbo.ADM090T A 
                LEFT OUTER JOIN tsfmc_data.dbo.PEO010T P 
                    ON P.PSENTRY = A.PSENTRY 
                AND P.CONCNT = A.CONCNT
                LEFT OUTER JOIN tsfmc_data.dbo.ADM010T B 
                    ON B.PSENTRY = A.PSENTRY
                LEFT OUTER JOIN tsfmc_mailsystem.dbo.KIOSK_SURGERY K
                    ON K.PSENTRY  = A.PSENTRY 
                    AND K.OPDATE  = A.PROMDATE
                    AND K.OPCODE  = A.PACKAGE
                LEFT OUTER JOIN tsfmc_data.dbo.HOS000T H
                    ON H.HOS_CODE = A.STARTBRAN
                WHERE A.PROMDATE = '${today}' 
                    AND A.PROMSTATE = '001'
                    -- AND A.PROMTIME > '$currentTime'
                ORDER BY A.PROMTIME`;
        const results: any[] = await queryDB(sql);
        const nested: {
            branch: string;
            branchId: string;
            doctor: {
                doctorId: string;
                surgeries: any[];
            }[];
        }[] = [];
        results.forEach((record) => {
            const branchName = record.지점명;
            const branch = record.지점코드;
            const doctorId = record.담당의ID;
            let branchObj = nested.find((b) => b.branch === branchName);
            if (!branchObj) {
                branchObj = {
                    branch: branchName,
                    branchId: branch,
                    doctor: [],
                };
                nested.push(branchObj);
            }
            let doctorObj = branchObj.doctor.find(
                (d) => d.doctorId === doctorId
            );
            if (!doctorObj) {
                doctorObj = { doctorId, surgeries: [] };
                branchObj.doctor.push(doctorObj);
            }
            doctorObj.surgeries.push(record);
        });
        return NextResponse.json({ success: true, list: nested });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "병원 수술 스케쥴을 가져오지 못했습니다.",
            },
            { status: 500 }
        );
    }
}
