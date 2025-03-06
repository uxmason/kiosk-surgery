import { NextResponse } from "next/server";
import queryDB from "../../../../../../lib/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { psEntry, age, sex } = Object.fromEntries(
            url.searchParams.entries()
        );
        // 날짜 계산
        const today = new Date();
        today.setHours(today.getHours() + 9);
        today.setDate(today.getDate() - 1);
        const fromDate = `${today.getFullYear() - 2}${String(
            today.getMonth() + 1
        ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        // 사용자 체중 및 키 조회
        const userQuery = `
                            SELECT TOP 1 MU_HEIGHT, MU_WEIGHT 
                            FROM tsfmc_data.dbo.ADM700T 
                            WHERE PSENTRY = '${psEntry}' 
                            ORDER BY INDATE DESC
                            `;

        const userResult = await queryDB(userQuery);
        if (userResult?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "사용자 데이터를 찾을 수 없습니다.",
            });
        }

        const { MU_HEIGHT: height, MU_WEIGHT: weight } = userResult?.[0];
        // 평균 지방량 조회
        const query2 = `SELECT 
                            메인부위명, 
                            MAX(평균예측지방량) AS 평균예측지방량최대치, 
                            AVG(평균예측지방량) AS 평균예측지방량평균치, 
                            MIN(평균예측지방량) AS 평균예측지방량최소치,
                            MIN(최대예측지방량) AS 최대예측지방량최소치, 
                            AVG(최대예측지방량) AS 최대예측지방량평균치, 
                            MAX(최대예측지방량) AS 최대예측지방량최대치 
                        FROM 
                            (
                                SELECT 
                                    OL.수술의ID, 
                                    OL.메인부위명, 
                                    ROUND(MIN(메인지방량), 0) AS 최소예측지방량, 
                                    ROUND(AVG(메인지방량), 0) AS 평균예측지방량, 
                                    ROUND(MAX(메인지방량), 0) AS 최대예측지방량, 
                                    COUNT(*) AS 수술횟수 
                                FROM 
                                    (
                                        SELECT * 
                                        FROM tsfmc_mailsystem.dbo.MAIL_OPE_LIST 
                                        WHERE 메인부위명 IN (N'팔', N'복부', N'허벅지')
                                    ) OL
                                    JOIN 
                                    (
                                        SELECT 
                                            WT1.PSENTRY, 
                                            WT1.MU_WEIGHT, 
                                            WT1.MU_HEIGHT 
                                        FROM 
                                            tsfmc_data.dbo.ADM700T WT1 
                                        JOIN 
                                            (
                                                SELECT 
                                                    PSENTRY, 
                                                    MAX(INDATE) AS MAX_DATE 
                                                FROM 
                                                    tsfmc_data.dbo.ADM700T 
                                                GROUP BY 
                                                    PSENTRY
                                            ) WT2 
                                            ON WT1.PSENTRY = WT2.PSENTRY 
                                            AND WT1.INDATE = WT2.MAX_DATE
                                    ) WT 
                                    ON WT.PSENTRY = OL.고객번호 
                                    JOIN 
                                    (
                                        SELECT 
                                            수술의ID 
                                        FROM 
                                            tsfmc_mailsystem.dbo.MAIL_OPE_LIST 
                                        WHERE 
                                            지점명 IN (N'서울', N'인천', N'대전', N'대구', N'부산') 
                                            AND 수술일자 > '${fromDate}'
                                        GROUP BY 
                                            수술의ID
                                    ) MOL 
                                    ON OL.수술의ID = MOL.수술의ID 
                                WHERE 
                                    OL.수술일자 >= '${fromDate}' 
                                    AND OL.SEX = '${sex}' 
                                    AND OL.AGE BETWEEN ${age} - 5 AND ${age} + 5 
                                    AND MU_WEIGHT BETWEEN ${weight} - 15 AND ${weight} + 15 
                                    AND MU_HEIGHT BETWEEN ${height} - 5 AND ${height} + 5 
                                GROUP BY 
                                    OL.수술의ID, OL.메인부위명
                            ) OK 
                        GROUP BY 
                            메인부위명
                        `;
        const result2 = await queryDB(query2);
        // 지방량 상세 리스트 조회
        const query3 = `
                        SELECT 
                            OL.메인부위명, 
                            COUNT(*) AS 데이터갯수, 
                            ROUND(MIN(메인지방량), 0) AS 최소예측지방량, 
                            ROUND(AVG(메인지방량), 0) AS 평균예측지방량, 
                            ROUND(MAX(메인지방량), 0) AS 최대예측지방량 
                        FROM 
                            (
                                SELECT * 
                                FROM tsfmc_mailsystem.dbo.MAIL_OPE_LIST 
                                WHERE 메인부위명 IN (N'팔', N'복부', N'허벅지')
                            ) OL
                            JOIN 
                            (
                                SELECT 
                                    WT1.PSENTRY, 
                                    WT1.MU_WEIGHT, 
                                    WT1.MU_HEIGHT 
                                FROM 
                                    tsfmc_data.dbo.ADM700T WT1 
                                JOIN 
                                    (
                                        SELECT 
                                            PSENTRY, 
                                            MAX(INDATE) AS MAX_DATE 
                                        FROM 
                                            tsfmc_data.dbo.ADM700T 
                                        GROUP BY 
                                            PSENTRY
                                    ) WT2 
                                    ON WT1.PSENTRY = WT2.PSENTRY 
                                    AND WT1.INDATE = WT2.MAX_DATE
                            ) WT
                            ON WT.PSENTRY = OL.고객번호 
                        WHERE 
                            지점명 IN (N'서울', N'인천', N'대전', N'대구', N'부산') 
                            AND 메인부위명 IN (N'팔', N'복부', N'허벅지') 
                            AND OL.수술일자 >= '${fromDate}' 
                            AND SEX = '${sex}' 
                            AND AGE BETWEEN ${age} - 5 AND ${age} + 5 
                            AND MU_WEIGHT BETWEEN ${weight} - 15 AND ${weight} + 15 
                            AND MU_HEIGHT BETWEEN ${height} - 5 AND ${height} + 5 
                        GROUP BY OL.메인부위명
                        `;
        const result3 = await queryDB(query3);

        return NextResponse.json({
            success: true,
            weight,
            height,
            limitFatPart: result2,
            fatList: result3,
        });
    } catch (error) {
        console.error("API 오류:", error);
        return NextResponse.json(
            { success: false, message: "서버 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
