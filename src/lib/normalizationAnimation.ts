import { drawRect, drawTypingText } from "@/lib/animations";

export const renderNormalization = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderNormalization called with progress:", progress);
  
  const startX = 100;
  const startY = 100;
  const cellW = 120;
  const cellH = 35;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "Database Normalization: Organizing data efficiently";
    const headers = ["ID", "Name", "Course"];
    headers.forEach((h, i) => {
      drawRect(ctx, startX + i * cellW, startY, cellW - 2, cellH, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h, startX + i * cellW + 10, startY + 22);
    });
    
    const row = ["1", "Alice", "CS101"];
    row.forEach((val, i) => {
      drawRect(ctx, startX + i * cellW, startY + cellH, cellW - 2, cellH, "#374151");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(val, startX + i * cellW + 10, startY + cellH + 22);
    });
  } else if (progress < 0.7) {
    subtitle = "Remove redundancy and ensure data integrity";
    const headers = ["ID", "Name"];
    headers.forEach((h, i) => {
      drawRect(ctx, startX, startY + i * 80, cellW - 2, cellH, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h, startX + 10, startY + i * 80 + 22);
    });
    
    const headers2 = ["CourseID", "Course"];
    headers2.forEach((h, i) => {
      drawRect(ctx, startX + 250, startY + i * 80, cellW - 2, cellH, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(h, startX + 250 + 10, startY + i * 80 + 22);
    });
  } else {
    subtitle = "Normalized tables reduce anomalies and improve consistency!";
    ctx.fillStyle = "#10b981";
    ctx.font = "20px sans-serif";
    ctx.fillText("✓ 1NF → 2NF → 3NF", width / 2 - 100, height / 2);
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
