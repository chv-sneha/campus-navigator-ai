import { drawCircle, drawLine, drawTypingText } from "@/lib/animations";

export const renderGraphs = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  console.log("renderGraphs called with progress:", progress);
  
  const nodes = [
    { x: width / 2, y: 80, val: "A" },
    { x: width / 2 - 120, y: 180, val: "B" },
    { x: width / 2 + 120, y: 180, val: "C" },
    { x: width / 2 - 120, y: 280, val: "D" },
    { x: width / 2 + 120, y: 280, val: "E" }
  ];
  
  const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]];
  
  let subtitle = "";
  
  if (progress < 0.3) {
    subtitle = "A Graph consists of vertices (nodes) and edges";
    const p = progress / 0.3;
    const visibleNodes = Math.min(nodes.length, Math.floor(p * nodes.length) + 1);
    nodes.slice(0, visibleNodes).forEach(node => {
      drawCircle(ctx, node.x, node.y, 25, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(node.val, node.x - 6, node.y + 5);
    });
  } else if (progress < 0.7) {
    subtitle = "Edges connect vertices to form relationships";
    const p = (progress - 0.3) / 0.4;
    const visibleEdges = Math.min(edges.length, Math.floor(p * edges.length) + 1);
    edges.slice(0, visibleEdges).forEach(([a, b]) => {
      drawLine(ctx, nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y, "#60a5fa", 2, 1);
    });
    nodes.forEach(node => {
      drawCircle(ctx, node.x, node.y, 25, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(node.val, node.x - 6, node.y + 5);
    });
  } else {
    subtitle = "Graphs are used in networks, social media, maps, and more!";
    edges.forEach(([a, b]) => {
      drawLine(ctx, nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y, "#60a5fa", 2, 1);
    });
    nodes.forEach(node => {
      drawCircle(ctx, node.x, node.y, 25, "#10b981");
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(node.val, node.x - 6, node.y + 5);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
