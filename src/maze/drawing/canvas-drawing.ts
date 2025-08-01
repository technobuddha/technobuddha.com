import { type Cartesian, type Rect, toRadians } from '@technobuddha/library';

import { type ClearOptions, Drawing } from './drawing.ts';

export type CanvasDrawingOptions = {
  scale?: number;
};

export class CanvasDrawing extends Drawing {
  private readonly canvas: CanvasRenderingContext2D;
  private readonly scale: number;

  public constructor(element: HTMLCanvasElement, { scale = 1 }: CanvasDrawingOptions = {}) {
    const context = element.getContext('2d')!;
    if (context) {
      super(context.canvas.width, context.canvas.height);

      this.scale = scale;
      this.canvas = context;
    } else {
      throw new Error('Failed to get 2D context');
    }
  }

  public clear(color = 'transparent', { originX = 0, originY = 0 }: ClearOptions = {}): void {
    this.canvas.setTransform(1, 0, 0, 1, 0, 0);
    this.canvas.scale(this.scale, this.scale);
    this.canvas.imageSmoothingEnabled = false;
    this.canvas.imageSmoothingQuality = 'high';

    if (color === 'transparent') {
      this.canvas.clearRect(
        0,
        0,
        this.canvas.canvas.width / this.scale,
        this.canvas.canvas.height / this.scale,
      );
    } else {
      this.canvas.fillStyle = color;
      this.canvas.fillRect(
        0,
        0,
        this.canvas.canvas.width / this.scale,
        this.canvas.canvas.height / this.scale,
      );
    }

    this.canvas.translate(originX, originY);
  }

  public line(start: Cartesian, finish: Cartesian, color: string): void {
    this.canvas.strokeStyle = color;
    this.canvas.beginPath();
    this.canvas.moveTo(start.x, start.y);
    this.canvas.lineTo(finish.x, finish.y);
    this.canvas.stroke();
  }

  public rect(start: Cartesian, finish: Cartesian, color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.fillStyle = color;

    this.canvas.beginPath();
    this.canvas.fillRect(start.x, start.y, finish.x - start.x, finish.y - start.y);
  }

  public polygon(points: Cartesian[], color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.beginPath();
    this.canvas.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      this.canvas.lineTo(point.x, point.y);
    }
    this.canvas.fill();
  }

  public override text(rect: Rect, text: string, color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.font = '8px sans-serif';

    const metrics = this.canvas.measureText(text);

    const x = rect.x + (rect.width - metrics.width) / 2;
    const y =
      rect.y +
      (rect.height + (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)) / 2;
    this.canvas.fillText(text, x, y);
  }

  public override circle(center: Cartesian, radius: number, color = 'black'): void {
    this.canvas.fillStyle = color;
    this.canvas.beginPath();
    this.canvas.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.canvas.fill();
  }

  public arc(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    color = 'white',
  ): void {
    const a0 = toRadians(startAngle, 'degrees');
    const a1 = toRadians(endAngle, 'degrees');

    const x0 = cx + outerRadius * Math.cos(a1);
    const y0 = cy + outerRadius * Math.sin(a1);
    const x1 = cx + innerRadius * Math.cos(a0);
    const y1 = cy + innerRadius * Math.sin(a0);

    this.canvas.fillStyle = color;
    this.canvas.beginPath();
    this.canvas.arc(cx, cy, innerRadius, a0, a1);
    this.canvas.lineTo(x0, y0);
    this.canvas.arc(cx, cy, outerRadius, a1, a0, true);
    this.canvas.lineTo(x1, y1);
    this.canvas.fill();
  }
}
