"use client";

import { WeightChartType, WeightsType } from "@/type";
import { useEffect, useRef } from "react";

interface Props {
    weightArr: WeightChartType[];
    isWeights?: WeightsType;
}
const InbodyGraph = ({ weightArr, isWeights }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lineColor = "255, 255, 255";

    const colorForWeight =
        ((isWeights?.BD_WEIGHT ?? 0) - (isWeights?.WC_WEIGHT ?? 0)) * 100 - 100;
    // const color =
    //     colorForWeight > 30
    //         ? "#F05579"
    //         : colorForWeight > 15
    //         ? "#ED6B5B"
    //         : colorForWeight > 6
    //         ? "#F9AC0A"
    //         : colorForWeight > 1
    //         ? "#15CF8F"
    //         : colorForWeight < -15
    //         ? "#B17517"
    //         : colorForWeight < -6
    //         ? "#46B6AE"
    //         : colorForWeight < -1
    //         ? "#15CF8F"
    //         : "#5B87ED";

    const color =
        colorForWeight > 30
            ? "240,85,121"
            : colorForWeight > 15
            ? "237,107,91"
            : colorForWeight > 6
            ? "249,172,10"
            : colorForWeight > 1
            ? "21,207,143"
            : colorForWeight < -15
            ? "249,172,104"
            : colorForWeight < -6
            ? "70,182,174"
            : colorForWeight < -1
            ? "21,207,143"
            : "91,135,237";

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        if (!canvas) return;
        const dpr = 2;

        const width = parent?.offsetWidth ?? 0;
        const height = 176;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.scale(dpr, dpr);

        const margin = { top: 34, right: 24, bottom: 31, left: 24 };
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        const weights = weightArr?.slice(-2)?.map((v) => v.weight);

        const max = weightArr ? Math.max(...weights) : 0;
        const min = weightArr ? Math.min(...weights) : 0;

        const points = weights?.map((w, i) => {
            const count = weights.length;
            const x =
                count === 1
                    ? margin.left + plotWidth / 2
                    : margin.left + (i / (count - 1)) * plotWidth;

            const y =
                max === min
                    ? margin.top + plotHeight / 2
                    : margin.top + ((max - w) / (max - min)) * plotHeight;

            return { x, y };
        });

        ctx.lineWidth = 5;
        ctx.strokeStyle = makeGradient(ctx, lineColor, points);
        drawSmooth(ctx, points);
        drawAllMarks(ctx, weights, points, color);
    }, [weightArr]);

    return (
        <div className="relative w-full h-full">
            <canvas ref={canvasRef} className="absolute w-full h-full" />
        </div>
    );
};

export default InbodyGraph;

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
    point: { x: number; y: number } | undefined,
    color: string,
    index: number,
    total: number
) => {
    if (!point) return;

    const num = weight.toFixed(1);
    const unit = "kg";
    const y = point.y - 17;

    const canvasWidth = ctx.canvas.width;
    const fontSize = Math.min(12, 10 + (point.x / canvasWidth) * 6);

    let totalRadius = 0;
    let lineWidth = 0;

    if (total === 1 || index === total - 1) {
        totalRadius = 10;
        lineWidth = 4;
    } else if (index === 0) {
        totalRadius = 6;
        lineWidth = 2;
    } else {
        const ratio = index / (total - 1);
        totalRadius = 6 + (10 - 6) * ratio;
        lineWidth = 2 + (4 - 2) * ratio;
    }

    const strokeRadius = totalRadius - lineWidth / 2;
    const fillRadius = strokeRadius - lineWidth / 2;

    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    ctx.save();
    ctx.font = `bold ${fontSize}px Noto Sans KR`;
    ctx.fillStyle = "white";
    ctx.fillText(num, point.x - 4, y);
    ctx.restore();

    ctx.save();
    ctx.font = "bold 10px Noto Sans KR";
    ctx.fillStyle = "white";
    const numWidth = ctx.measureText(num).width;
    ctx.fillText(unit, point.x + numWidth / 2 + 6, y);
    ctx.restore();

    if (total === 1 || index === total - 1) {
        ctx.save();
        ctx.shadowColor = "rgba(91, 135, 237)";
        ctx.shadowBlur = 22;
    }

    // 외곽 선 (테두리)
    ctx.beginPath();
    ctx.arc(point.x, point.y, strokeRadius, 0, Math.PI * 2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(point.x, point.y, fillRadius, 0, Math.PI * 2);
    if (index === 0) {
        if (total === 1) {
            ctx.fillStyle = "#5B87ED";
        } else {
            ctx.fillStyle = "#F9AC68";
        }
    } else {
        ctx.fillStyle = "#5B87ED";
    }
    ctx.fill();
    ctx.restore();
};

const drawAllMarks = (
    ctx: CanvasRenderingContext2D,
    weights: number[],
    points: { x: number; y: number }[],
    color: string
) => {
    points?.map((v, i) =>
        drawMark(ctx, weights?.[i], v, color, i, weights?.length)
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
