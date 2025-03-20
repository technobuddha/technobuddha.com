import { Drawing, type Rect, type XY } from './drawing.js';

export class CanvasDrawing extends Drawing {
  private readonly canvas: CanvasRenderingContext2D;

  public constructor(element: HTMLCanvasElement) {
    const context = element.getContext('2d')!;
    if (context) {
      super(context.canvas.width, context.canvas.height);

      this.canvas = context;
    } else {
      throw new Error('Failed to get 2D context');
    }
  }

  public clear(color = 'transparent', originX = 0, originY = 0): void {
    this.canvas.setTransform(1, 0, 0, 1, 0, 0);

    if (color === 'transparent') {
      this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    } else {
      this.canvas.fillStyle = color;
      this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    }

    this.canvas.translate(originX, originY);
  }

  public line(start: XY, finish: XY, color: string): void {
    this.canvas.strokeStyle = color;
    this.canvas.beginPath();
    this.canvas.moveTo(start.x, start.y);
    this.canvas.lineTo(finish.x, finish.y);
    this.canvas.stroke();
  }

  public rect(start: XY, finish: XY, color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.fillStyle = color;

    this.canvas.fillRect(start.x, start.y, finish.x - start.x, finish.y - start.y);
  }

  public polygon(points: XY[], color: string): void {
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

    const metrics = this.canvas.measureText(text);

    const x = rect.x + (rect.w - metrics.width) / 2;
    const y =
      rect.y + (rect.h + (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)) / 2;
    this.canvas.fillText(text, x, y);
  }

  public override circle(center: XY, radius: number, color = 'black'): void {
    this.canvas.fillStyle = color;
    this.canvas.beginPath();
    this.canvas.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.canvas.fill();
  }
}
