import { WeightChartType } from "@/type";
import React, { useRef, useEffect } from "react";

interface Props {
    weightArr: WeightChartType[];
}

const WeightChart: React.FC<Props> = ({ weightArr }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const textCanvas = textCanvasRef.current;
        if (!canvas || !textCanvas) return;
        const dpr = 2;

        const width = parent?.offsetWidth ?? 0;
        const height = 237;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        textCanvas.width = width * dpr;
        textCanvas.height = height * dpr;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        textCanvas.style.width = `${width}px`;
        textCanvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        const textCtx = textCanvas.getContext("2d");
        if (!ctx || !textCtx) return;

        ctx.scale(dpr, dpr);
        textCtx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);
        textCtx.clearRect(0, 0, width, height);

        const margin = { top: 32, right: 29, bottom: 74, left: 22 };
        const textMargin = { top: 20, right: 0, bottom: 9, left: 0 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - textMargin.top - margin.bottom;
        const n = weightArr?.length;
        const gap = plotWidth / n;
        const weights = weightArr?.map((v) => v.weight);
        const labels = weightArr?.map((a) => a.date);

        const max = weightArr ? Math.max(...weights) : 0;
        const min = weightArr ? Math.min(...weights) : 0;

        const points = weights?.map((w, i) => {
            const x = margin.left + gap * (i + 0.5);
            const y =
                max === min
                    ? margin.top + plotHeight / 2
                    : margin.top + ((max - w) / (max - min)) * plotHeight;

            return { x, y };
        });

        ctx.strokeStyle = makeGradient(ctx, "249, 172, 104");
        ctx.lineWidth = 4;
        drawSmooth(ctx, points);
        drawAllMarks(ctx, weights, points);
        drawAxesText(
            textCtx,
            labels,
            textMargin,
            { left: margin.left },
            plotWidth,
            plotHeight,
            n
        );
    }, [weightArr]);

    return (
        <div className="relative w-full h-[237px] top-[16px]">
            <canvas ref={canvasRef} className="absolute w-full h-full" />
            <canvas ref={textCanvasRef} className="absolute w-full h-full" />
        </div>
    );
};

export default WeightChart;

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

        // const x = plotMargin.left + (plotWidth * i) / (n - 1);

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
    weight: number,
    point: { x: number; y: number } | undefined
) => {
    if (!point) return;

    const num = weight.toFixed(1);
    const unit = "kg";
    const y = point.y - 17;

    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    ctx.save();
    ctx.font = "bold 16px Noto Sans KR";
    ctx.fillStyle = "white";
    ctx.fillText(num, point.x - 4, y);
    ctx.restore();

    ctx.save();
    ctx.font = "bold 10px Noto Sans KR";
    ctx.fillStyle = "white";
    const numWidth = ctx.measureText(num).width;
    ctx.fillText(unit, point.x + numWidth / 2 + 12, y);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = `#F9AC68`;
    ctx.fill();

    ctx.save();
    ctx.shadowColor = "#F9AC68";
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = `white`;
    ctx.stroke();
    ctx.restore();
};

const drawAllMarks = (
    ctx: CanvasRenderingContext2D,
    weights: number[],
    points: { x: number; y: number }[]
) => {
    points?.map((v, i) => drawMark(ctx, weights?.[i], v));
};

const makeGradient = (
    ctx: CanvasRenderingContext2D,
    rgb: string
): CanvasGradient => {
    const grad = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    grad.addColorStop(0, `rgba(${rgb}, 0.1)`);
    grad.addColorStop(0.5, `rgba(${rgb}, 0.5)`);
    grad.addColorStop(1, `rgba(${rgb}, 1)`);
    return grad;
};
