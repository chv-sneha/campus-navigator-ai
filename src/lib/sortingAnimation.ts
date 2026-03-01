import { easeInOutCubic, easeOutBounce, lerp, drawTypingText, drawRect } from "@/lib/animations";

export const renderSorting = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  const values = [60, 30, 80, 40, 90, 50];
  const barWidth = 80;
  const spacing = 100;
  const startX = 50;
  
  let subtitle = "";
  
  if (progress < 0.2) {
    const p = easeOutBounce(progress / 0.2);
    subtitle = "Starting with an unsorted array";
    values.forEach((h, i) => {
      const y = height - 50 - h * 2 * p;
      drawRect(ctx, startX + i * spacing, y, barWidth, h * 2 * p, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h.toString(), startX + i * spacing + 25, height - 30);
    });
  } else if (progress < 0.6) {
    const p = (progress - 0.2) / 0.4;
    subtitle = "Compare adjacent elements and swap if needed";
    const sorted = [30, 60, 40, 80, 50, 90];
    const swapPairs = [[0, 1], [2, 3], [4, 5]];
    const currentPair = Math.floor(p * 3);
    
    sorted.forEach((h, i) => {
      let x = startX + i * spacing;
      let color = "#3b82f6";
      
      if (currentPair < swapPairs.length) {
        const [a, b] = swapPairs[currentPair];
        if (i === a || i === b) {
          color = "#fbbf24";
        }
      }
      
      drawRect(ctx, x, height - 50 - h * 2, barWidth, h * 2, color);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h.toString(), x + 25, height - 30);
    });
  } else if (progress < 0.8) {
    const p = (progress - 0.6) / 0.2;
    subtitle = "Elements are now in order";
    const sorted = [30, 40, 50, 60, 80, 90];
    sorted.forEach((h, i) => {
      const greenProgress = Math.max(0, Math.min(1, (p * 6) - i));
      const color = greenProgress > 0 ? `rgb(${lerp(59, 16, greenProgress)}, ${lerp(130, 185, greenProgress)}, ${lerp(246, 129, greenProgress)})` : "#3b82f6";
      drawRect(ctx, startX + i * spacing, height - 50 - h * 2, barWidth, h * 2, color);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h.toString(), startX + i * spacing + 25, height - 30);
    });
  } else {
    const p = (progress - 0.8) / 0.2;
    subtitle = "Array is now sorted in ascending order!";
    const sorted = [30, 40, 50, 60, 80, 90];
    sorted.forEach((h, i) => {
      const bounce = Math.sin(p * Math.PI) * 10;
      drawRect(ctx, startX + i * spacing, height - 50 - h * 2 - bounce, barWidth, h * 2, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h.toString(), startX + i * spacing + 25, height - 30);
    });
    ctx.fillStyle = "#10b981";
    ctx.font = "24px sans-serif";
    ctx.fillText("✓ Sorted!", width / 2 - 60, 80);
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
