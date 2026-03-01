import { drawRect, drawTypingText } from "@/lib/animations";

export const renderHashing = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderHashing called with progress:", progress);
  
  const keys = ["apple", "banana", "cherry"];
  const indices = [2, 5, 1];
  const tableSize = 8;
  const cellHeight = 35;
  const startY = 80;
  const startX = width / 2 - 100;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "Hash Table: Fast lookup using hash functions";
    for (let i = 0; i < tableSize; i++) {
      drawRect(ctx, startX, startY + i * cellHeight, 200, cellHeight - 2, "#374151");
      ctx.strokeStyle = "#60a5fa";
      ctx.strokeRect(startX, startY + i * cellHeight, 200, cellHeight - 2);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px sans-serif";
      ctx.fillText(`[${i}]`, startX + 10, startY + i * cellHeight + 22);
    }
  } else if (progress < 0.7) {
    subtitle = "Hash function maps keys to array indices";
    const p = (progress - 0.3) / 0.4;
    const visible = Math.min(keys.length, Math.floor(p * keys.length) + 1);
    
    for (let i = 0; i < tableSize; i++) {
      drawRect(ctx, startX, startY + i * cellHeight, 200, cellHeight - 2, "#374151");
      ctx.strokeStyle = "#60a5fa";
      ctx.strokeRect(startX, startY + i * cellHeight, 200, cellHeight - 2);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px sans-serif";
      ctx.fillText(`[${i}]`, startX + 10, startY + i * cellHeight + 22);
    }
    
    for (let i = 0; i < visible; i++) {
      const idx = indices[i];
      ctx.fillStyle = "#10b981";
      ctx.font = "14px sans-serif";
      ctx.fillText(keys[i], startX + 50, startY + idx * cellHeight + 22);
    }
  } else {
    subtitle = "O(1) average time complexity for insert, delete, search!";
    for (let i = 0; i < tableSize; i++) {
      drawRect(ctx, startX, startY + i * cellHeight, 200, cellHeight - 2, "#374151");
      ctx.strokeStyle = "#60a5fa";
      ctx.strokeRect(startX, startY + i * cellHeight, 200, cellHeight - 2);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px sans-serif";
      ctx.fillText(`[${i}]`, startX + 10, startY + i * cellHeight + 22);
    }
    
    keys.forEach((key, i) => {
      const idx = indices[i];
      ctx.fillStyle = "#10b981";
      ctx.font = "14px sans-serif";
      ctx.fillText(key, startX + 50, startY + idx * cellHeight + 22);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
