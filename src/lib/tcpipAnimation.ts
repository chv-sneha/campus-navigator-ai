import { drawRect, drawTypingText } from "@/lib/animations";

export const renderTCPIP = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderTCPIP called with progress:", progress);
  
  const layers = ["Application", "Transport", "Internet", "Network"];
  const layerH = 50;
  const startY = 80;
  const startX = width / 2 - 150;
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "TCP/IP: The protocol stack powering the internet";
    const p = progress / 0.3;
    const visible = Math.min(layers.length, Math.floor(p * layers.length) + 1);
    layers.slice(0, visible).forEach((layer, i) => {
      drawRect(ctx, startX, startY + i * (layerH + 10), 300, layerH, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(layer, startX + 100, startY + i * (layerH + 10) + 32);
    });
  } else if (progress < 0.7) {
    subtitle = "Data flows through each layer with encapsulation";
    layers.forEach((layer, i) => {
      const color = i === Math.floor(((progress - 0.3) / 0.4) * 4) ? "#fbbf24" : "#3b82f6";
      drawRect(ctx, startX, startY + i * (layerH + 10), 300, layerH, color);
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(layer, startX + 100, startY + i * (layerH + 10) + 32);
    });
  } else {
    subtitle = "Reliable communication across networks!";
    layers.forEach((layer, i) => {
      drawRect(ctx, startX, startY + i * (layerH + 10), 300, layerH, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(layer, startX + 100, startY + i * (layerH + 10) + 32);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
