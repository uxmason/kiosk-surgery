import { CaloriesType } from "@/type";
import { useEffect, useRef } from "react";

interface Props {
    isInbodyOpen: boolean;
    isCalories: CaloriesType[];
    wcWeight: number | undefined;
}
const GraphBasalMetabolicRatePercent = ({
    isInbodyOpen,
    isCalories,
    wcWeight,
}: Props) => {
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const textCanvasRef = useRef<HTMLCanvasElement>(null);

    const isCaloriesLength = isCalories?.length;
    const blBaseCalory = isCalories?.[isCaloriesLength - 1]?.blBaseCalory;
    const wcBasic = isCalories?.[isCaloriesLength - 1]?.wcBasic;
    const limitWeight =
        typeof wcWeight === "number" &&
        typeof blBaseCalory === "number" &&
        wcWeight > blBaseCalory
            ? wcBasic
            : blBaseCalory;

    useEffect(() => {
        if (!isInbodyOpen) return;

        const canvas1 = canvasRef1.current;
        const canvas2 = canvasRef2.current;
        const textCanvas = textCanvasRef.current;
        const parent = canvas1?.parentElement;

        if (!canvas1 || !canvas2 || !textCanvas || !parent) return;

        const dpr = 2;
        const width = parent.offsetWidth;
        const height = 223;

        canvas1.width = width * dpr;
        canvas1.height = height * dpr;
        canvas2.width = width * dpr;
        canvas2.height = height * dpr;
        textCanvas.width = width * dpr;
        textCanvas.height = height * dpr;

        canvas1.style.width = `${width}px`;
        canvas1.style.height = `${height}px`;
        canvas2.style.width = `${width}px`;
        canvas2.style.height = `${height}px`;
        textCanvas.style.width = `${width}px`;
        textCanvas.style.height = `${height}px`;

        const ctx = canvas1.getContext("2d");
        const ctx1 = canvas2.getContext("2d");
        const textCtx = textCanvas.getContext("2d");

        if (!ctx || !ctx1 || !textCtx) return;

        ctx.clearRect(0, 0, width, height);
        ctx1.clearRect(0, 0, width, height);
        textCtx.clearRect(0, 0, width, height);

        ctx.scale(dpr, dpr);
        ctx1.scale(dpr, dpr);
        textCtx.scale(dpr, dpr);

        const margin = { top: 36, right: 29, bottom: 165, left: 22 };
        const textMargin = { top: 16, right: 0, bottom: 0, left: 0 };

        const plotWidth = width - margin.left - margin.right;
        const n = isCalories?.length ?? 0;
        const gap = plotWidth / n;

        const blBaseCalories =
            isCalories?.map((v) => Number(v?.blBaseCalory)) ?? [];
        const wcBasics = isCalories?.map((v) => Number(v?.wcBasic)) ?? [];
        const labels = isCalories?.map((a) => a.date) ?? [];

        const blMax = Math.max(...blBaseCalories);
        const blMin = Math.min(...blBaseCalories);
        const wcMax = Math.max(...wcBasics);
        const wcMin = Math.min(...wcBasics);

        const fixedHeight = 24;

        const blPoints = blBaseCalories.map((w, i) => {
            const x = margin.left + gap * (i + 0.5);
            const norm = blMax === blMin ? 0.5 : (w - blMin) / (blMax - blMin);
            const y = margin.top + (1 - norm) * fixedHeight;
            return { x, y };
        });

        const wcPoints = wcBasics.map((w, i) => {
            const x = margin.left + gap * (i + 0.5);
            const norm = wcMax === wcMin ? 0.5 : (w - wcMin) / (wcMax - wcMin);
            const y = height - 71 - fixedHeight + norm * fixedHeight;
            return { x, y };
        });

        // 권장 섭취량
        ctx.lineWidth = 4;
        ctx.strokeStyle = makeGradient(ctx, "225, 225, 225", blPoints);
        drawSmooth(ctx, blPoints);
        drawAllMarks(ctx, blPoints, "#1D1F2D");

        // 기초대사량
        ctx1.lineWidth = 4;
        ctx1.strokeStyle = makeGradient(ctx1, "237, 107, 91", wcPoints);
        drawSmooth(ctx1, wcPoints);
        drawAllMarks(ctx1, wcPoints, "#ED6B5B");

        // 월별 텍스트
        const plotTextHeight = 150;
        drawAxesText(
            textCtx,
            labels,
            textMargin,
            { left: margin.left },
            plotWidth,
            plotTextHeight,
            n
        );
    }, [isInbodyOpen, isCalories]);

    return (
        <div className="flex flex-col w-full h-[400px] bg-[rgba(58,62,89,0.25)] backdrop-blur-[20px] rounded-[15px] pt-[30px]">
            <div className="flex flex-col px-[35px]">
                <p className="text-white text-[24px] font-bold leading-6">
                    권장 섭취량
                </p>
                <div className="flex items-center w-full justify-between pt-[10px]">
                    <div
                        className="max-w-30 h-[15px] bg-[rgba(255,255,255,0.35)] backdrop-blur-[20px] rounded-[5px]"
                        style={{
                            width: `${
                                100 -
                                (((limitWeight ?? 0) - (blBaseCalory ?? 0)) /
                                    (limitWeight ?? 0)) *
                                    100
                            }%`,
                        }}
                    />
                    <div className="flex items-baseline">
                        <p className="text-white text-[20px] font-bold leading-[25px]">
                            {blBaseCalory?.toLocaleString()}
                        </p>
                        <p className="text-white text-[10px] font-normal leading-[25px]">
                            Cal
                        </p>
                    </div>
                </div>
            </div>
            <div className="pt-[21px] px-[35px]">
                <p className="text-white text-[24px] font-bold leading-6">
                    기초 대사량
                </p>
                <div className="flex items-center justify-between pt-[10px]">
                    <div
                        className="max-w-30 h-[15px] bg-[#ED6B5B] backdrop-blur-[20px] rounded-[5px]"
                        style={{
                            width: `${
                                100 -
                                (((limitWeight ?? 0) - (wcBasic ?? 0)) /
                                    (limitWeight ?? 0)) *
                                    100
                            }%`,
                        }}
                    />
                    <div className="flex items-baseline">
                        <p className="text-white text-[20px] font-bold leading-[25px]">
                            {wcBasic?.toLocaleString()}
                        </p>
                        <p className="text-white text-[10px] font-normal leading-[25px]">
                            Cal
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative w-full">
                <canvas ref={canvasRef1} className="absolute w-full h-full" />
                <canvas ref={canvasRef2} className="absolute w-full h-full" />
                <canvas
                    ref={textCanvasRef}
                    className="absolute w-full h-full"
                />
            </div>
        </div>
    );
};
export default GraphBasalMetabolicRatePercent;

const drawAxesText = (
    textCtx: CanvasRenderingContext2D,
    labels: string[],
    textMargin: { top: number; right: number; bottom: number; left: number },
    margin: { left: number },
    plotWidth: number,
    plotHeight: number,
    n: number
) => {
    textCtx.textAlign = "center";
    textCtx.textBaseline = "top";

    const lineY = plotHeight + (textMargin.top + textMargin.bottom) * 2 - 5;

    // 점선
    textCtx.beginPath();
    textCtx.setLineDash([2, 2]);
    textCtx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    textCtx.moveTo(textMargin.left, lineY);
    textCtx.lineTo(plotWidth + 52, lineY);
    textCtx.stroke();
    textCtx.setLineDash([]);

    labels?.forEach((lbl, i) => {
        const gap = plotWidth / n;
        const x = margin.left + gap * (i + 0.5);

        const year = lbl.slice(0, 4);
        const monthDay = `${lbl.slice(4, 6)}-${lbl.slice(6, 8)}`;

        textCtx.font = "bold 11px Noto Sans KR";
        textCtx.fillStyle = "rgba(255, 255, 255, 0.50)";
        textCtx.fillText(
            year,
            x,
            plotHeight + (textMargin.top + textMargin.bottom) * 2 + 3
        );

        textCtx.font = "bold 13px Noto Sans KR";
        textCtx.fillStyle = "white";
        textCtx.fillText(
            monthDay,
            x,
            plotHeight +
                (textMargin.top + textMargin.bottom) * 2 +
                textMargin.top +
                3
        );
    });
};

const drawSmooth = (
    ctx: CanvasRenderingContext2D,
    pts: { x: number; y: number }[]
) => {
    if (pts?.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(pts?.[0]?.x, pts?.[0]?.y);

    if (pts?.length === 1) {
        ctx.arc(pts?.[0]?.x, pts?.[0]?.y, 2, 0, Math.PI * 2);
        ctx.fill();
        return;
    }

    for (let i = 0; i < pts?.length - 1; i++) {
        const p0 = pts?.[i];
        const p1 = pts?.[i + 1];
        const cpX = (p0?.x + p1?.x) / 2;
        ctx.bezierCurveTo(cpX, p0?.y, cpX, p1?.y, p1?.x, p1?.y);
    }
    ctx.stroke();
};

const drawMark = (
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number } | undefined,
    color: string,
    last: boolean
) => {
    if (!point) return;
    if (last) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = `${color}`;
        ctx.fill();

        ctx.save();
        ctx.shadowColor = `${color}`;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = `white`;
        ctx.stroke();
        ctx.restore();
    }
};

const drawAllMarks = (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    color: string
) => {
    const pointsLength = points?.length;
    points?.map((v, i) =>
        drawMark(ctx, v, color, pointsLength - 1 === i ? true : false)
    );
};

const makeGradient = (
    ctx: CanvasRenderingContext2D,
    rgb: string,
    points: { x: number; y: number }[]
): CanvasGradient => {
    const x0 =
        points && Number.isFinite(points?.[0]?.x) ? points?.[0]?.x + 8 : 0;
    const y0 = points && Number.isFinite(points?.[0]?.y) ? points?.[0]?.y : 0;
    const x1 =
        points && Number.isFinite(points?.[points?.length - 1]?.x)
            ? points?.[points?.length - 1]?.x
            : 0;
    const y1 =
        points && Number.isFinite(points?.[points?.length - 1]?.y)
            ? points?.[points?.length - 1]?.y
            : 0;
    const grad = ctx?.createLinearGradient(x0, y0, x1, y1);

    grad.addColorStop(0, `rgba(${rgb}, 0.01)`);
    grad.addColorStop(0.5, `rgba(${rgb}, 0.5)`);
    grad.addColorStop(1, `rgba(${rgb}, 1)`);
    return grad;
};
