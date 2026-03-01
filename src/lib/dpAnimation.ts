import { drawRect, drawTypingText } from "@/lib/animations";

export const renderDP = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderDP called with progress:", progress);
  
  const fib = [1, 1, 2, 3, 5, 8];
  const cellSize = 60;
  const startX = (width - fib.length * cellSize) / 2;
  const startY = height / 2 - 30;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "Dynamic Programming: Breaking problems into subproblems";
    const p = progress / 0.3;
    const visible = Math.min(fib.length, Math.floor(p * fib.length) + 1);
    for (let i = 0; i < visible; i++) {
      drawRect(ctx, startX + i * cellSize, startY, cellSize - 5, cellSize - 5, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(fib[i].toString(), startX + i * cellSize + 20, startY + 35);
    }
  } else if (progress < 0.7) {
    subtitle = "Store results to avoid recomputation (memoization)";
    for (let i = 0; i < fib.length; i++) {
      const color = i < 4 ? "#10b981" : "#3b82f6";
      drawRect(ctx, startX + i * cellSize, startY, cellSize - 5, cellSize - 5, color);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(fib[i].toString(), startX + i * cellSize + 20, startY + 35);
    }
  } else {
    subtitle = "Fibonacci sequence computed efficiently with DP!";
    for (let i = 0; i < fib.length; i++) {
      drawRect(ctx, startX + i * cellSize, startY, cellSize - 5, cellSize - 5, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(fib[i].toString(), startX + i * cellSize + 20, startY + 35);
    }
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
