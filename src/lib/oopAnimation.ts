import { drawRect, drawTypingText } from "@/lib/animations";

export const renderOOP = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderOOP called with progress:", progress);
  
  const concepts = ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"];
  const boxW = 140;
  const boxH = 60;
  const startX = (width - boxW * 2 - 40) / 2;
  const startY = 100;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "Object-Oriented Programming: Four core principles";
    const p = progress / 0.3;
    const visible = Math.min(2, Math.floor(p * 2) + 1);
    concepts.slice(0, visible).forEach((concept, i) => {
      drawRect(ctx, startX + (i % 2) * (boxW + 20), startY, boxW, boxH, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(concept, startX + (i % 2) * (boxW + 20) + 10, startY + 35);
    });
  } else if (progress < 0.7) {
    subtitle = "OOP helps organize code into reusable objects";
    const p = (progress - 0.3) / 0.4;
    const visible = Math.min(4, Math.floor(p * 4) + 1);
    concepts.slice(0, visible).forEach((concept, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      drawRect(ctx, startX + col * (boxW + 20), startY + row * (boxH + 20), boxW, boxH, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(concept, startX + col * (boxW + 20) + 10, startY + row * (boxH + 20) + 35);
    });
  } else {
    subtitle = "Master OOP to write clean, maintainable code!";
    concepts.forEach((concept, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      drawRect(ctx, startX + col * (boxW + 20), startY + row * (boxH + 20), boxW, boxH, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(concept, startX + col * (boxW + 20) + 10, startY + row * (boxH + 20) + 35);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
