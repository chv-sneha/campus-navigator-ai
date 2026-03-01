import { easeInOutCubic, drawTypingText, drawCircle, drawLine } from "@/lib/animations";

export const renderBinaryTrees = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
  const nodes = [
    { x: width / 2, y: 100, val: "10", parent: null },
    { x: width / 2 - 100, y: 200, val: "5", parent: 0 },
    { x: width / 2 + 100, y: 200, val: "15", parent: 0 },
    { x: width / 2 - 150, y: 300, val: "3", parent: 1 },
    { x: width / 2 - 50, y: 300, val: "7", parent: 1 }
  ];
  
  let subtitle = "";
  let visibleNodes = 0;
  
  if (progress < 0.25) {
    const p = easeInOutCubic(progress / 0.25);
    subtitle = "A Binary Tree is a hierarchical data structure";
    visibleNodes = 1;
    drawCircle(ctx, nodes[0].x, nodes[0].y, 30, "#3b82f6", p);
    if (p > 0.5) {
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(nodes[0].val, nodes[0].x - 10, nodes[0].y + 5);
    }
  } else if (progress < 0.5) {
    const p = easeInOutCubic((progress - 0.25) / 0.25);
    subtitle = "Each node has at most two children: left and right";
    visibleNodes = 3;
    
    drawCircle(ctx, nodes[0].x, nodes[0].y, 30, "#3b82f6");
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.fillText(nodes[0].val, nodes[0].x - 10, nodes[0].y + 5);
    
    if (p > 0.3) {
      drawLine(ctx, nodes[0].x, nodes[0].y + 30, nodes[1].x, nodes[1].y - 30, "#60a5fa", 2, Math.min(1, (p - 0.3) / 0.3));
    }
    if (p > 0.6) {
      drawLine(ctx, nodes[0].x, nodes[0].y + 30, nodes[2].x, nodes[2].y - 30, "#60a5fa", 2, Math.min(1, (p - 0.6) / 0.4));
    }
    
    [1, 2].forEach((i, idx) => {
      const nodeP = Math.max(0, Math.min(1, (p - 0.5 - idx * 0.2) / 0.3));
      if (nodeP > 0) {
        drawCircle(ctx, nodes[i].x, nodes[i].y, 30, "#3b82f6", nodeP);
        if (nodeP > 0.5) {
          ctx.fillStyle = "#fff";
          ctx.font = "16px sans-serif";
          ctx.fillText(nodes[i].val, nodes[i].x - 10, nodes[i].y + 5);
        }
      }
    });
  } else if (progress < 0.75) {
    const p = easeInOutCubic((progress - 0.5) / 0.25);
    subtitle = "Left subtree values < parent, right subtree values > parent";
    visibleNodes = 5;
    
    [0, 1, 2].forEach(i => {
      if (nodes[i].parent !== null) {
        drawLine(ctx, nodes[nodes[i].parent].x, nodes[nodes[i].parent].y + 30, nodes[i].x, nodes[i].y - 30, "#60a5fa", 2, 1);
      }
    });
    
    if (p > 0.3) {
      drawLine(ctx, nodes[1].x, nodes[1].y + 30, nodes[3].x, nodes[3].y - 30, "#60a5fa", 2, Math.min(1, (p - 0.3) / 0.3));
    }
    if (p > 0.5) {
      drawLine(ctx, nodes[1].x, nodes[1].y + 30, nodes[4].x, nodes[4].y - 30, "#60a5fa", 2, Math.min(1, (p - 0.5) / 0.3));
    }
    
    [0, 1, 2].forEach(i => {
      drawCircle(ctx, nodes[i].x, nodes[i].y, 30, "#3b82f6");
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(nodes[i].val, nodes[i].x - 10, nodes[i].y + 5);
    });
    
    [3, 4].forEach((i, idx) => {
      const nodeP = Math.max(0, Math.min(1, (p - 0.4 - idx * 0.2) / 0.3));
      if (nodeP > 0) {
        drawCircle(ctx, nodes[i].x, nodes[i].y, 30, "#3b82f6", nodeP);
        if (nodeP > 0.5) {
          ctx.fillStyle = "#fff";
          ctx.font = "16px sans-serif";
          ctx.fillText(nodes[i].val, nodes[i].x - 10, nodes[i].y + 5);
        }
      }
    });
  } else {
    const p = (progress - 0.75) / 0.25;
    subtitle = "Searching for value 7 in the tree...";
    
    nodes.slice(0, 5).forEach((node, i) => {
      if (node.parent !== null) {
        drawLine(ctx, nodes[node.parent].x, nodes[node.parent].y + 30, node.x, node.y - 30, "#60a5fa", 2, 1);
      }
    });
    
    const searchPath = [0, 1, 4];
    const currentNode = Math.min(searchPath.length - 1, Math.floor(p * searchPath.length));
    
    nodes.slice(0, 5).forEach((node, i) => {
      const isInPath = searchPath.indexOf(i) <= currentNode;
      const color = isInPath ? "#10b981" : "#3b82f6";
      drawCircle(ctx, node.x, node.y, 30, color);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(node.val, node.x - 10, node.y + 5);
    });
  }
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, height - 40, width, 40);
  drawTypingText(ctx, subtitle, 20, height - 15, 1, 14);
};
