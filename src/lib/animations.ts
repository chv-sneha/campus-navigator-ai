export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const drawTypingText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  progress: number,
  fontSize = 16,
  color = "#a0aec0"
) => {
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = color;
  const chars = Math.floor(text.length * progress);
  ctx.fillText(text.substring(0, chars), x, y);
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  progress = 1
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius * progress, 0, Math.PI * 2);
  ctx.fill();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  progress: number
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(lerp(x1, x2, progress), lerp(y1, y2, progress));
  ctx.stroke();
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  progress = 1
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height * progress);
};
