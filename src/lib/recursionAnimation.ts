import { drawRect, drawTypingText } from "@/lib/animations";

export const renderRecursion = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderRecursion called with progress:", progress);
  
  const levels = 5;
  const boxW = 100;
  const boxH = 40;
  const startX = width / 2 - boxW / 2;
  const startY = 60;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "Recursion: A function that calls itself";
    const p = progress / 0.3;
    const visible = Math.min(levels, Math.floor(p * levels) + 1);
    for (let i = 0; i < visible; i++) {
      const offset = i * 15;
      drawRect(ctx, startX + offset, startY + i * (boxH + 10), boxW, boxH, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(`f(${levels - i})`, startX + offset + 30, startY + i * (boxH + 10) + 25);
    }
  } else if (progress < 0.7) {
    subtitle = "Base case stops the recursion";
    for (let i = 0; i < levels; i++) {
      const offset = i * 15;
      const color = i === levels - 1 ? "#fbbf24" : "#3b82f6";
      drawRect(ctx, startX + offset, startY + i * (boxH + 10), boxW, boxH, color);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(`f(${levels - i})`, startX + offset + 30, startY + i * (boxH + 10) + 25);
    }
  } else {
    subtitle = "Stack unwinds and returns values back up!";
    for (let i = 0; i < levels; i++) {
      const offset = i * 15;
      drawRect(ctx, startX + offset, startY + i * (boxH + 10), boxW, boxH, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(`f(${levels - i})`, startX + offset + 30, startY + i * (boxH + 10) + 25);
    }
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
