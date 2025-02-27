/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhotsArrType } from "@/type";
import queryDB from "../../../../../lib/db";
const confidence1 = 0.7;

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const { psEntry } = Object.fromEntries(url.searchParams.entries());
        const sqlArrPhoto = `SELECT *
            FROM IMAGE_SECTION_INFO 
            WHERE confidence1 >= ${confidence1}
                AND surgeryID = ${psEntry} 
            ORDER BY op_data ASC, top1`;

        const resultsArrPhoto: any[] = await queryDB(sqlArrPhoto);
        const finalPhoto: PhotsArrType[] = [];

        resultsArrPhoto.forEach((photo) => {
            const opData = String(photo?.["op_data"]);
            const selectedRegDate = `${opData.slice(0, 4)}-${opData.slice(
                4,
                6
            )}-${opData.slice(6, 8)}`;

            let existingEntry = finalPhoto.find(
                (entry) => entry.regdate === selectedRegDate
            );

            if (!existingEntry) {
                existingEntry = { regdate: selectedRegDate, image: [] };
                finalPhoto.push(existingEntry);
            }

            existingEntry.image.push({
                idx: photo["index"],
                filename: photo["PATH"],
            });
        });

        return new Response(
            JSON.stringify({ success: true, list: finalPhoto })
        );
    } catch {
        return new Response(
            JSON.stringify({
                success: false,
                message: "사진을 불러오는데 실패했습니다.",
            }),
            { status: 500 }
        );
    }
}
