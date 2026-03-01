import { drawRect, drawTypingText } from "@/lib/animations";

export const renderOSScheduling = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderOSScheduling called with progress:", progress);
  
  const processes = [
    { name: "P1", time: 4, color: "#3b82f6" },
    { name: "P2", time: 3, color: "#10b981" },
    { name: "P3", time: 2, color: "#f59e0b" }
  ];
  
  const startY = height / 2 - 60;
  const barHeight = 40;
  const spacing = 20;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "OS Scheduling: Managing process execution";
    processes.forEach((proc, i) => {
      drawRect(ctx, 100, startY + i * (barHeight + spacing), proc.time * 50, barHeight, proc.color);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(proc.name, 110, startY + i * (barHeight + spacing) + 25);
    });
  } else if (progress < 0.7) {
    subtitle = "Round Robin: Each process gets equal CPU time";
    const p = (progress - 0.3) / 0.4;
    processes.forEach((proc, i) => {
      const highlight = Math.floor(p * 3) === i;
      drawRect(ctx, 100, startY + i * (barHeight + spacing), proc.time * 50, barHeight, highlight ? "#fbbf24" : proc.color);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(proc.name, 110, startY + i * (barHeight + spacing) + 25);
    });
  } else {
    subtitle = "Fair scheduling ensures all processes make progress!";
    processes.forEach((proc, i) => {
      drawRect(ctx, 100, startY + i * (barHeight + spacing), proc.time * 50, barHeight, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(proc.name, 110, startY + i * (barHeight + spacing) + 25);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
