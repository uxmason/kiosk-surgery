import { NextResponse } from "next/server";
import queryDB from "../../../../../lib/db";

// API 핸들러
export async function GET(req: Request) {
    try {
        // 요청에서 파라미터 가져오기
        const { searchParams } = new URL(req.url);
        const doctorID = searchParams.get("doctorID");
        const psEntry = searchParams.get("psEntry");
        const age = Number(searchParams.get("age"));
        const sex = searchParams.get("sex");

        // 날짜 계산
        const today = new Date();
        today.setDate(today.getDate() - 1);
        const fromDate = `${today.getFullYear() - 2}${String(
            today.getMonth() + 1
        ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

        // 사용자 체중 및 키 조회
        const userQuery = `
                            SELECT TOP 1 MU_HEIGHT, MU_WEIGHT 
                            FROM tsfmc_data.dbo.ADM700T 
                            WHERE PSENTRY = ${psEntry} 
                            ORDER BY INDATE DESC
                            `;

        const userResult = await queryDB(userQuery);

        if (!userResult.recordset.length) {
            return NextResponse.json({
                success: false,
                message: "사용자 데이터를 찾을 수 없습니다.",
            });
        }

        const { MU_HEIGHT: height, MU_WEIGHT: weight } =
            userResult.recordset[0];

        // 평균 지방량 조회
        const query2 = `
                        SELECT 메인부위명, 
                                MAX(평균예측지방량) AS 평균예측지방량최대치,
                                AVG(평균예측지방량) AS 평균예측지방량평균치,
                                MIN(평균예측지방량) AS 평균예측지방량최소치
                        FROM tsfmc_mailsystem.dbo.MAIL_OPE_LIST
                        WHERE 수술일자 >= ${fromDate}
                        AND SEX = ${sex}
                        AND AGE BETWEEN ${age} - 5 AND ${age} + 5
                        AND MU_WEIGHT BETWEEN ${weight} - 15 AND ${weight} + 15
                        AND MU_HEIGHT BETWEEN ${height} - 5 AND ${height} + 5
                        GROUP BY 메인부위명
                        `;

        const result2 = await queryDB(query2);

        // 지방량 상세 리스트 조회
        const query3 = `
                        SELECT 지점명, 수술의ID, 수술의, 메인부위명,
                                COUNT(*) AS 데이터갯수,
                                ROUND(MIN(메인지방량), 0) AS 최소예측지방량,
                                ROUND(AVG(메인지방량), 0) AS 평균예측지방량,
                                ROUND(MAX(메인지방량), 0) AS 최대예측지방량
                        FROM tsfmc_mailsystem.dbo.MAIL_OPE_LIST
                        WHERE 수술일자 >= ${fromDate}
                        AND 수술의ID = ${doctorID}
                        AND SEX = ${sex}
                        AND AGE BETWEEN ${age} - 5 AND ${age} + 5
                        AND MU_WEIGHT BETWEEN ${weight} - 15 AND ${weight} + 15
                        AND MU_HEIGHT BETWEEN ${height} - 5 AND ${height} + 5
                        GROUP BY 지점명, 수술의ID, 수술의, 메인부위명
                        `;

        const result3 = await queryDB(query3);

        return NextResponse.json({
            success: true,
            weight,
            height,
            limitFatPart: result2.recordset,
            fatList: result3.recordset,
        });
    } catch (error) {
        console.error("API 오류:", error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
